import React, { useState } from "react"

import styles from "./styles.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { useSafeSdk } from "../../../hooks"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useDispatch, useSelector } from "react-redux"
import {
    getPayoutRequest,
    set_payout_filter,
    syncTxDataWithGnosis,
} from "../../../store/actions/dao-action"
import cross from "../../../assets/Icons/cross.svg"
import {
    setPayment,
    setRejectModal,
} from "../../../store/actions/transaction-action"
import { getSafeServiceUrl } from "../../../utils/multiGnosisUrl"
import { useNetwork } from "wagmi"

const RejectPayment = ({ onClose, signer }) => {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [loading, setLoading] = useState(false)

    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const { chain } = useNetwork()
    const serviceClient = new SafeServiceClient(getSafeServiceUrl(chain?.id))
    const rejectTransaction = async (hash) => {
        setLoading(true)
        const transaction = await serviceClient.getTransaction(hash)

        if (!safeSdk) return

        const rejectionTransaction = await safeSdk.createRejectionTransaction(
            transaction.nonce
        )
        const safeTxHash = await safeSdk.getTransactionHash(
            rejectionTransaction
        )

        const safeSignature = await safeSdk.signTransactionHash(safeTxHash)
        try {
            await serviceClient.proposeTransaction(
                currentDao?.safe_public_address,
                rejectionTransaction.data,
                safeTxHash,
                safeSignature
            )
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter("PENDING"))
            dispatch(setRejectModal(false))
            dispatch(setPayment(null))
        } catch (error) {
            setLoading(false)
        }
        setLoading(false)
    }

    const getContriInfo = () => {
        const tokens = []
        const amount = []
        currentPayment?.metaInfo?.contributions.forEach((x) => {
            x?.tokens.forEach((item) => {
                // //console.log('item', item)
                if (!tokens.includes(item?.details?.symbol)) {
                    tokens?.push(item?.details?.symbol)
                }
                amount?.push(item?.amount * item?.usd_amount)
            })
        })

        const total = amount?.reduce((a, b) => a + b)
        const totalToken = `${tokens?.toString()?.replace(/,/g, "+")}`

        // //console.log('ttt', total, totalToken, currentPayment?.metaInfo?.contributions)
        return { total, totalToken }
    }

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <img
                    onClick={onClose}
                    alt="cross"
                    src={cross}
                    className={styles.cross}
                />
                <div
                    style={{
                        color: "black",
                        textAlign: "start",
                        marginBottom: "2.5rem",
                    }}
                    className={textStyles.ub_36}
                >
                    Are you sure you want to cancel the payment request?
                </div>
                <div className={styles.contibutionDiv}>
                    <div className={styles.contibutionTitle}>
                        <span className={textStyles.m_19}>
                            {currentPayment?.metaInfo?.contributions.length > 1
                                ? `Bundle Payment ${currentPayment?.metaInfo?.contributions?.length}`
                                : currentPayment?.metaInfo?.contributions[0]
                                      .title}
                        </span>
                        <span className={textStyles.m_19}>
                            {getContriInfo()?.total.toFixed(2)}$
                        </span>
                    </div>
                    <span
                        style={{ textAlign: "start" }}
                        className={textStyles.m_19}
                    >
                        {getContriInfo().totalToken}
                    </span>
                </div>
                <div className={styles.btnCnt}>
                    <div
                        onClick={() => dispatch(setRejectModal(false))}
                        style={{ background: "#E0E0E0" }}
                        className={styles.btnDiv}
                    >
                        <div className={textStyles.ub_16}>Cancel</div>
                    </div>
                    <div
                        onClick={async () =>
                            await rejectTransaction(
                                currentPayment?.gnosis?.safeTxHash
                            )
                        }
                        style={{ background: "#FF0000" }}
                        className={styles.btnDiv}
                    >
                        <div
                            style={{ color: "white", cursor: "pointer" }}
                            className={textStyles.ub_16}
                        >
                            {loading
                                ? "Rejecting...."
                                : "Reject Payment request"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RejectPayment

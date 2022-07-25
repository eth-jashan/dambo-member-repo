import React, { useState } from "react"
import edit_active from "../../assets/Icons/edit_active.svg"
import edit_hover from "../../assets/Icons/edit_hover.svg"
import styles from "./style.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { useDispatch, useSelector } from "react-redux"
import { ethers } from "ethers"
import {
    setPayment,
    setTransaction,
} from "../../store/actions/transaction-action"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useSafeSdk } from "../../hooks"
import { message } from "antd"
import { EthSignSignature } from "../../utils/EthSignSignature"
import {
    getPayoutRequest,
    set_payout_filter,
    syncExecuteData,
    syncTxDataWithGnosis,
    setLoading,
    updateListOnExecute,
    set_active_nonce,
} from "../../store/actions/dao-action"
import dayjs from "dayjs"
import { setPayoutToast } from "../../store/actions/toast-action"

import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"

export default function PaymentCard({ item, signer }) {
    const address = useSelector((x) => x.auth.address)
    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const jwt = useSelector((x) => x.auth.jwt)
    const [onHover, setOnHover] = useState(false)
    const nonce = useSelector((x) => x.dao.active_nonce)
    const safeInfo = useSelector((x) => x.dao.safeInfo)
    console.log("Payment", item, safeInfo)
    const serviceClient = new SafeServiceClient(getSafeServiceUrl())

    const currentDao = useSelector((x) => x.dao.currentDao)
    const delegates = safeInfo.owners
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const isReject = item?.status === "REJECTED"

    const executePaymentLoading = useSelector(
        (x) => x.dao.executePaymentLoading
    )
    const activeSelection = currentPayment?.metaInfo?.id === item?.metaInfo?.id

    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.forEach((item) => {
            usd_amount.push(item?.usd_amount * parseFloat(item?.amount))
        })
        let amount_total
        usd_amount?.length === 0
            ? (amount_total = 0)
            : (amount_total = usd_amount.reduce((a, b) => a + b))
        return amount_total.toFixed(2)
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        item?.metaInfo?.contributions.forEach((item) => {
            item.tokens.forEach((x) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
        })
        if (usd_amount_all?.length > 0) {
            const amount_total = usd_amount_all?.reduce((a, b) => a + b)
            return parseFloat(amount_total)?.toFixed(2)
        } else {
            return 0
        }
    }

    const checkApproval = () => {
        const confirm = []
        item.gnosis?.confirmations.forEach((item) => {
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }

    const singlePayout = (x, index) => {
        let tokens = []
        x.tokens.forEach((x) => {
            tokens.push(`${x?.amount} ${x?.details?.symbol}`)
        })

        tokens = tokens?.slice(0, 2)?.toString()
        console.log(x)

        return (
            <div key={index} className={styles.singleItem}>
                <div
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "60%",
                    }}
                >
                    <div className={styles.priceContainer}>
                        <div
                            className={`${textStyles.m_16} ${styles.greyedText}`}
                        >
                            {item?.metaInfo?.contributions?.length > 1
                                ? `${getPayoutTotal(x.tokens)}$`
                                : null}
                        </div>
                    </div>

                    <div className={styles.contriTitle}>
                        <div
                            className={`${textStyles.m_16} ${styles.greyedText}`}
                        >
                            {item?.metaInfo?.contributions?.length > 1
                                ? x?.title
                                : "Single payment"}
                        </div>
                    </div>

                    <div className={styles.tokenContainer}>
                        <div
                            className={`${textStyles.m_16} ${styles.greyedText}`}
                        >
                            {x?.tokens?.length < 3
                                ? tokens.replace(/,/g, "+")
                                : `${tokens.replace(/,/g, "+")} & ${
                                      x.tokens?.length - 3
                                  } others`}
                        </div>
                    </div>
                </div>

                <div className={styles.addressContainer}>
                    <div className={`${textStyles.m_16} ${styles.greyedText}`}>
                        {x?.contributor?.name} •{" "}
                        {x?.contributor?.public_address?.slice(0, 5) +
                            "..." +
                            x?.contributor?.public_address?.slice(-3)}
                    </div>
                </div>
            </div>
        )
    }

    const bundleTitle = () => {
        const tokenSymbol = []

        item?.metaInfo?.contributions?.forEach((item) => {
            item.tokens?.forEach((y) => {
                if (!tokenSymbol.includes(y?.details?.symbol)) {
                    tokenSymbol.push(y?.details?.symbol)
                }
            })
        })

        return (
            <div className={styles.singleItem}>
                <div
                    style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "60%",
                        alignItems: "center",
                    }}
                >
                    <div className={styles.priceContainer}>
                        <div
                            className={`${textStyles.m_16} ${styles.whiterText}`}
                        >
                            {getTotalAmount()}$
                        </div>
                    </div>

                    <div className={styles.contriTitle}>
                        <div
                            className={`${textStyles.m_16} ${styles.whiterText}`}
                        >
                            {item?.metaInfo.contributions?.length > 1
                                ? `Bundled Payments  •  ${item?.metaInfo.contributions?.length}`
                                : item?.metaInfo.contributions[0]?.details.find(
                                      (x) =>
                                          x.fieldName === "Contribution Title"
                                  )?.value}
                        </div>
                    </div>

                    <div className={styles.tokenContainer}>
                        <div
                            className={`${textStyles.m_16} ${styles.whiterText}`}
                        >
                            {tokenSymbol?.length > 3
                                ? `${tokenSymbol
                                      .slice(0, 2)
                                      ?.toString()
                                      ?.replace(/,/g, "+")} & ${
                                      tokenSymbol?.length - 3
                                  } others`
                                : `${tokenSymbol
                                      .slice(0, 2)
                                      ?.toString()
                                      ?.replace(/,/g, "+")}`}
                        </div>
                    </div>
                </div>
                <div className={styles.addressContainer}>
                    <div className={styles.bundleInfo}>
                        <div
                            className={`${textStyles.m_16} ${styles.whiterText}`}
                        >
                            {dayjs(item?.gnosis?.submissionDate).fromNow()}
                        </div>

                        <div
                            style={{
                                flexDirection: "row",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    background:
                                        (onHover || activeSelection) &&
                                        "#5C5C5C",
                                }}
                                className={styles.signerInfo}
                            >
                                <img
                                    alt="edit"
                                    src={
                                        onHover || activeSelection
                                            ? edit_hover
                                            : edit_active
                                    }
                                    className={styles.editIcon}
                                />
                                <div
                                    style={{
                                        color:
                                            (onHover || activeSelection) &&
                                            "#ECFFB8",
                                    }}
                                    className={`${textStyles.m_16} ${styles.whiterText}`}
                                >
                                    {item?.gnosis.confirmations?.length}/
                                    {safeInfo.owners?.length}
                                </div>
                            </div>

                            {/* <img className={styles.menuIcon} alt='menu' src={three_dots} /> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const payout = item.metaInfo?.contributions

    const dispatch = useDispatch()

    const onPaymentPress = () => {
        dispatch(setTransaction(null))
        dispatch(setPayment(item))
    }

    const confirmTransaction = async () => {
        dispatch(setLoading(true))
        if (!safeSdk || !serviceClient) {
            dispatch(setLoading(false))
            return
        }
        const hash = item?.gnosis?.safeTxHash
        let signature
        try {
            signature = await safeSdk.signTransactionHash(hash)
            try {
                await serviceClient.confirmTransaction(hash, signature.data)
                await dispatch(getPayoutRequest())
                await dispatch(syncTxDataWithGnosis())
                await dispatch(set_payout_filter("PENDING"))
                dispatch(setPayment(null))
                dispatch(
                    setPayoutToast("SIGNED", {
                        item: 0,
                        value: getTotalAmount(),
                    })
                )
            } catch (error) {
                console.error(error)
                message.error("Error on confirming sign")
                dispatch(setLoading(false))
            }
        } catch (error) {
            console.error(error)
            message.error("Error on signing payment")
            dispatch(setLoading(false))
            return
        }
        dispatch(setLoading(false))
    }

    const executeSafeTransaction = async (approveBadge) => {
        dispatch(setLoading(true, item?.metaInfo?.id))
        const hash = item?.gnosis?.safeTxHash
        const transaction = await serviceClient.getTransaction(hash)
        const safeTransactionData = {
            to: transaction.to,
            safeTxHash: transaction.safeTxHash,
            value: transaction.value,
            data: transaction.data || "0x",
            operation: transaction.operation,
            safeTxGas: transaction.safeTxGas,
            baseGas: transaction.baseGas,
            gasPrice: transaction.gasPrice,
            gasToken: transaction.gasToken,
            refundReceiver: transaction.refundReceiver,
            nonce: transaction.nonce,
        }
        if (!safeSdk) {
            dispatch(setLoading(false))
            return
        }
        try {
            const safeTransaction = await safeSdk.createTransaction(
                safeTransactionData
            )
            transaction.confirmations.forEach((confirmation) => {
                const signature = new EthSignSignature(
                    confirmation.owner,
                    confirmation.signature
                )
                safeTransaction.addSignature(signature)
            })

            const executeTxResponse = await safeSdk.executeTransaction(
                safeTransaction
            )
            executeTxResponse.transactionResponse &&
                (await executeTxResponse.transactionResponse.wait())
            dispatch(
                setPayoutToast("EXECUTED", {
                    item: 0,
                    value: getTotalAmount(),
                })
            )
            await syncExecuteData(
                item?.metaInfo?.id,
                hash,
                isReject ? "REJECTED" : "APPROVED",
                jwt,
                currentDao?.uuid
            )
        } catch (error) {
            console.log(error)
            if (error.toString() === "Error: Not enough Ether funds") {
                message.error("Not enough funds in safe")
            } else if (error.code === "TRANSACTION_REPLACED") {
                message.error("Transaction Replaced")
            } else {
                message.error("Execution Reverted!! Cannot estimate gas fee")
            }
            dispatch(setLoading(false, item?.metaInfo?.id))
            return
        }

        if (!approveBadge) {
            dispatch(updateListOnExecute(item?.metaInfo?.id))
            dispatch(setPayment(null))
            dispatch(setLoading(false))
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
    }
    const getButtonProperty = () => {
        if (
            checkApproval() &&
            delegates?.length === item?.gnosis?.confirmations?.length &&
            !isReject
        ) {
            return {
                title: "Execute Payment",
                color: "black",
                background: "white",
            }
        } else if (
            checkApproval() &&
            delegates?.length !== item?.gnosis?.confirmations?.length &&
            !isReject
        ) {
            return {
                title: "Payment Signed",
                color: "#ECFFB8",
                background: "#464740",
            }
        } else if (!checkApproval() && !isReject && !onHover) {
            return {
                title: "Sign Payment",
                color: "white",
                background: "#333333",
            }
        } else if (
            !checkApproval() &&
            !isReject &&
            (onHover || activeSelection)
        ) {
            return {
                title: "Sign Payment",
                color: "black",
                background: "white",
            }
        } else if (
            isReject &&
            delegates?.length === item?.gnosis?.confirmations?.length
        ) {
            return {
                title: "Execute Reject",
                color: "white",
                background: "#FF6262",
            }
        } else if (isReject && !checkApproval()) {
            return {
                title: "Reject Payment",
                color: "#FF6262",
                background: "#331414",
            }
        } else if (isReject && checkApproval()) {
            return {
                title: "Payment Rejected",
                color: "#FF6262",
                background: "#331414",
            }
        }
    }

    const executeFunction = async () => {
        await executeSafeTransaction(false)
    }

    const buttonFunc = async (tranx) => {
        if (!executePaymentLoading.loadingStatus) {
            dispatch(setLoading(true, item?.metaInfo?.id))
            if (delegates?.length === item?.gnosis?.confirmations?.length) {
                await executeFunction()
            } else if (checkApproval()) {
                // console.log('Already Signed !!!')
            } else if (!checkApproval() && (onHover || activeSelection)) {
                await confirmTransaction(tranx)
            }
        }
    }

    const showLoading =
        executePaymentLoading?.loadingStatus &&
        executePaymentLoading?.paymentId === item?.metaInfo?.id

    return (
        <div
            style={{
                background: (onHover || activeSelection) && "#333333",
                border: (onHover || activeSelection) && 0,
                borderRadius: (onHover || activeSelection) && "0.75rem",
            }}
            onMouseLeave={() => setOnHover(false)}
            onMouseEnter={() => setOnHover(true)}
            className={styles.container}
        >
            <div style={{ cursor: "pointer" }} onClick={() => onPaymentPress()}>
                {bundleTitle()}
                {(checkApproval() && nonce === item?.gnosis?.nonce) ||
                !checkApproval()
                    ? payout.map((item, index) => singlePayout(item, index))
                    : null}
            </div>
            {(checkApproval() && nonce === item?.gnosis?.nonce) ||
            !checkApproval() ? (
                <div
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        display: "flex",
                        cursor: "pointer",
                    }}
                >
                    <div
                        style={{
                            flexDirection: "row",
                            display: "flex",
                            width: "60%",
                        }}
                    >
                        <div
                            // style={{ marginRight: 0 }}
                            className={styles.priceContainer}
                        />
                        {!item?.gnosis?.isExecuted && (
                            <div
                                onClick={async () => {
                                    await buttonFunc(item?.gnosis?.safeTxHash)
                                }}
                                style={{
                                    background: getButtonProperty()?.background,
                                }}
                                className={styles.btnContainer}
                            >
                                <div
                                    style={{
                                        color: getButtonProperty()?.color,
                                    }}
                                    className={textStyles.ub_14}
                                >
                                    {!showLoading
                                        ? getButtonProperty()?.title
                                        : "Processing..."}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

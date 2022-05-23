import React, { useContext, useState } from "react"
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
    getAllUnclaimedBadges,
    getAllClaimedBadges,
    getAllApprovedBadges,
    updateListOnExecute,
} from "../../store/actions/dao-action"
import dayjs from "dayjs"
import { setPayoutToast } from "../../store/actions/toast-action"
import {
    getIpfsUrl,
    uploadApproveMetaDataUpload,
} from "../../utils/relayFunctions"
import {
    chainSwitch,
    getSelectedChainId,
    processBadgeApprovalToPocp,
    setChainInfoAction,
} from "../../utils/POCPutils"
import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"
import AppContext from "../../appContext"

export default function PaymentCard({ item, signer }) {
    const address = useSelector((x) => x.auth.address)
    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const jwt = useSelector((x) => x.auth.jwt)
    const [onHover, setOnHover] = useState(false)
    const nonce = useSelector((x) => x.dao.active_nonce)
    const myContext = useContext(AppContext)
    const serviceClient = new SafeServiceClient(getSafeServiceUrl())

    const setPocpAction = (status, chainId) => {
        // myContext.setPocpActionValue(status, chainId)
        setChainInfoAction(chainId)
    }
    const currentDao = useSelector((x) => x.dao.currentDao)
    const delegates = currentDao?.signers
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const isReject = item?.status === "REJECTED"

    const community_id = useSelector((x) => x.dao.communityInfo)

    const executePaymentLoading = useSelector(
        (x) => x.dao.executePaymentLoading
    )
    const activeSelection = currentPayment?.metaInfo?.id === item?.metaInfo?.id

    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.map((item, index) => {
            usd_amount.push(item?.usd_amount * parseFloat(item?.amount))
        })
        let amount_total
        usd_amount.length === 0
            ? (amount_total = 0)
            : (amount_total = usd_amount.reduce((a, b) => a + b))
        return amount_total.toFixed(2)
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        item?.metaInfo?.contributions.map((item, index) => {
            item.tokens.map((x, i) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
        })

        const amount_total = usd_amount_all?.reduce((a, b) => a + b)
        return parseFloat(amount_total)?.toFixed(2)
    }

    const checkApproval = () => {
        const confirm = []
        item.gnosis?.confirmations.map((item, index) => {
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }

    const singlePayout = (x, index) => {
        let tokens = []
        x.tokens.map((x, i) => {
            tokens.push(`${x?.amount} ${x?.details?.symbol}`)
        })
        // console.log(tokens)
        tokens = tokens?.slice(0, 2)?.toString()

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
                            {x?.tokens.length < 3
                                ? tokens.replace(/,/g, "+")
                                : `${tokens.replace(/,/g, "+")} & ${
                                      x.tokens?.length - 3
                                  } others`}
                        </div>
                    </div>
                </div>

                <div className={styles.addressContainer}>
                    <div className={`${textStyles.m_16} ${styles.greyedText}`}>
                        {x?.requested_by?.metadata?.name?.split(" ")[0]} •{" "}
                        {x?.requested_by?.public_address?.slice(0, 5) +
                            "..." +
                            x?.requested_by?.public_address?.slice(-3)}
                    </div>
                </div>
            </div>
        )
    }

    const bundleTitle = () => {
        const tokenSymbol = []

        item?.metaInfo?.contributions?.map((item, index) => {
            item.tokens?.map((y, index) => {
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
                                : item?.metaInfo.contributions[0]?.title}
                        </div>
                    </div>

                    <div className={styles.tokenContainer}>
                        <div
                            className={`${textStyles.m_16} ${styles.whiterText}`}
                        >
                            {tokenSymbol.length > 3
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
                                    {delegates.length}
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
        // if (!executePaymentLoading) {
        dispatch(setTransaction(null))
        dispatch(setPayment(item))
        // }
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
                await dispatch(set_payout_filter("PENDING", 1))
                dispatch(setPayment(null))
                dispatch(
                    setPayoutToast("SIGNED", {
                        item: 0,
                        value: getTotalAmount(),
                    })
                )
                // await dispatch(set_payout_filter('PENDING'))
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

    const [approveTitle, setApproveTitle] = useState(false)
    const approvalEventCallback = async (a) => {
        let chainId = getSelectedChainId()
        chainId = ethers.utils.hexValue(chainId.chainId)
        await chainSwitch(chainId)
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllUnclaimedBadges())
        await dispatch(getAllClaimedBadges())
        await dispatch(getPayoutRequest())
        await dispatch(set_payout_filter("PENDING", 1))
        dispatch(setPayment(null))
        dispatch(setLoading(false))
    }

    const executeSafeTransaction = async (c_id, to, approveBadge) => {
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
            if (error.toString() === "Error: Not enough Ether funds") {
                message.error("Not enough funds in safe")
            }
            console.log(
                "error",
                error.toString() === "Error: Not enough Ether funds",
                error.code
            )
            dispatch(setLoading(false, item?.metaInfo?.id))
            return
        }

        if (!approveBadge) {
            dispatch(updateListOnExecute(item?.metaInfo?.id))
            dispatch(setPayment(null))
            dispatch(setLoading(false))
        }

        if (approveBadge) {
            const { cid, url, status } = await getIpfsUrl(
                jwt,
                currentDao?.uuid,
                c_id
            )
            if (!status) {
                const startTime = Date.now()
                const interval = setInterval(async () => {
                    if (Date.now() - startTime > 10000) {
                        clearInterval(interval)
                        // await dispatch(getPayoutRequest())
                        // await dispatch(set_payout_filter("PENDING", 1))
                        dispatch(updateListOnExecute(item?.metaInfo?.id))
                        dispatch(setPayment(null))
                        message.error("failed to get ipfs url")
                        dispatch(setLoading(false))
                    }
                    const { cid, url, status } = await getIpfsUrl(
                        jwt,
                        currentDao?.uuid,
                        c_id
                    )
                    if (status) {
                        clearTimeout(interval)
                        if (cid?.length > 0) {
                            const provider = new ethers.providers.Web3Provider(
                                window.ethereum
                            )
                            const { chainId } = await provider.getNetwork()
                            console.log("chain iddddd", chainId)
                            setPocpAction(true, chainId)
                            // setPocpAction(true)
                            await processBadgeApprovalToPocp(
                                community_id[0].id,
                                to,
                                cid,
                                url,
                                jwt,
                                approvalEventCallback,
                                approvalEventCallback
                            )
                        }
                    }
                }, 3000)
            } else {
                if (cid?.length > 0) {
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                    )
                    const { chainId } = await provider.getNetwork()
                    console.log("chain iddddd", chainId)
                    setPocpAction(true, chainId)
                    await processBadgeApprovalToPocp(
                        community_id[0].id,
                        to,
                        cid,
                        url,
                        jwt,
                        approvalEventCallback,
                        approvalEventCallback
                    )
                }
            }
        }
    }
    const getButtonProperty = () => {
        if (
            checkApproval() &&
            delegates.length === item?.gnosis?.confirmations?.length &&
            !isReject
        ) {
            return {
                title: "Execute Payment",
                color: "black",
                background: "white",
            }
        } else if (
            checkApproval() &&
            delegates.length !== item?.gnosis?.confirmations?.length &&
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
            delegates.length === item?.gnosis?.confirmations?.length
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

    const uploadApproveMetatoIpfs = async () => {
        const metaInfo = []
        const cid = []
        const to = []
        item?.metaInfo?.contributions.map((x, index) => {
            if (x?.mint_badge) {
                metaInfo.push({
                    dao_name: currentDao?.name,
                    contri_title: x?.title,
                    signer: address,
                    claimer: x?.requested_by?.public_address,
                    date_of_approve: dayjs().format("D MMM YYYY"),
                    id: x?.id,
                    dao_logo_url:
                        currentDao?.logo_url ||
                        "https://idreamleaguesoccerkits.com/wp-content/uploads/2017/12/barcelona-logo-300x300.png",
                    work_type: x?.stream.toString(),
                })
                cid.push(x?.id)
                to.push(x?.requested_by?.public_address)
            }
        })
        if (metaInfo.length > 0) {
            const response = await uploadApproveMetaDataUpload(metaInfo, jwt)
            if (response) {
                return { status: true, cid, to }
            } else {
                return { status: false, cid: [], to: [] }
            }
        } else {
            return { status: false, cid: [], to: [] }
        }
    }

    const executeFunction = async () => {
        if (!isReject && community_id[0]?.id) {
            try {
                const res = await uploadApproveMetatoIpfs()
                if (res.status) {
                    await executeSafeTransaction(res?.cid, res?.to, true)
                } else {
                    await executeSafeTransaction(null, null, false)
                    // dispatch(setLoading(false, item?.metaInfo?.id))
                }
            } catch (error) {}
        } else {
            console.log("no pocp", isReject, community_id[0]?.id)
            await executeSafeTransaction(null, null, false)
        }
    }

    const buttonFunc = async (tranx) => {
        if (!executePaymentLoading.loadingStatus) {
            dispatch(setLoading(true, item?.metaInfo?.id))
            if (delegates.length === item?.gnosis?.confirmations?.length) {
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
                            style={{ marginRight: 0 }}
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
                                    {approveTitle ||
                                        (!showLoading
                                            ? getButtonProperty()?.title
                                            : "Processing...")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    )
}

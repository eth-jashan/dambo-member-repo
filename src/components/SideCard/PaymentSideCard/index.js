import React from "react"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { useDispatch, useSelector } from "react-redux"
import { ethers } from "ethers"
import {
    getPayoutRequest,
    set_payout_filter,
    syncTxDataWithGnosis,
    setLoading,
    syncExecuteData,
    updateListOnExecute,
    set_active_nonce,
} from "../../../store/actions/dao-action"
import { EthSignSignature } from "../../../utils/EthSignSignature"
import { message } from "antd"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useSafeSdk } from "../../../hooks"
import {
    setPayment,
    setRejectModal,
} from "../../../store/actions/transaction-action"
import crossSvg from "../../../assets/Icons/cross_white.svg"
import { setPayoutToast } from "../../../store/actions/toast-action"

import Loader from "../../Loader"
import * as dayjs from "dayjs"
import { getSafeServiceUrl } from "../../../utils/multiGnosisUrl"

const PaymentSlideCard = ({ signer }) => {
    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const jwt = useSelector((x) => x.auth.jwt)
    const address = useSelector((x) => x.auth.address)
    const delegates = currentDao?.signers
    const isReject = currentPayment?.status === "REJECTED"
    const nonce = useSelector((x) => x.dao.active_nonce)

    const executePaymentLoading = useSelector(
        (x) => x.dao.executePaymentLoading
    )

    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const serviceClient = new SafeServiceClient(getSafeServiceUrl())
    const confirmTransaction = async (hash) => {
        if (!safeSdk || !serviceClient) return
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
            }
        } catch (error) {
            console.error(error)
            message.error("Error on signing payment")
        }
    }

    const rejectTransaction = () => {
        dispatch(setRejectModal(true))
    }

    const executeSafeTransaction = async (hash, approveBadge) => {
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
                currentPayment?.metaInfo?.id,
                hash,
                isReject ? "REJECTED" : "APPROVED",
                jwt,
                currentDao?.uuid
            )
        } catch (error) {
            if (error.toString() === "Error: Not enough Ether funds") {
                message.error("Not enough funds in safe")
            } else if (error.code === "TRANSACTION_REPLACED") {
                message.error("Transaction Replaced")
            } else {
                message.error("Execution Reverted!! Cannot estimate gas fee")
            }
            dispatch(setLoading(false))

            return
        }

        if (!approveBadge) {
            dispatch(updateListOnExecute(currentPayment?.metaInfo?.id))
            dispatch(setPayment(null))
            dispatch(setLoading(false))
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
    }

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

        currentPayment?.metaInfo?.contributions.forEach((item) => {
            item.tokens.forEach((x) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
        })

        const amount_total = usd_amount_all?.reduce((a, b) => a + b)
        return parseFloat(amount_total)?.toFixed(2)
    }

    const getSignerName = (address) => {
        return currentDao?.signers?.filter(
            (x) => x.public_address === address
        )[0]?.metadata?.name
    }

    const checkApproval = () => {
        const confirm = []
        currentPayment.gnosis?.confirmations?.forEach((item) => {
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }

    const getExecutionMessage = () => {
        if (
            (getButtonTitle()?.title === "Sign Payment" ||
                getButtonTitle()?.title === "Payment Signed") &&
            nonce === currentPayment?.gnosis?.nonce
        ) {
            return "Can be executed once the required signs are done"
        } else if (
            (getButtonTitle()?.title === "Sign Payment" ||
                getButtonTitle()?.title === "Payment Signed") &&
            nonce !== currentPayment?.gnosis?.nonce
        ) {
            return "Can be executed only after previous payments are executed"
        } else if (
            getButtonTitle()?.title === "Execute Payment" &&
            nonce !== currentPayment?.gnosis?.nonce
        ) {
            return "Can be executed only after previous payments are executed"
        } else {
            return ""
        }
    }

    const approve = currentPayment?.gnosis.confirmations
    const renderSigners = () => (
        <div
            style={{ marginBottom: "2.5rem" }}
            className={styles.signerContainer}
        >
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background:
                                    getButtonTitle()?.title ===
                                        "Sign Payment" ||
                                    getButtonTitle()?.title === "Payment Signed"
                                        ? "#676667"
                                        : "white",
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    <div className={styles.headerTimeline_created}>
                        <div
                            style={{ color: "white" }}
                            className={textStyle.m_16}
                        >
                            Created
                        </div>
                        <div
                            style={{ color: "gray" }}
                            className={textStyle.m_16}
                        >
                            {dayjs(
                                currentPayment?.gnosis?.submissionDate
                            ).fromNow()}
                        </div>
                    </div>
                </div>

                <div className={styles.singleHeaderContainer_signer}>
                    <div
                        style={{ height: "1.5rem" }}
                        className={styles.childrenTimeline_signer}
                    />
                </div>
            </div>

            {/* signing container */}
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background:
                                    getButtonTitle()?.title ===
                                        "Sign Payment" ||
                                    getButtonTitle()?.title === "Payment Signed"
                                        ? "#ECFFB8"
                                        : "white",
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    <div className={styles.headerTimeline_signer}>
                        <div
                            style={{
                                color:
                                    getButtonTitle()?.title ===
                                        "Sign Payment" ||
                                    getButtonTitle()?.title === "Payment Signed"
                                        ? "#ECFFB8"
                                        : "white",
                            }}
                            className={textStyle.m_16}
                        >
                            {isReject ? "Signing Cancel" : "Signing"}
                        </div>
                        <div
                            style={{
                                color:
                                    getButtonTitle()?.title ===
                                        "Sign Payment" ||
                                    getButtonTitle()?.title === "Payment Signed"
                                        ? "#ECFFB8"
                                        : "white",
                                marginLeft: "0.5rem",
                            }}
                            className={textStyle.m_16}
                        >
                            {currentPayment?.gnosis?.confirmations?.length} of{" "}
                            {delegates.length}
                        </div>
                    </div>
                </div>

                <div className={styles.singleHeaderContainer_signer}>
                    {delegates.length !==
                    currentPayment?.gnosis?.confirmations.length ? (
                        <div className={styles.childrenTimeline_signer}>
                            {approve.map((item, index) => (
                                <div
                                    className={styles.singleAddress}
                                    key={index}
                                >
                                    <div
                                        style={{
                                            color: isReject ? "red" : "#ECFFB8",
                                        }}
                                        className={`${textStyle.m_16}`}
                                    >
                                        {/* {item?.metadata?.name?.split(' ')[0]}  •   */}
                                        {`${getSignerName(item?.owner)}  •   `}
                                    </div>
                                    <div
                                        style={{ color: "white" }}
                                        className={`${textStyle.m_16}`}
                                    >
                                        {`${item?.owner.slice(
                                            0,
                                            5
                                        )}...${item?.owner.slice(-3)}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            style={{ height: "1.5rem" }}
                            className={styles.childrenTimeline_signer}
                        />
                    )}
                </div>
            </div>

            {/* execution container */}

            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background:
                                    getButtonTitle()?.title !==
                                    "Execute Payment"
                                        ? "white"
                                        : "#ECFFB8",
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    <div className={styles.headerTimeline_signer}>
                        <div
                            style={{
                                color:
                                    getButtonTitle()?.title !==
                                    "Execute Payment"
                                        ? "white"
                                        : "#ECFFB8",
                            }}
                            className={textStyle.m_16}
                        >
                            Execution
                        </div>
                    </div>
                </div>

                {!(
                    currentPayment.gnosis.confirmations.length ===
                        delegates.length &&
                    nonce === currentPayment?.gnosis?.nonce
                ) && (
                    <div className={styles.singleHeaderContainer_signer}>
                        <div
                            style={{ border: 0 }}
                            className={styles.childrenTimeline_signer}
                        >
                            <div
                                style={{ color: "gray", textAlign: "start" }}
                                className={`${textStyle.m_16}`}
                            >
                                {getExecutionMessage()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    const getButtonTitle = () => {
        if (
            checkApproval() &&
            delegates.length ===
                currentPayment?.gnosis?.confirmations?.length &&
            !isReject
        ) {
            return {
                title: "Execute Payment",
                color: "white",
                background: "#6852FF",
            }
        } else if (
            checkApproval() &&
            delegates.length !==
                currentPayment?.gnosis?.confirmations?.length &&
            !isReject
        ) {
            return {
                title: "Payment Signed",
                color: "#ECFFB8",
                background: "#23261C",
            }
        } else if (!checkApproval() && !isReject) {
            return {
                title: "Sign Payment",
                color: "#6852FF",
                background: "white",
            }
        } else if (
            isReject &&
            delegates.length === currentPayment?.gnosis?.confirmations?.length
        ) {
            return {
                title: "Reject Payment",
                color: "white",
                background: "#FF6262",
            }
        } else if (isReject && checkApproval()) {
            return {
                title: "Payment Rejected",
                color: "#FF6262",
                background: "#331414",
            }
        }
    }

    const getRejectButton = () => {
        if (
            checkApproval() &&
            delegates.length === currentPayment?.gnosis?.confirmations?.length
        ) {
            return {
                title: "Reject Payment",
                color: "white",
                background: "#FF6262",
            }
        } else if (
            checkApproval() &&
            delegates.length !== currentPayment?.gnosis?.confirmations?.length
        ) {
            return {
                title: "Payment Rejected",
                color: "#FF6262",
                background: "#331414",
            }
        } else if (!checkApproval()) {
            return {
                title: "Reject Payment",
                color: "white",
                background: "#FF6262",
            }
        }
    }

    const executeTransaction = async (hash) => {
        await executeSafeTransaction(hash, false)
    }

    const renderContribution = (item, index) => (
        <div key={index} className={styles.contribContainer}>
            <div className={styles.leftContent}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {getPayoutTotal(item?.tokens)}$
                </div>
                {item?.tokens?.map((x, i) => (
                    <div
                        key={i}
                        className={`${textStyle.m_16} ${styles.darkerGrey}`}
                    >
                        {x?.amount} {x?.details?.symbol}
                    </div>
                ))}
            </div>
            <div className={styles.rightContainer}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {item?.title}
                </div>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {item?.requested_by?.metadata?.name?.split(" ")[0]} •{" "}
                    {`${item?.requested_by?.public_address.slice(
                        0,
                        5
                    )}...${item?.requested_by?.public_address.slice(-3)}`}
                </div>
            </div>
        </div>
    )

    const buttonFunction = async (hash) => {
        if (!executePaymentLoading.loadingStatus) {
            dispatch(setLoading(true, currentPayment?.metaInfo?.id))
            if (checkApproval()) {
                await executeTransaction(hash)
            } else if (
                checkApproval() &&
                delegates.length !==
                    currentPayment?.gnosis?.confirmations?.length
            ) {
                // console.log("Payment Already Signed")
            } else if (!checkApproval()) {
                await confirmTransaction(hash)
                dispatch(setLoading(false))
            }
        }
    }

    const showLoading =
        executePaymentLoading?.loadingStatus &&
        executePaymentLoading?.paymentId === currentPayment?.metaInfo?.id

    return (
        <div className={styles.container}>
            <img
                onClick={() => dispatch(setPayment(null))}
                src={crossSvg}
                alt="cross"
                className={styles.cross}
            />

            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                {getTotalAmount()}$
            </div>
            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                Bundled Payments •{" "}
                {currentPayment?.metaInfo?.contributions?.length}
            </div>
            <div
                style={{ marginBottom: "2.5rem" }}
                className={`${textStyle.m_23} ${styles.greyishText}`}
            >
                {dayjs(currentPayment?.gnosis?.submissionDate).format(
                    "h:mm a , Do MMM['] YY"
                )}
            </div>
            {currentPayment?.metaInfo?.contributions?.map((item, index) =>
                renderContribution(item, index)
            )}
            {renderSigners()}
            <div
                style={{
                    width: "90%",
                    height: showLoading ? "140px" : "80px",
                    position: "absolute",
                    bottom: 0,
                    background: "black",
                    display: "flex",
                    alignSelf: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                {showLoading && (
                    <div className={styles.loadingBottomBar}>
                        <div className={styles.loadingBottomBarLeft}>
                            <div className={styles.loadingBottomBarHeading}>
                                Payment initiated
                            </div>
                            <div>might take upto a min</div>
                        </div>
                        <Loader />
                    </div>
                )}
                <div
                    style={{
                        width: "100%",
                        background: "black",
                        display: "flex",
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: isReject ? "center" : "space-between",
                    }}
                >
                    {!isReject && !currentPayment?.gnosis?.isExecuted && (
                        <div
                            onClick={() => rejectTransaction()}
                            className={styles.rejectBtn}
                        >
                            <img
                                src={crossSvg}
                                alt="cross"
                                className={styles.crossIcon}
                            />
                        </div>
                    )}
                    {!currentPayment?.gnosis?.isExecuted ? (
                        isReject ? (
                            <div
                                onClick={async () =>
                                    await buttonFunction(
                                        currentPayment?.gnosis?.safeTxHash
                                    )
                                }
                                style={{
                                    background: getRejectButton()?.background,
                                }}
                                className={styles.actionBtnCnt}
                            >
                                <div
                                    style={{ color: getRejectButton()?.color }}
                                    className={textStyle.ub_16}
                                >
                                    {getRejectButton()?.title}
                                </div>
                            </div>
                        ) : getButtonTitle()?.title === "Execute Payment" &&
                          nonce !== currentPayment?.gnosis?.nonce ? null : (
                            <div
                                onClick={async () =>
                                    await buttonFunction(
                                        currentPayment?.gnosis?.safeTxHash
                                    )
                                }
                                style={{
                                    background: getButtonTitle()?.background,
                                    cursor: "pointer",
                                }}
                                className={styles.actionBtnCnt}
                            >
                                <div
                                    style={{ color: getButtonTitle()?.color }}
                                    className={textStyle.ub_16}
                                >
                                    {!showLoading
                                        ? getButtonTitle()?.title
                                        : "Processing..."}
                                </div>
                            </div>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default PaymentSlideCard

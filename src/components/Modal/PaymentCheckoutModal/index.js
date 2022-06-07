import React, { useState } from "react"
import styles from "./styles.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { message } from "antd"
import { useSafeSdk } from "../../../hooks"
import { ethers } from "ethers"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { useDispatch, useSelector } from "react-redux"
import { resetApprovedRequest } from "../../../store/actions/transaction-action"
import ERC20_ABI from "../../../smartContract/erc20.json"

import {
    addActivePaymentBadge,
    createPayout,
    getAllApprovedBadges,
    getAllClaimedBadges,
    getAllUnclaimedBadges,
    getNonceForCreation,
    resetApprovedBadges,
} from "../../../store/actions/dao-action"
import { setPayoutToast } from "../../../store/actions/toast-action"
import chevron_down from "../../../assets/Icons/expand_more_black.svg"
import { getSafeServiceUrl } from "../../../utils/multiGnosisUrl"
import {
    chainSwitch,
    getSelectedChainId,
    processBadgeApprovalToPocp,
    setChainInfoAction,
} from "../../../utils/POCPutils"
import { getIpfsUrl } from "../../../utils/relayFunctions"
import ContributionBadgeItem from "./ContributionBadgeItem"
import POCPStatusCard from "../../POCPStatusCard"

const PaymentCheckoutModal = ({ onClose, signer }) => {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const approved_request = useSelector(
        (x) => x.transaction.approvedContriRequest
    )

    const approvedBadges = useSelector((x) => x.dao.approvedBadges)

    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [loading, setLoading] = useState(false)
    const serviceClient = new SafeServiceClient(getSafeServiceUrl())
    const [checkoutType, setCheckoutType] = useState("contribution")
    const [approverStatus, setApproverStatus] = useState(false)
    const [minting, setMinting] = useState(false)
    const [showOkay, setShowOkay] = useState(false)
    const [approvingFailed, setApprovingFailed] = useState(false)
    const jwt = useSelector((x) => x.auth.jwt)

    const setPocpAction = (chainId) => {
        setChainInfoAction(chainId)
    }

    // const changeCheckoutType = (route) => {
    //     setCheckoutType(route)
    // }

    const onApprovalSuccess = async () => {
        let chainId = getSelectedChainId()
        chainId = ethers.utils.hexValue(chainId.chainId)
        setApproverStatus("switching-back-success")
        await chainSwitch(chainId)
        setShowOkay(true)
        setMinting(false)
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllUnclaimedBadges())
        await dispatch(getAllClaimedBadges())
    }

    const onErrorCallBack = async () => {
        let chainId = getSelectedChainId()
        chainId = ethers.utils.hexValue(chainId.chainId)
        setApproverStatus("switching-back-error")
        await chainSwitch(chainId)
        setMinting(false)
        setApprovingFailed(true)
    }
    const communityInfo = useSelector((x) => x.dao.communityInfo)
    // let communityInfo

    const approvePOCPBadgeWithUrl = async () => {
        const contributionId = []
        const receiverAddress = []
        approvedBadges.forEach((item) => {
            contributionId.push(item?.id)
            receiverAddress.push(item?.requested_by?.public_address)
        })
        setMinting(true)
        const { cid, url, status } = await getIpfsUrl(
            jwt,
            currentDao?.uuid,
            contributionId
        )

        if (!status) {
            const startTime = Date.now()
            const interval = setInterval(async () => {
                if (Date.now() - startTime > 10000) {
                    clearInterval(interval)
                    setMinting(false)
                    setLoading(false)
                    message.error("failed to get ipfs url")
                }
                const { cid, url, status } = await getIpfsUrl(
                    jwt,
                    currentDao?.uuid,
                    contributionId
                )
                if (status) {
                    clearTimeout(interval)
                    if (cid?.length > 0) {
                        if (communityInfo?.length === 1 && communityInfo) {
                            const provider = new ethers.providers.Web3Provider(
                                window.ethereum
                            )
                            const { chainId } = await provider.getNetwork()
                            setPocpAction(chainId)
                            setApproverStatus("switching")
                            await processBadgeApprovalToPocp(
                                communityInfo[0]?.id,
                                receiverAddress,
                                cid,
                                url,
                                jwt,
                                onApprovalSuccess,
                                onErrorCallBack,
                                (x) => setApproverStatus(x)
                            )
                        } else {
                            setApproverStatus("switching-back-error")
                        }
                    }
                }
            }, 3000)
        } else {
            if (cid?.length > 0) {
                if (communityInfo?.length === 1 && communityInfo) {
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                    )
                    const { chainId } = await provider.getNetwork()
                    setPocpAction(chainId)
                    setApproverStatus("switching")
                    await processBadgeApprovalToPocp(
                        communityInfo[0]?.id,
                        receiverAddress,
                        cid,
                        url,
                        jwt,
                        onApprovalSuccess,
                        onErrorCallBack,
                        (x) => setApproverStatus(x)
                    )
                } else {
                    setApproverStatus("switching-back-error")
                }
            }
        }
    }

    const proposeSafeTransaction = async () => {
        setLoading(true)
        const transaction_obj = []
        if (approved_request.length > 0) {
            approved_request.map(async (item) => {
                item?.payout?.map(async (item) => {
                    if (
                        item?.token_type === null ||
                        !item?.token_type ||
                        item?.token_type?.token?.symbol === "ETH"
                    ) {
                        transaction_obj.push({
                            to: ethers.utils.getAddress(item?.address),
                            data: "0x",
                            value: ethers.utils
                                .parseEther(`${item.amount}`)
                                .toString(),
                            operation: 0,
                        })
                    } else if (item?.token_type?.token?.symbol !== "ETH") {
                        const coin = new ethers.Contract(
                            item?.token_type?.tokenAddress ||
                                item?.token_type?.token?.address,
                            ERC20_ABI,
                            signer
                        )

                        const amount = parseFloat(item?.amount) * 1e18
                        transaction_obj.push({
                            to:
                                item?.token_type?.tokenAddress ||
                                item?.token_type?.token?.address,
                            data: coin.interface.encodeFunctionData(
                                "transfer",
                                [
                                    ethers.utils.getAddress(item?.address),
                                    amount.toString(),
                                ]
                            ),
                            value: "0",
                            operation: 0,
                        })
                    }
                })
            })
        }

        if (!safeSdk || !serviceClient) {
            setLoading(false)
            return
        }
        let safeTransaction
        let nonce
        try {
            const activeNounce = await safeSdk.getNonce()
            const nextNonce = await getNonceForCreation(
                currentDao?.safe_public_address
            )
            nonce = nextNonce || activeNounce
            safeTransaction = await safeSdk.createTransaction(transaction_obj, {
                nonce,
            })
        } catch (error) {
            message.error("Error on creating Transaction")
            setLoading(false)
            return
        }

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
        let safeSignature
        try {
            safeSignature = await safeSdk.signTransactionHash(safeTxHash)
        } catch (error) {
            setLoading(false)
        }

        try {
            await serviceClient.proposeTransaction(
                currentDao?.safe_public_address,
                safeTransaction.data,
                safeTxHash,
                safeSignature
            )
            dispatch(createPayout(safeTxHash, nonce))
            dispatch(resetApprovedRequest())
            dispatch(
                setPayoutToast("ACCEPTED_CONTRI", {
                    item: approved_request?.length,
                    value: getTotalAmount(),
                })
            )
            // onClose()
            dispatch(addActivePaymentBadge(true))
            setLoading(false)
        } catch (error) {
            // //console.log('error.........', error)
            setLoading(false)
        }
        setLoading(false)
        onClose()
    }

    const modalHeader = () => (
        <div className={styles.header}>
            <div className={textStyles.ub_23}>
                Approved Requests •{" "}
                {approved_request.length + approvedBadges.length}
            </div>
            <img
                alt="chevron_down"
                src={chevron_down}
                onClick={onClose}
                className={styles.chevron}
                color="black"
            />
        </div>
    )

    const getTotalAmount = () => {
        const usd_amount_all = []

        approved_request.forEach((item) => {
            item.payout.forEach((x) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
        })

        const amount_total = usd_amount_all?.reduce((a, b) => a + b)
        return parseFloat(amount_total)?.toFixed(2)
    }

    const modalSwitchHeader = () => (
        <div className={styles.modalSwitch}>
            <div
                onClick={() => setCheckoutType("contribution")}
                className={`${textStyles.m_16} ${
                    checkoutType === "contribution"
                        ? styles.contributionSelection
                        : null
                } ${styles.cursor}`}
            >
                Contribution badge
            </div>
            <div
                onClick={() => setCheckoutType("payment")}
                className={`${textStyles.m_16} ${styles.paymentRequestTitle} ${
                    checkoutType === "payment" ? styles.paymentSelection : null
                }`}
            >
                Payment Request
            </div>
        </div>
    )

    const modalActionHeader = () => (
        <div className={styles.actionHeaderDiv}>
            <div className={`${textStyles.m_16} ${styles.headerActionTitle}`}>
                {" "}
                {checkoutType === "payment"
                    ? `${approved_request.length} Approved payment request`
                    : `${approvedBadges.length} Approved request`}
            </div>

            {approvedBadges.length > 0 && checkoutType === "contribution" && (
                <div
                    onClick={async () => await approvePOCPBadgeWithUrl()}
                    className={styles.mintBtn}
                >
                    <div
                        style={{ opacity: approverStatus && "0.5" }}
                        className={`${textStyles.ub_16}`}
                    >
                        {approverStatus || minting ? "Minting" : "Mint badges"}
                    </div>
                </div>
            )}

            {approved_request.length > 0 && checkoutType === "payment" && (
                <div
                    onClick={async () => await proposeSafeTransaction()}
                    className={styles.mintBtn}
                >
                    <div
                        style={{ opacity: approverStatus && "0.5" }}
                        className={`${textStyles.ub_16}`}
                    >
                        {loading ? "Signing" : "Sign Payment"}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {approverStatus && (
                    <div className={styles.backdropOnApprover} />
                )}
                {modalHeader()}
                {modalSwitchHeader()}
                {approverStatus !== "switching-back-success" &&
                    modalActionHeader()}
                {checkoutType === "payment" && (
                    <div className={styles.cardWrapper}>
                        {approved_request.map((item, index) => (
                            <ContributionBadgeItem
                                index={index}
                                item={item?.contri_detail}
                                key={index}
                                approvedBadgeLength={approvedBadges.length}
                                checkoutType={checkoutType}
                                payoutDetail={item?.payout}
                                onClose={() => onClose()}
                            />
                        ))}
                    </div>
                )}
                {checkoutType === "contribution" && (
                    <div className={styles.cardWrapper}>
                        {approvedBadges.map((item, index) => (
                            <ContributionBadgeItem
                                index={index}
                                item={item}
                                key={index}
                                approvedBadgeLength={approvedBadges.length}
                                onClose={() => onClose()}
                            />
                        ))}
                    </div>
                )}
                <div
                    onClick={() =>
                        setCheckoutType(
                            checkoutType === "contribution"
                                ? "payment"
                                : "contribution"
                        )
                    }
                    className={`${textStyles.m_16} ${styles.requestTitle}`}
                >
                    {checkoutType === "contribution" &&
                        approved_request.length > 0 &&
                        `${approved_request.length} Payment request`}
                    {checkoutType === "payment" &&
                        approvedBadges.length > 0 &&
                        `${approvedBadges.length} Contribution badge`}
                </div>

                {approverStatus && checkoutType === "contribution" && (
                    <div className={styles.pocpStatusBanner}>
                        <POCPStatusCard
                            approvedBadgeLength={approvedBadges.length}
                            showOkay={showOkay}
                            approverStatus={approverStatus}
                            approvingFailed={approvingFailed}
                            onOkayClick={() => {
                                setApproverStatus(false)
                                setShowOkay(false)
                                dispatch(resetApprovedBadges())

                                onClose()
                            }}
                            onTryAgain={async () =>
                                await approvePOCPBadgeWithUrl()
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentCheckoutModal

import React, { useCallback, useEffect, useState } from "react"
import styles from "./style.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { useDispatch, useSelector } from "react-redux"
import { setTransaction } from "../../store/actions/transaction-action"
import { convertTokentoUsd } from "../../utils/conversion"
import approved_badge from "../../assets/Icons/approved_badge.svg"
import approved_badge_hover from "../../assets/Icons/approvedBadge_hover.svg"
import {
    getAllBadges,
    setBadgesAfterClaim,
    setClaimLoading,
    setContributionDetail,
} from "../../store/actions/contibutor-action"
import { ethers } from "ethers"
import { web3 } from "../../constant/web3"
import { processClaimBadgeToPocp } from "../../utils/POCPutils"
import { syncAllBadges } from "../../store/actions/dao-action"
import POCPProxy from "../../smartContract/POCP_Contracts/POCP.json"

export default function ContributionCard({ item, signer, community_id }) {
    const address = item?.requested_by?.public_address
    const all_approved_badge = useSelector(
        (x) => x.dao.all_approved_badge
    ).filter((x) => x.community.id === community_id)
    const claim_loading = useSelector((x) => x.contributor.claim_loading)
    const jwt = useSelector((x) => x.auth.jwt)

    const checkClaimApprovedSuccess = () => {
        const isTxSuccess = all_approved_badge.filter(
            (x) => x.identifier === item?.id.toString()
        )
        if (
            (item?.approved_tx && isTxSuccess.length === 1) ||
            isTxSuccess.length === 1
        ) {
            return true
        } else {
            return false
        }
    }

    const customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura)

    const getClaimCheck = async () => {
        if (item?.claimed_tx) {
            const reciept = await customHttpProvider.getTransactionReceipt(
                item?.claimed_tx
            )
            if (reciept.status) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const getApproveCheck = useCallback(async () => {
        if (item?.approved_tx) {
            // const customHttpProvider = new ethers.providers.JsonRpcProvider(
            //     web3.infura
            // )
            const reciept = await customHttpProvider.getTransactionReceipt(
                item?.approved_tx
            )
            if (reciept.status) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }, [item?.approved_tx])

    const [approvedBadge, setApprovedBadge] = useState(false)
    const [claimBadge, setClaimBadge] = useState(false)

    const getBadgeStatus = useCallback(async () => {
        const approval = await getApproveCheck()
        const claimStatus = await getClaimCheck()
        setApprovedBadge(approval)
        setClaimBadge(claimStatus)
        //console.log("claim", claimStatus)
    }, [getApproveCheck])

    useEffect(() => {
        getBadgeStatus()
    }, [getBadgeStatus])

    const dispatch = useDispatch()
    const contri_filter_key = useSelector((x) => x.dao.contri_filter_key)
    const role = useSelector((x) => x.dao.role)
    const onContributionPress = async () => {
        if (role === "ADMIN") {
            const ethPrice = await convertTokentoUsd("ETH")
            if (ethPrice && contri_filter_key !== 0) {
                dispatch(setTransaction(item, ethPrice))
            } else if (contri_filter_key === 0) {
                dispatch(
                    setTransaction(item, ethPrice, checkClaimApprovedSuccess())
                )
            }
        } else {
            dispatch(setContributionDetail(item))
        }
    }

    const [onHover, setOnHover] = useState(false)

    const getStatusProperty = () => {
        if (item.status === "APPROVED" && item.payout_status === "REQUESTED") {
            return { color: "#A2FFB7", title: "approved" }
        }
        if (item.status === "REQUESTED") {
            return { color: "#FFC664", title: "active" }
        } else if (item.status === "REJECTED") {
            return { color: "#808080", title: "rejected" }
        } else if (
            item.status === "APPROVED" &&
            item.payout_status === "PAID"
        ) {
            return { color: "#808080", title: "paid" }
        }
    }

    const unclaimed = useSelector((x) => x.contributor.unclaimed)
    const isApprovedToken = () => {
        const token = unclaimed.filter(
            (x) => x.identifier === item?.id.toString()
        )
        if (token.length > 0) {
            return { status: true, token }
        } else {
            return { status: false, token: [] }
        }
    }

    const getContributionStatus = () => {
        if (item.status === "REQUESTED") {
            return { title: "waiting for approval", color: "#FFC664" }
        } else if (item.status === "REJECTED") {
            return { title: "rejected", color: "red" }
        } else if (
            item.status === "APPROVED" &&
            item?.payout_status !== "PAID"
        ) {
            return { title: "waiting for signing", color: "#FFC664" }
        }
        if (item?.status === "APPROVED" && item?.payout_status === "PAID") {
            return { title: "executed", color: "white" }
        }
    }

    const claimBadges = async () => {
        if (!claim_loading.status) {
            dispatch(setClaimLoading(true, item?.id))
            const res = await processClaimBadgeToPocp(
                address,
                isApprovedToken().token[0].id,
                jwt,
                item?.id
            )
            if (res) {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = await provider.getSigner()
                const pocpProxy = new ethers.Contract(
                    web3.POCP_Proxy,
                    POCPProxy.abi,
                    signer
                )
                pocpProxy.on("ClaimedBadge", async (a) => {
                    if (
                        parseInt(a.toString()) ===
                        parseInt(isApprovedToken().token[0].id)
                    ) {
                        try {
                            const userBadge = await pocpProxy.userBadge(
                                parseInt(isApprovedToken().token[0].id)
                            )
                            dispatch(
                                setBadgesAfterClaim(
                                    address,
                                    userBadge.approvedBy,
                                    userBadge.uri,
                                    parseInt(isApprovedToken().token[0].id),
                                    { id: community_id }
                                )
                            )
                            dispatch(setClaimLoading(false, item?.id))
                            const provider = new ethers.providers.Web3Provider(
                                window.ethereum
                            )
                            await provider.provider.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: web3.chainid.rinkeby }],
                            })
                        } catch (error) {
                            dispatch(setClaimLoading(false, item?.id))
                            const provider = new ethers.providers.Web3Provider(
                                window.ethereum
                            )
                            await provider.provider.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: web3.chainid.rinkeby }],
                            })
                        }
                    }
                })
            } else {
                dispatch(setClaimLoading(false, item?.id))
            }
        }
        await dispatch(syncAllBadges())
        dispatch(getAllBadges(address))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }

    return (
        <div
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
            onClick={() => onContributionPress()}
            className={styles.container}
        >
            <div className={styles.titleContainer}>
                <div
                    style={{ fontFamily: onHover && "TelegrafBolder" }}
                    className={`${textStyles.m_16} ${styles.title}`}
                >
                    {item?.title}
                </div>
            </div>
            <div className={styles.statusContainer}>
                {contri_filter_key && role !== "ADMIN" ? null : (
                    <div
                        className={textStyles.m_16}
                        style={{
                            color: getStatusProperty()?.color,
                            textAlign: "start",
                        }}
                    >
                        {getStatusProperty()?.title}
                    </div>
                )}
            </div>
            <div className={styles.descriptionContainer}>
                <div
                    style={{ color: onHover && "white" }}
                    className={`${textStyles.m_16} ${styles.description}`}
                >{`${item?.requested_by?.metadata?.name?.toLowerCase()}  •  ${item?.stream?.toLowerCase()}  •  ${
                    item?.time_spent
                } hrs`}</div>
            </div>
            {role === "ADMIN" ? null : (
                <div className={styles.statusContributorContainer}>
                    <div
                        className={textStyles.m_16}
                        style={{
                            color: getContributionStatus()?.color,
                            textAlign: "start",
                        }}
                    >
                        {getContributionStatus()?.title}
                    </div>
                    {item?.status === "APPROVED" &&
                        item?.payout_status === "PAID" &&
                        isApprovedToken()?.status &&
                        !claimBadge && (
                            <div
                                onClick={async () => await claimBadges()}
                                style={{ color: "#ECFFB8" }}
                                className={textStyles.m_16}
                            >
                                {" "}
                                •{" "}
                                {claim_loading.status &&
                                claim_loading?.id === item?.id
                                    ? "claiming.."
                                    : "claim badge"}
                            </div>
                        )}
                </div>
            )}
            {role === "ADMIN" &&
                ((checkClaimApprovedSuccess() || approvedBadge) &&
                item?.status === "APPROVED" &&
                item?.payout_status === "PAID" ? (
                    onHover ? (
                        <img
                            className={styles.menuIcon}
                            alt="menu"
                            src={approved_badge}
                        />
                    ) : (
                        <img
                            className={styles.menuIcon}
                            alt="menu"
                            src={approved_badge_hover}
                        />
                    )
                ) : (
                    <div className={styles.menuIcon} />
                ))}
        </div>
    )
}
import React, { useState } from "react"
import styles from "./style.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { useDispatch, useSelector } from "react-redux"
import { setTransaction } from "../../store/actions/transaction-action"
import { convertTokentoUsd } from "../../utils/conversion"
import approved_badge from "../../assets/Icons/approved_badge.svg"
import approved_badge_hover from "../../assets/Icons/approvedBadge_hover.svg"
import {
    setClaimLoading,
    setContributionDetail,
} from "../../store/actions/contibutor-action"

import { setChainInfoAction } from "../../utils/wagmiHelpers"

import { useNetwork } from "wagmi"

export default function ContributionCard({ item }) {
    const dispatch = useDispatch()

    const claim_loading = useSelector((x) => x.contributor.claim_loading)
    const jwt = useSelector((x) => x.auth.jwt)
    const contri_filter_key = useSelector((x) => x.dao.contri_filter_key)
    const role = useSelector((x) => x.dao.role)
    const currentTransaction = useSelector(
        role === "ADMIN"
            ? (x) => x.transaction.currentTransaction
            : (x) => x.contributor.contribution_detail
    )

    const setPocpAction = (chainId) => {
        setChainInfoAction(chainId)
    }
    const selectionActive = currentTransaction?.uuid === item.uuid
    const { chain } = useNetwork()

    const onContributionPress = async () => {
        if (role === "ADMIN") {
            const ethPrice = await convertTokentoUsd("ETH")
            // if (ethPrice && contri_filter_key !== 0) {
            //     dispatch(setTransaction(item, ethPrice))
            // } else if (contri_filter_key === 0) {
            //     dispatch(setTransaction(item, ethPrice))
            // }
            dispatch(setTransaction(item, ethPrice))
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
            const chainId = chain?.id
            setPocpAction(chainId)
        }
    }

    return (
        <div
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
            onClick={() => onContributionPress()}
            className={
                onHover || selectionActive ? styles.onHover : styles.container
            }
        >
            <div className={styles.titleContainer}>
                <div
                    style={{
                        fontFamily:
                            (onHover || selectionActive) && "TelegrafBolder",
                    }}
                    className={`${textStyles.m_16} ${styles.title}`}
                >
                    {
                        item?.details?.find(
                            (x) => x.fieldName === "Contribution Title"
                        )?.value
                    }
                </div>
            </div>
            {/* <div className={styles.statusContainer}>
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
            </div> */}
            <div className={styles.descriptionContainer}>
                <div
                    style={{ color: (onHover || selectionActive) && "white" }}
                    className={`${textStyles.m_16} ${styles.description}`}
                >
                    {item?.contributor?.name} ???{" "}
                    {
                        item?.details?.find(
                            (x) => x.fieldName === "Contribution Category"
                        )?.value
                    }{" "}
                    ???{" "}
                    {
                        item?.details?.find(
                            (x) => x.fieldName === "Time Spent in Hours"
                        )?.value
                    }{" "}
                    hrs
                </div>
            </div>
            {role === "ADMIN" ? null : (
                <div className={styles.statusContributorContainer}>
                    {
                        <div
                            className={textStyles.m_16}
                            style={{
                                color:
                                    item.tokens.length === 0 && item.approved_tx
                                        ? "white"
                                        : getContributionStatus()?.color,
                                textAlign: "start",
                            }}
                        >
                            {item.tokens.length === 0 && item.approved_tx
                                ? "executed"
                                : getContributionStatus()?.title}
                        </div>
                    }
                    {item?.tokens.length === 0 && item?.mint_badge && (
                        // isApprovedToken(unclaimed, item?.id)?.status &&
                        <div
                            onClick={async () => await claimBadges()}
                            className={`${textStyles.m_16} ${styles.greyish}`}
                        >
                            {" "}
                            ???{" "}
                            {claim_loading.status &&
                            claim_loading?.id === item?.id
                                ? "claiming.."
                                : "claim badge"}
                        </div>
                    )}
                    {item?.status === "APPROVED" &&
                        item?.payout_status === "PAID" &&
                        item?.tokens.length > 0 && (
                            // isApprovedToken(unclaimed, item?.id)?.status &&
                            <div
                                onClick={async () => await claimBadges()}
                                className={`${textStyles.m_16} ${styles.greyish}`}
                            >
                                {" "}
                                ???{" "}
                                {claim_loading.status &&
                                claim_loading?.id === item?.id
                                    ? "claiming.."
                                    : "claim badge"}
                            </div>
                        )}
                </div>
            )}
            {role === "ADMIN" &&
                // checkClaimApprovedSuccess(all_approved_badge, item?.id) &&
                (item?.status === "APPROVED" &&
                item?.payout_status === "PAID" ? (
                    onHover || selectionActive ? (
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

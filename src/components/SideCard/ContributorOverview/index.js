import React, { useState } from "react"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { useSelector } from "react-redux"
import chevron_down from "../../../assets/Icons/chevron_down.svg"
import chevron_up from "../../../assets/Icons/chevron_up.svg"
import etherscanIcon from "../../../assets/Icons/etherscanIcon.svg"
import openseaIcon from "../../../assets/Icons/openseaIcon.svg"

const ContributionOverview = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(false)

    const payoutInfo = () => (
        <div className={styles.payoutContainer}>
            <div
                style={{ color: "white", textAlign: "start" }}
                className={textStyle.m_16}
            >
                {contributionOverview?.total_payout.length} Payouts
            </div>
            <div className={styles.flex_totalPayout}>
                <div style={{ color: "#FFFFFF66" }} className={textStyle.m_16}>
                    Total Payout
                </div>
                <div style={{ color: "#ECFFB8" }} className={textStyle.m_16}>
                    {(contributionOverview?.total_amount).toFixed(2)}$
                </div>
            </div>
            <div className={styles.divider} />
            {contributionOverview.token_info.length > 0 &&
                contributionOverview.token_info?.map((x, i) => (
                    <div
                        key={i}
                        style={{ marginTop: "1.5rem" }}
                        className={styles.flex_totalPayout}
                    >
                        <div
                            style={{ color: "white" }}
                            className={textStyle.m_14}
                        >
                            {(x?.amount).toFixed(2)} {x?.symbol}
                        </div>
                        <div
                            style={{ color: "#FFFFFF66" }}
                            className={textStyle.m_16}
                        >
                            {(x?.value).toFixed(2)}$
                        </div>
                    </div>
                ))}
        </div>
    )

    const all_claimed_badge = useSelector((x) => x.dao.all_claimed_badge)
    const unclaimed = useSelector((x) => x.dao.all_unclaimed_badges)
    const contributionOverview = useSelector((x) => x.dao.contributionOverview)
    const allMembershipBadges = useSelector((x) => x.dao.membershipBadges)
    const membershipVouchers = useSelector((x) => x.dao.membershipVoucher)
    const membershipVouchersWithInfo = membershipVouchers?.map((badge) => {
        const badgeInfo = allMembershipBadges.find(
            (ele) => ele.uuid === badge.membership_uuid
        )
        return {
            ...badge,
            ...badgeInfo,
        }
    })
    const membershipBadgesForAddress = useSelector(
        (x) => x.dao.membershipBadgesForAddress
    )

    // const unClaimedBadges = voucherInfo.filter((badge) => {
    //     const indexOfBadge = membershipBadgesForAddress.findIndex(
    //         (ele) =>
    //             ele.level.toString() === badge.level.toString() &&
    //             ele.category.toString() === badge.category.toString()
    //     )
    //     return indexOfBadge === -1
    // })

    let currentMembershipBadge = null
    if (membershipBadgesForAddress?.length) {
        const temp = allMembershipBadges.filter(
            (badge) =>
                badge?.level?.toString() ===
                    membershipBadgesForAddress[0]?.level?.toString() &&
                badge?.category?.toString() ===
                    membershipBadgesForAddress[0]?.category?.toString()
        )
        currentMembershipBadge = {
            ...temp[0],
            ...membershipBadgesForAddress[0],
        }
    }

    const contributionStats = () => (
        <div className={styles.contributionContainer}>
            <div
                style={{
                    color: "white",
                    textAlign: "start",
                    borderBottom: "1px solid #292929",
                    paddingTop: "1rem",
                    paddingLeft: "1rem",
                    paddingBottom: "1rem",
                }}
                className={textStyle.m_14}
            >
                {contributionOverview?.total_payout.length} Payouts
            </div>
            <div
                style={{
                    color: "white",
                    textAlign: "start",
                    borderBottom: "1px solid #292929",
                    paddingTop: "1rem",
                    paddingLeft: "1rem",
                    paddingBottom: "1rem",
                }}
                className={textStyle.m_14}
            >
                {all_claimed_badge.length} Claimed badges
            </div>
            <div
                style={{
                    color: "white",
                    textAlign: "start",
                    paddingTop: "1rem",
                    paddingLeft: "1rem",
                    paddingBottom: "1rem",
                }}
                className={textStyle.m_14}
            >
                {unclaimed.length} Unclaimed badges
            </div>
        </div>
    )

    const toggle = () => {
        setIsToggleOpen((isToggleOpen) => !isToggleOpen)
    }

    const openEtherscan = () => {
        console.log("current membership badge is", currentMembershipBadge)
        window.open(
            `https://mumbai.polygonscan.com/token/${currentMembershipBadge?.contractAddress?.id}?a=${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    return (
        <div className={styles.container}>
            <div
                style={{ color: "white", textAlign: "start" }}
                className={textStyle.ub_23}
            >
                Overview
            </div>
            {!currentMembershipBadge ? (
                <div className={styles.overviewText}>
                    All your membership, contribution, and payout overview will
                    come here.
                </div>
            ) : (
                <div className={styles.badgeOverview}>
                    {/* <img
                        src={currentMembershipBadge?.image_url}
                        alt=""
                        className={styles.badgeImage}
                    /> */}
                    <video autoPlay loop className={styles.badgeImage}>
                        <source src={currentMembershipBadge?.image_url} />
                    </video>
                    <div>
                        <div className={styles.toggleHeader} onClick={toggle}>
                            <div>
                                <div>{currentMembershipBadge?.name}</div>
                                {/* <div>2 months ago</div> */}
                            </div>
                            <div>
                                <img
                                    src={
                                        isToggleOpen ? chevron_up : chevron_down
                                    }
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${
                            isToggleOpen ? styles.toggleContentShown : ""
                        } ${styles.toggleContent}`}
                    >
                        <div className={styles.lineBreak}></div>
                        <div className={styles.toggleContentRow}>
                            View on Opensea
                            <img src={openseaIcon} alt="" />
                        </div>
                        <div className={styles.lineBreak}></div>
                        <div
                            className={styles.toggleContentRow}
                            onClick={openEtherscan}
                        >
                            View on Etherscan
                            <img src={etherscanIcon} alt="" />
                        </div>
                    </div>
                </div>
            )}
            {/* {payoutInfo()} */}
            {/* {contributionStats()} */}
        </div>
    )
}

export default ContributionOverview

import React, { useEffect, useState } from "react"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { useSelector } from "react-redux"
import chevron_down from "../../../assets/Icons/chevron_down.svg"
import chevron_up from "../../../assets/Icons/chevron_up.svg"
import etherscanIcon from "../../../assets/Icons/etherscanIcon.svg"
import openseaIcon from "../../../assets/Icons/openseaIcon.svg"
import { getSelectedChainId } from "../../../utils/POCPutils"
const ContributionOverview = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(false)
    const currentDao = useSelector((x) => x.dao.currentDao)

    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)

    const all_claimed_badge = useSelector((x) => x.dao.all_claimed_badge)
    const unclaimed = useSelector((x) => x.dao.all_unclaimed_badges)
    const contributionOverview = useSelector((x) => x.dao.contributionOverview)
    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )
    const membershipBadges = useSelector(
        (x) => x.membership.contributorClaimedDataBackend
    )
    const [currentMembershipBadge, setCurrentMembershipBadge] = useState(false)
    const getCurrentBadgeUpdated = () => {
        const metadatSubgraph = membershipBadgesForAddress.filter(
            (x) => x?.level === membershipBadges?.membership?.level.toString()
        )

        setCurrentMembershipBadge({
            ...metadatSubgraph[0],
            ...membershipBadges.membership,
        })
        console.log("Claimed Token From BE", membershipBadges)
    }
    useEffect(() => {
        if (
            currentDao &&
            proxyContract &&
            membershipBadgesForAddress?.length > 0
        ) {
            getCurrentBadgeUpdated()
        }
    }, [currentDao, proxyContract, membershipBadgesForAddress])
    const isImage = currentDao?.uuid !== "93ba937e02ea4fdb9633c2cb27345200"

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
        console.log(currentMembershipBadge)
        window.open(
            `https://polygonscan.com/token/${currentMembershipBadge?.contractAddress[0]?.id}?a=${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://opensea.io/assets/matic/${currentMembershipBadge?.contractAddress?.id}/${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    console.log(
        "cuurent badge",
        currentMembershipBadge,
        currentDao?.uuid !== "93ba937e02ea4fdb9633c2cb27345200",
        isImage
    )

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
                    {isImage ? (
                        <img
                            src={currentMembershipBadge.image_url}
                            alt=""
                            className={styles.badgeImage}
                        />
                    ) : (
                        <video
                            autoPlay
                            loop
                            className={styles.badgeImage}
                            muted
                        >
                            <source src={currentMembershipBadge?.image_url} />
                        </video>
                    )}

                    <div>
                        <div className={styles.toggleHeader} onClick={toggle}>
                            <div>
                                <div>{currentMembershipBadge.name}</div>
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
                        <div
                            className={styles.toggleContentRow}
                            onClick={openOpensea}
                        >
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

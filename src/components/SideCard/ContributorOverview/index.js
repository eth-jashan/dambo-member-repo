import React, { useEffect, useState } from "react"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { useSelector } from "react-redux"
import chevron_down from "../../../assets/Icons/chevron_down.svg"
import chevron_up from "../../../assets/Icons/chevron_up.svg"
import etherscanIcon from "../../../assets/Icons/etherscanIcon.svg"
import openseaIcon from "../../../assets/Icons/openseaIcon.svg"
import apiClient from "../../../utils/api_client"
import routes from "../../../constant/routes"
import { getSelectedChainId } from "../../../utils/POCPutils"
const ContributionOverview = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(false)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const jwt = useSelector((x) => x.auth.jwt)
    const getAllClaimed = useSelector((x) => x.membership.claimedTokens)
    const address = useSelector((x) => x.auth.address)
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    console.log("get all", getAllClaimed)

    // const payoutInfo = () => (
    //     <div className={styles.payoutContainer}>
    //         <div
    //             style={{ color: "white", textAlign: "start" }}
    //             className={textStyle.m_16}
    //         >
    //             {contributionOverview?.total_payout.length} Payouts
    //         </div>
    //         <div className={styles.flex_totalPayout}>
    //             <div style={{ color: "#FFFFFF66" }} className={textStyle.m_16}>
    //                 Total Payout
    //             </div>
    //             <div style={{ color: "#ECFFB8" }} className={textStyle.m_16}>
    //                 {(contributionOverview?.total_amount).toFixed(2)}$
    //             </div>
    //         </div>
    //         <div className={styles.divider} />
    //         {contributionOverview.token_info.length > 0 &&
    //             contributionOverview.token_info?.map((x, i) => (
    //                 <div
    //                     key={i}
    //                     style={{ marginTop: "1.5rem" }}
    //                     className={styles.flex_totalPayout}
    //                 >
    //                     <div
    //                         style={{ color: "white" }}
    //                         className={textStyle.m_14}
    //                     >
    //                         {(x?.amount).toFixed(2)} {x?.symbol}
    //                     </div>
    //                     <div
    //                         style={{ color: "#FFFFFF66" }}
    //                         className={textStyle.m_16}
    //                     >
    //                         {(x?.value).toFixed(2)}$
    //                     </div>
    //                 </div>
    //             ))}
    //     </div>
    // )

    const all_claimed_badge = useSelector((x) => x.dao.all_claimed_badge)
    const unclaimed = useSelector((x) => x.dao.all_unclaimed_badges)
    const contributionOverview = useSelector((x) => x.dao.contributionOverview)
    const allMembershipBadges = useSelector(
        (x) => x.membership.membershipBadges
    )
    const membershipVouchers = useSelector(
        (x) => x.membership.membershipVoucher
    )
    // const membershipVouchersWithInfo = membershipVouchers?.map((badge) => {
    //     const badgeInfo = allMembershipBadges.find(
    //         (ele) => ele.uuid === badge.membership_uuid
    //     )
    //     return {
    //         ...badge,
    //         ...badgeInfo,
    //     }
    // })
    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )
    const selectedChainId = getSelectedChainId()
    const [currentMembershipBadge, setCurrentMembershipBadge] = useState(false)
    const getCurrentBadgeUpdated = async () => {
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getDaoMembership}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            console.log("here badges", res.data.data.length)
            if (res.data.data.length > 0) {
                res.data.data.forEach((x) => {
                    if (
                        x.dao_details.chain_id === selectedChainId.chainId &&
                        x.dao_details.uuid === currentDao?.uuid
                        // x.membership_update
                    ) {
                        // dao_details.push(x)
                        // const backendMembership
                        const level = x.memberships[0].level.toString()
                        const metadataBE = x.memberships[0]

                        const metadatSubgraph =
                            membershipBadgesForAddress.filter(
                                (x) => x.level === level
                            )
                        console.log(metadatSubgraph[0])

                        setCurrentMembershipBadge({
                            ...metadatSubgraph[0],
                            ...metadataBE,
                        })
                    }
                })
                // console.log(upgradedMembership, selectedChainId, currentDao)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    useEffect(async () => {
        console.log(currentDao)
        if (
            currentDao &&
            proxyContract &&
            membershipBadgesForAddress?.length > 0
        ) {
            await getCurrentBadgeUpdated()
        }
    }, [currentDao, proxyContract, membershipBadgesForAddress])
    // if (membershipBadgesForAddress?.length) {
    //     const temp = allMembershipBadges.filter(
    //         (badge) =>
    //             badge?.level?.toString() ===
    //                 membershipBadgesForAddress[
    //                     membershipBadgesForAddress.length - 1
    //                 ]?.level?.toString() &&
    //             badge?.category?.toString() ===
    //                 membershipBadgesForAddress[
    //                     membershipBadgesForAddress.length - 1
    //                 ]?.category?.toString()
    //     )
    //     currentMembershipBadge = {
    //         ...temp[0],
    //         ...membershipBadgesForAddress[
    //             membershipBadgesForAddress.length - 1
    //         ],
    //     }
    // }
    // console.log(
    //     "Badge Info",
    //     allMembershipBadges,
    //     membershipBadgesForAddress,
    //     membershipBadgesForAddress[1],
    //     currentMembershipBadge
    // )
    console.log(currentMembershipBadge?.contractAddress)

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
        // console.log("current membership badge is", currentMembershipBadge)
        console.log(currentMembershipBadge)
        window.open(
            `https://polygonscan.com/token/${currentMembershipBadge?.contractAddress[0]?.id}?a=${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        console.log(currentMembershipBadge)
        window.open(
            `https://opensea.io/assets/matic/${currentMembershipBadge?.contractAddress?.id}/${currentMembershipBadge?.tokenID}`,
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
                    {currentDao?.uuid !== "93ba937e02ea4fdb9633c2cb27345200" ? (
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
                    {/* <video autoPlay loop className={styles.badgeImage} muted>
                        <source src={currentMembershipBadge?.image_url} />
                    </video> */}
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

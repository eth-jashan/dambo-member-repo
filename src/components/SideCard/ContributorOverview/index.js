import React, { useEffect, useState } from "react"
import "./styles.scss"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { useSelector } from "react-redux"
import chevron_down from "../../../assets/Icons/chevron_down.svg"
import chevron_up from "../../../assets/Icons/chevron_up.svg"
import etherscanIcon from "../../../assets/Icons/etherscanIcon.svg"
import openseaIcon from "../../../assets/Icons/openseaIcon.svg"
import compare_arrows from "../../../assets/Icons/compare_arrows.svg"
import twitterIcon from "../../../assets/Icons/twitter-icon.svg"
import ContributionIconGrey from "../../../assets/Icons/ContributionIconGrey.svg"
import appreciationIconGrey from "../../../assets/Icons/appreciationIconGrey.svg"
import payoutInfo from "../../../assets/Icons/payoutInfo.svg"

// import { getSelectedChainId } from "../../../utils/POCPutils"
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
    }

    const levels = [
        {
            name: "level1",
            time: "2 months ago",
        },
        {
            name: "level2",
            time: "2 months ago",
        },
    ]

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

    // const contributionStats = () => (
    //     <div className="contributionContainer">
    //         <div
    //             style={{
    //                 color: "white",
    //                 textAlign: "start",
    //                 borderBottom: "1px solid #292929",
    //                 paddingTop: "1rem",
    //                 paddingLeft: "1rem",
    //                 paddingBottom: "1rem",
    //             }}
    //             className={textStyle.m_14}
    //         >
    //             {contributionOverview?.total_payout.length} Payouts
    //         </div>
    //         <div
    //             style={{
    //                 color: "white",
    //                 textAlign: "start",
    //                 borderBottom: "1px solid #292929",
    //                 paddingTop: "1rem",
    //                 paddingLeft: "1rem",
    //                 paddingBottom: "1rem",
    //             }}
    //             className={textStyle.m_14}
    //         >
    //             {all_claimed_badge.length} Claimed badges
    //         </div>
    //         <div
    //             style={{
    //                 color: "white",
    //                 textAlign: "start",
    //                 paddingTop: "1rem",
    //                 paddingLeft: "1rem",
    //                 paddingBottom: "1rem",
    //             }}
    //             className={textStyle.m_14}
    //         >
    //             {unclaimed.length} Unclaimed badges
    //         </div>
    //     </div>
    // )

    const toggle = () => {
        setIsToggleOpen((isToggleOpen) => !isToggleOpen)
    }

    const openEtherscan = () => {
        window.open(
            `https://polygonscan.com/token/${currentMembershipBadge?.contractAddress?.[0]?.id}?a=${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://opensea.io/assets/matic/${currentMembershipBadge?.contractAddress?.id}/${currentMembershipBadge?.tokenID}`,
            "_blank"
        )
    }

    return (
        <div className="contributor-side-card-overview-container">
            <div
                style={{ color: "white", textAlign: "start" }}
                className={textStyle.ub_23}
            >
                Overview
            </div>
            {!currentMembershipBadge ? (
                <div className="overviewText">
                    All your membership, contribution, and payout overview will
                    come here.
                </div>
            ) : (
                <>
                    <div className="badgeOverview">
                        {isImage ? (
                            <img
                                src={currentMembershipBadge.image_url}
                                alt=""
                                className="badgeImage"
                            />
                        ) : (
                            <video autoPlay loop className="badgeImage" muted>
                                <source
                                    src={currentMembershipBadge?.image_url}
                                />
                            </video>
                        )}

                        <div>
                            <div className="toggleHeader" onClick={toggle}>
                                <div>
                                    <div>{currentMembershipBadge.name}</div>
                                    {/* <div>2 months ago</div> */}
                                </div>
                                <div>
                                    <img
                                        src={
                                            isToggleOpen
                                                ? chevron_up
                                                : chevron_down
                                        }
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={`${
                                isToggleOpen ? "toggleContentShown" : ""
                            } toggleContent`}
                        >
                            <div>
                                {levels.map((level, index) => (
                                    <div className="level-row" key={index}>
                                        <div>
                                            <img src={compare_arrows} alt="" />
                                            {level?.name}
                                        </div>
                                        <div className="level-time">
                                            {level.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="lineBreak"></div>
                            <div className="badge-footer">
                                <div className="footer-icons">
                                    <div
                                        className="badge-footer-icon"
                                        onClick={openOpensea}
                                    >
                                        <img src={openseaIcon} alt="" />
                                    </div>
                                    <div
                                        className="badge-footer-icon"
                                        onClick={openEtherscan}
                                    >
                                        <img src={etherscanIcon} alt="" />
                                    </div>
                                </div>
                                <div>
                                    <button>
                                        Share Badge{" "}
                                        <img src={twitterIcon} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="other-badge-and-payout-overview">
                        <div className="other-badge-background">
                            <div className="other-info-row">
                                <div className="row-heading">
                                    23 Contributions
                                </div>
                                <div className="subrow-details">
                                    <div>123 badges</div>
                                    <div className="subrow-icons-wrapper">
                                        <div className="other-badge-wrapper">
                                            <img
                                                src={ContributionIconGrey}
                                                alt=""
                                            />
                                            36
                                        </div>
                                        <div className="other-badge-wrapper">
                                            <img
                                                src={appreciationIconGrey}
                                                alt=""
                                            />
                                            87
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="horizontal-divider" />
                            <div className="other-info-row">
                                <div className="row-heading">
                                    23 Contributions
                                </div>
                                <div className="subrow-details">
                                    <div>123 badges</div>
                                    <div className="subrow-payout">1250$</div>
                                </div>
                            </div>
                        </div>
                        <div className="payout-row-wrapper">
                            <div className="payout-row">
                                <div>0.25 ETH</div>
                                <div>1250$</div>
                            </div>
                            <div className="payout-row">
                                <div>0.500 USDC</div>
                                <div>1250$</div>
                            </div>
                        </div>
                        <div className="last-payout-info">
                            <img src={payoutInfo} alt="" />
                            500 USDC and 0.25 ETH transferred on 3
                            <div className="right-shim" />
                        </div>
                    </div>
                </>
            )}
            {/* {payoutInfo()} */}
            {/* {contributionStats()} */}
        </div>
    )
}

export default ContributionOverview

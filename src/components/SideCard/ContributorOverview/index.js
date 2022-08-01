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
import ContributionContributorSideCard from "../../ContributorFlow/component/ContributionContributorSideCard"
import { assets } from "../../../constant/assets"

// import { getSelectedChainId } from "../../../utils/POCPutils"
const ContributionOverview = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(false)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const membershipBadges = useSelector((x) => x.membership.membershipBadges)
    const contributionOverview = useSelector(
        (x) => x.contributor.contributorStats
    )

    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )
    const contributorSelectionContribution = useSelector(
        (x) => x.contributor.contributorSelectionContribution
    )
    const [currentMembershipBadge, setCurrentMembershipBadge] = useState(false)

    const getCurrentBadgeUpdated = () => {
        const membershipInfo = []
        membershipBadgesForAddress.forEach((item, i) => {
            membershipBadges.forEach((x) => {
                if (item.level === x.level.toString() && i === 0) {
                    membershipInfo.push(x)
                }
            })
        })
        console.log(membershipBadgesForAddress, membershipInfo)
        setCurrentMembershipBadge({
            ...membershipBadgesForAddress[0],
            ...membershipInfo[0],
        })
    }
    const dataSource = useSelector((x) => x.dao.all_claimed_badge)
    const levels = membershipBadgesForAddress?.map((x, i) => {
        if (i > 0) {
            return {
                name: x.level,
                time: "2 months ago",
            }
        }
    })
    console.log("levels", contributionOverview)

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

    const toggle = () => {
        setIsToggleOpen((isToggleOpen) => !isToggleOpen)
    }

    const openEtherscan = () => {
        window.open(
            `https://polygonscan.com/token/${currentMembershipBadge?.contractAddress?.id}?a=${currentMembershipBadge?.tokenID}`,
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
        <div
            style={{ paddingTop: contributorSelectionContribution && 0 }}
            className="contributor-side-card-overview-container"
        >
            <div>
                {contributorSelectionContribution && (
                    <img className="cross-icon" src={assets.icons.crossWhite} />
                )}
                {!contributorSelectionContribution && (
                    <div
                        style={{ color: "white", textAlign: "start" }}
                        className={textStyle.ub_23}
                    >
                        Overview
                    </div>
                )}
                {!currentMembershipBadge ? (
                    <div className="overviewText">
                        All your membership, contribution, and payout overview
                        will come here.
                    </div>
                ) : contributorSelectionContribution ? (
                    <ContributionContributorSideCard />
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
                                <video
                                    autoPlay
                                    loop
                                    className="badgeImage"
                                    muted
                                >
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
                                    {levels.map((level, index) => {
                                        if (level) {
                                            return (
                                                <div
                                                    className="level-row"
                                                    key={index}
                                                >
                                                    <div>
                                                        <img
                                                            src={compare_arrows}
                                                            alt=""
                                                        />
                                                        {level?.name}
                                                    </div>
                                                    <div className="level-time">
                                                        {level.time}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
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
                                            Share{" "}
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
                                        {contributionOverview?.contrib_count}{" "}
                                        Contributions
                                    </div>
                                    <div className="subrow-details">
                                        <div>{dataSource.length} badges</div>
                                        <div className="subrow-icons-wrapper">
                                            <div className="other-badge-wrapper">
                                                <img
                                                    src={ContributionIconGrey}
                                                    alt=""
                                                />
                                                {dataSource.length}
                                            </div>
                                            <div className="other-badge-wrapper">
                                                <img
                                                    src={appreciationIconGrey}
                                                    alt=""
                                                />
                                                0
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="horizontal-divider" />
                                <div className="other-info-row">
                                    <div className="row-heading">
                                        {contributionOverview?.contrib_count}{" "}
                                        Contributions
                                    </div>
                                    <div className="subrow-details">
                                        <div>{dataSource.length} badges</div>
                                        <div className="subrow-payout">
                                            {contributionOverview?.total_payout_usd?.toFixed(
                                                2
                                            ) || 0}
                                            $
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {contributionOverview?.total_payout_usd &&
                                Object?.keys(
                                    contributionOverview?.payout_tokens
                                )?.map((x, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className="payout-row-wrapper"
                                        >
                                            <div className="payout-row">
                                                <div>
                                                    {contributionOverview?.payout_tokens[
                                                        x
                                                    ]?.token_amount?.toFixed(
                                                        4
                                                    )}{" "}
                                                    {x}
                                                </div>
                                                <div>
                                                    {contributionOverview?.payout_tokens[
                                                        x
                                                    ]?.total_payout_usd?.toFixed(
                                                        4
                                                    )}
                                                    {contributionOverview?.payout_tokens[
                                                        x
                                                    ]?.usd_amount?.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            {/* <div className="last-payout-info">
                                <img src={payoutInfo} alt="" />
                                500 USDC and 0.25 ETH transferred on 3
                                <div className="right-shim" />
                            </div> */}
                        </div>
                    </>
                )}
                {/* {payoutInfo()} */}
                {/* {contributionStats()} */}
            </div>
        </div>
    )
}

export default ContributionOverview

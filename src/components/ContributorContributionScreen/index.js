import React, { useEffect, useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import {
    claimMembershipVoucher,
    setMembershipBadgeClaimed,
    setDisableClaimBtn,
    setShowMetamaskSignText,
} from "../../store/actions/membership-action"
import magic_button from "../../assets/Icons/magic_button.svg"
import etherscan_white from "../../assets/Icons/etherscan-white.svg"
import opensea_white from "../../assets/Icons/opensea-white.svg"
import cross from "../../assets/Icons/cross.svg"
// import axios from "axios"
import { useNetwork } from "wagmi"

export default function ContributorContributionScreen() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const allMembershipBadges = useSelector(
        (x) => x.membership.membershipBadges
    )
    const membershipVouchers = useSelector(
        (x) => x.membership.membershipVoucher
    )
    const { chain } = useNetwork()

    // const getAllMembershipVouchers = () => {
    //     if (membershipVouchers) {
    //         const membershipVouchersWithInfo = membershipVouchers?.map(
    //             (badge) => {
    //                 const badgeInfo = allMembershipBadges?.find(
    //                     (ele) => ele.uuid === badge.membership_uuid
    //                 )
    //                 return {
    //                     ...badge,
    //                     ...badgeInfo,
    //                 }
    //             }
    //         )
    //         return membershipVouchersWithInfo
    //     }
    // }

    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )

    const unClaimedBadges = useSelector(
        (x) => x.membership.unclaimedMembershipBadges
    )

    // const filterOutUnclaimedBadges = () => {
    //     const unClaimedBadges = getAllMembershipVouchers()?.filter((badge) => {
    //         const indexOfBadge = membershipBadgesForAddress?.findIndex(
    //             (ele) =>
    //                 ele?.level?.toString() === badge?.level?.toString() &&
    //                 ele?.category?.toString() === badge?.category?.toString() &&
    //                 ele?.level &&
    //                 ele?.category
    //         )
    //         return indexOfBadge === -1
    //     })
    //     setUnclaimedBadges(unClaimedBadges)
    // }

    // useEffect(() => {
    //     if (getAllMembershipVouchers()) {
    //         filterOutUnclaimedBadges()
    //     }
    // }, [filterOutUnclaimedBadges, unClaimedBadges])

    const membershipBadgeClaimed = useSelector(
        (x) => x.membership.membershipBadgeClaimed
    )

    const claimMembershipLoading = useSelector(
        (x) => x.membership.claimMembershipLoading
    )

    // const [showClaimTakingTime, setShowClaimTakingTime] = useState(false)
    const showClaimTakingTime = useSelector((x) => x.membership.claimTakingTime)
    const disableClaimBtn = useSelector((x) => x.membership.disableClaimBtn)
    const showMetamaskSignText = useSelector(
        (x) => x.membership.showMetamaskSignText
    )
    const txHashFetched = useSelector((x) => x.membership.txHashFetched)

    const dispatch = useDispatch()

    const claimBadge = async (membershipVoucherInfo) => {
        if (!disableClaimBtn) {
            dispatch(setDisableClaimBtn(true))
            setTimeout(() => {
                dispatch(setShowMetamaskSignText(true))
            }, 10000)

            await dispatch(
                claimMembershipVoucher(membershipVoucherInfo, chain?.id)
            )
        }
    }

    const closeClaimedModal = () => {
        dispatch(setMembershipBadgeClaimed(null))
    }

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    )

    const openEtherscan = () => {
        window.open(
            `https://polygonscan.com/token/${membershipBadgeClaimed?.contractAddress?.id}?a=${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://opensea.io/assets/matic/${membershipBadgeClaimed?.contractAddress?.id}/${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    return (
        <div className="contributor-contribution-screen-container">
            {unClaimedBadges?.length ? (
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {unClaimedBadges.map((badge, index) => (
                        <div className="newMembershipBadge" key={index}>
                            {currentDao?.uuid ===
                                "93ba937e02ea4fdb9633c2cb27345200" ||
                            currentDao?.uuid ===
                                "981349a995c140d8b7fb5c110b0d133b" ? (
                                <video autoPlay loop muted>
                                    <source src={badge.image_url} />
                                </video>
                            ) : (
                                <img src={badge.image_url} />
                            )}
                            <div className="congratsAndClaim">
                                <div className="congratulationsText">
                                    Congratulations
                                </div>
                                <div className="badgeName">
                                    You received {badge.name} badge
                                </div>
                                <div className="claimBadgeBtnWrapper">
                                    <button
                                        className={`claimBadgeBtn ${
                                            claimMembershipLoading.status &&
                                            "pinkColor"
                                        }`}
                                        onClick={() => claimBadge(badge)}
                                        disabled={disableClaimBtn}
                                    >
                                        {disableClaimBtn
                                            ? claimMembershipLoading.status
                                                ? "Minting... "
                                                : "Sign on Metamask"
                                            : "Claim Badge "}
                                        {disableClaimBtn ? (
                                            claimMembershipLoading.status ? (
                                                <Spin indicator={antIcon} />
                                            ) : (
                                                <></>
                                            )
                                        ) : (
                                            <img src={magic_button} alt="" />
                                        )}
                                        {/* {claimMembershipLoading.status &&
                                        claimMembershipLoading.membership_uuid ===
                                            badge.membership_uuid ? (
                                                disableClaimBtn ?
                                            <Spin indicator={antIcon} />
                                        ) : (
                                            <img src={magic_button} alt="" />
                                        )} */}
                                    </button>
                                    {/* {showClaimTakingTime &&
                                        claimMembershipLoading?.status &&
                                        claimMembershipLoading.membership_uuid ===
                                            badge.membership_uuid && (
                                            <span className="takingTimeText">
                                                Takes around 10sec, please don’t
                                                leave the page
                                            </span>
                                        )} */}

                                    {!txHashFetched && showMetamaskSignText && (
                                        <span className="takingTimeText">
                                            Something doesn’t seem right. Try
                                            refreshing this page and signing
                                            again.
                                        </span>
                                    )}

                                    {txHashFetched && showClaimTakingTime && (
                                        <span
                                            className="takingTimeText"
                                            style={{
                                                color: showClaimTakingTime.claimColor,
                                            }}
                                        >
                                            {showClaimTakingTime.claimText}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="noMembershipBadge">
                    <div>
                        <div className="noMembershipHeading">
                            A new beginning! ✨
                        </div>
                        <div className="noMembershipContent">
                            Welcome to {currentDao?.name}, we’re glad to have
                            you here. This space will fill up with badges and
                            rewards as you participate in the community.
                        </div>
                    </div>
                </div>
            )}
            {membershipBadgeClaimed && (
                <div
                    className="successfullyClaimedModalBackdrop"
                    onClick={closeClaimedModal}
                >
                    <div
                        className="successfullyClaimedModalMain"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="closeClaimedBtn"
                            onClick={closeClaimedModal}
                        >
                            <img src={cross} alt="" />
                        </div>

                        <video className="claimedBadgeImg" autoPlay loop muted>
                            <source
                                src={membershipBadgeClaimed?.image_url}
                                // src="http://arweave.net/Gtv0Tn-hW52C_9nIWDs6PM_gwKWsXbsqHoF8b4WzxGI"
                                type="video/mp4"
                            />
                        </video>
                        {/* <img
                            src={membershipBadgeClaimed?.animationUrl}
                            alt=""
                            className="claimedBadgeImg}
                        /> */}

                        {/* <img
                        src="https://i.imgur.com/Fa9KFiM.png"
                        alt=""
                    /> */}

                        <div className="claimedBadgeContent">
                            <div className="claimedBadgeText">
                                Congratulations on becoming{" "}
                                {membershipBadgeClaimed?.name}
                            </div>
                            <div className="successfullyClaimedModalFooterBtn">
                                <button>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=I'm a Pioneer Member of @PonyFinance! %0A%0ACongrats to the team and partners @beefyfinance, @defipulse and @scalara_xyz on the launch. Now lets round up some omni-chain stablecoin yields!🐴🤠 %0A%0Ah/t @rep3gg %0A%0Ahttps://opensea.io/assets/matic/${membershipBadgeClaimed?.contractAddress?.id}/${membershipBadgeClaimed?.tokenID}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Share Badge
                                    </a>{" "}
                                </button>
                                <div className="linksWrapper">
                                    <div
                                        className="openseaImg"
                                        onClick={openOpensea}
                                    >
                                        <img src={opensea_white} alt="" />
                                    </div>
                                    <div
                                        className="etherscanImg"
                                        onClick={openEtherscan}
                                    >
                                        <img src={etherscan_white} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

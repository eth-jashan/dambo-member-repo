import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import {
    claimMembershipVoucher,
    setMembershipBadgeClaimed,
    setClaimMembershipLoading,
} from "../../store/actions/dao-action"
import magic_button from "../../assets/Icons/magic_button.svg"
import etherscan_white from "../../assets/Icons/etherscan-white.svg"
import opensea_white from "../../assets/Icons/opensea-white.svg"
import cross from "../../assets/Icons/cross.svg"

export default function ContributorContributionScreen() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const allMembershipBadges = useSelector((x) => x.dao.membershipBadges)
    const membershipVouchers = useSelector((x) => x.dao.membershipVoucher)

    // const voucherInfo = allMembershipBadges?.filter(
    //     (badge) => badge.uuid === membershipVoucher?.membership_uuid
    // )
    const membershipVouchersWithInfo = membershipVouchers?.map((badge) => {
        const badgeInfo = allMembershipBadges.find(
            (ele) => ele.uuid === badge.membership_uuid
        )
        return {
            ...badge,
            ...badgeInfo,
        }
    })
    console.log("All membership badges are", allMembershipBadges)
    console.log(
        "membership vouchers for this address from backend are",
        membershipVouchersWithInfo
    )

    // console.log("voucher info is ", voucherInfo)

    const membershipBadgesForAddress = useSelector(
        (x) => x.dao.membershipBadgesForAddress
    )

    console.log(
        "membership badges for address from Subgraph are",
        membershipBadgesForAddress
    )

    const unClaimedBadges = membershipVouchersWithInfo?.filter((badge) => {
        const indexOfBadge = membershipBadgesForAddress?.findIndex(
            (ele) =>
                ele?.level?.toString() === badge?.level?.toString() &&
                ele?.category?.toString() === badge?.category?.toString() &&
                ele?.level &&
                ele?.category
        )
        return indexOfBadge === -1
    })

    console.log("unclaimed badges are", unClaimedBadges)

    const membershipBadgeClaimed = useSelector(
        (x) => x.dao.membershipBadgeClaimed
    )

    console.log("membership badge claimed is", membershipBadgeClaimed)

    const claimMembershipLoading = useSelector(
        (x) => x.dao.claimMembershipLoading
    )

    const [showClaimTakingTime, setShowClaimTakingTime] = useState(false)

    const dispatch = useDispatch()

    const claimBadge = async (membershipVoucherInfo) => {
        dispatch(
            setClaimMembershipLoading({
                status: true,
                membership_uuid: membershipVoucherInfo.uuid,
            })
        )
        await dispatch(claimMembershipVoucher(membershipVoucherInfo))
        setTimeout(() => {
            setShowClaimTakingTime(true)
        }, 18000)
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
            `https://mumbai.polygonscan.com/token/${membershipBadgeClaimed?.contractAddress?.id}?a=${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://opensea.io/assets/matic/${membershipBadgeClaimed?.contractAddress?.id}/${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    // contribution_request.length > 0 ? (
    return (
        <div className="contributor-contribution-screen-container">
            {unClaimedBadges?.length ? (
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {/* {contribution_request.map((item, index) => (
                                            <ContributionCard
                                                // community_id={community_id[0]?.id}
                                                // signer={signer}
                                                item={item}
                                                key={index}
                                            />
                                        ))} */}
                    {unClaimedBadges.map((badge, index) => (
                        <div className="newMembershipBadge" key={index}>
                            {/* <img src={badge.image_url} alt="" /> */}
                            <video autoPlay loop>
                                <source src={badge.image_url} />
                            </video>
                            <div className="congratsAndClaim">
                                <div className="congratulationsText">
                                    Congratulations
                                </div>
                                <div className="badgeName">
                                    You received {badge.name} badge
                                </div>
                                <div className="claimBadgeBtnWrapper">
                                    <button
                                        className="claimBadgeBtn"
                                        onClick={() => claimBadge(badge)}
                                    >
                                        Claim Badge{" "}
                                        {claimMembershipLoading.status &&
                                        claimMembershipLoading.membership_uuid ===
                                            badge.membership_uuid ? (
                                            <Spin indicator={antIcon} />
                                        ) : (
                                            <img src={magic_button} alt="" />
                                        )}
                                    </button>
                                    {showClaimTakingTime &&
                                        claimMembershipLoading?.status &&
                                        claimMembershipLoading.membership_uuid ===
                                            badge.membership_uuid && (
                                            <span className="takingTimeText">
                                                Its taking some time to claim
                                                please come back later
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

                        <video className="claimedBadgeImg" autoPlay loop>
                            <source
                                src={membershipBadgeClaimed?.image_url}
                                // src="http://arweave.net/Gtv0Tn-hW52C_9nIWDs6PM_gwKWsXbsqHoF8b4WzxGI"
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
                                <button>Share Badge</button>
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
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
import ContributionRequestModal from "../Modal/ContributionRequest"
import RequestCollapsable from "../ContributorFlow/component/RequestCollapsable"
import ContributionCardV2 from "../ContributorFlow/component/ContributionCard"
import {
    getPendingContributions,
    getPastContributions,
    getContributionAsContributorApproved,
} from "../../store/actions/contibutor-action"
import ApprovedVoucherClub from "../ContributorFlow/component/ApprovedVoucherClub"
import { chainType } from "../../utils/chainType"

export default function ContributorContributionScreen() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const allMembershipBadges = useSelector(
        (x) => x.membership.membershipBadges
    )
    const membershipVouchers = useSelector(
        (x) => x.membership.membershipVoucher
    )
    const { chain } = useNetwork()

    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )
    const contributionForContributorApproved = useSelector(
        (x) => x.contributor.contributionForContributorApproved
    )
    const unClaimedBadges = useSelector(
        (x) => x.membership.unclaimedMembershipBadges
    )

    const membershipBadgeClaimed = useSelector(
        (x) => x.membership.membershipBadgeClaimed
    )

    const claimMembershipLoading = useSelector(
        (x) => x.membership.claimMembershipLoading
    )

    const [contriModal, setContriModal] = useState(false)
    const showClaimTakingTime = useSelector((x) => x.membership.claimTakingTime)
    const disableClaimBtn = useSelector((x) => x.membership.disableClaimBtn)
    const showMetamaskSignText = useSelector(
        (x) => x.membership.showMetamaskSignText
    )
    const txHashFetched = useSelector((x) => x.membership.txHashFetched)

    const dispatch = useDispatch()

    const contributionCounts = useSelector(
        (x) => x.contributor.contribution_counts
    )
    const contributionForContributorPending = useSelector(
        (x) => x.contributor.contributionForContributorPending
    )

    const contributionForContributorPast = useSelector(
        (x) => x.contributor.contributionForContributorPast
    )
    const schemaOfDao = useSelector((x) => x.contributor.contributorSchema)
    const pastContributionsSyncing = useSelector(
        (x) => x.contributor.pastContributionsSyncing
    )

    const fetchPendingContributions = () => {
        dispatch(getPendingContributions())
    }
    const reversedPastContributions = [
        ...contributionForContributorPast,
    ].reverse()

    const fetchPastContributions = () => {
        dispatch(getPastContributions())
    }

    const fetchApprovedContributions = () => {
        dispatch(getContributionAsContributorApproved())
    }

    let totalApprovedRequests = 0
    contributionForContributorApproved?.forEach((voucher) => {
        for (const key in voucher) {
            if (voucher?.[key]?.contributions?.length) {
                totalApprovedRequests =
                    totalApprovedRequests + voucher[key]?.contributions?.length
            }
        }
    })

    const claimBadge = async (membershipVoucherInfo) => {
        if (!disableClaimBtn) {
            dispatch(setDisableClaimBtn(true))
            setTimeout(() => {
                dispatch(setShowMetamaskSignText(true))
            }, 15000)

            await dispatch(
                claimMembershipVoucher(membershipVoucherInfo, chain?.id)
            )
        }
    }

    const contribution = [
        {
            created_for: "0x9C3f331473602e818E92CD16C948af4e924F81Eb",
            request: false,
            dao_uuid: "bc9cd815177d4075a9990d29d1b14cb5",
            membership_id: 1,
            contrib_schema_id: 2,
            signed_voucher: {
                index: 0,
                memberTokenIds: [0],
                type_: [1],
                tokenUri: "metadatasds;D;,",
                data: [0],
                nonces: [1],
                signature:
                    "0x52975260305db40ef82dfcb913ebd594f4fc06fc11828e177ae48cedd75d3a170c5c757246bc67f987d24418b1c522b5f21ea659371195ef89b7a6939110a0b61c",
            },
            details: [
                {
                    fieldName: "Contribution Title",
                    fieldType: "Text Field",
                    options: [],
                    value: "asfljb",
                },
                {
                    fieldName: "Additional Notes",
                    fieldType: "Long text",
                    options: [],
                    value: "afl",
                },
                {
                    fieldName: "Time Spent in Hours",
                    fieldType: "Numbers",
                    options: [],
                    value: "1",
                },
            ],
        },
    ]

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
            `https://${
                chainType(chain?.id) === "Testnet" ? "mumbai." : ""
            }polygonscan.com/token/${
                membershipBadgeClaimed?.contractAddress?.id
            }?a=${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://${
                chainType(chain?.id) === "Testnet" ? "testnets." : ""
            }opensea.io/assets/${
                chainType(chain?.id) === "Testnet" ? "mumbai" : "matic"
            }/${membershipBadgeClaimed?.contractAddress?.id}/${
                membershipBadgeClaimed?.tokenID
            }`,
            "_blank"
        )
    }

    const [currentMembershipBadge, setCurrentMembershipBadge] = useState(false)
    const membershipBadges = useSelector((x) => x.membership.membershipBadges)

    const getCurrentBadgeUpdated = () => {
        const membershipInfo = []
        membershipBadgesForAddress.forEach((item, i) => {
            membershipBadges.forEach((x) => {
                if (item.level === x.level.toString() && i === 0) {
                    membershipInfo.push(x)
                }
            })
        })
        setCurrentMembershipBadge({
            ...membershipBadgesForAddress[0],
            ...membershipInfo[0],
        })
    }
    useEffect(() => {
        if (currentDao && membershipBadgesForAddress?.length > 0) {
            getCurrentBadgeUpdated()
        }
    }, [currentDao, membershipBadgesForAddress])

    const renderEmptyContributorScreen = () => (
        <div className="empty-contrib-screen">
            <div className="white-header">No contribution request</div>
            <div className="gray-header">
                Initiate contribution request for whatever work you have done
            </div>
            <div
                onClick={() => setContriModal(true)}
                className="contributor-modal-btn"
            >
                <div className="title">Create Contribution Request</div>
            </div>
        </div>
    )

    const renderNonEmptyScreen = () => (
        <div className="non-empty-contrib-screen">
            <div className="approved-contributions">
                <RequestCollapsable
                    contributions={contributionForContributorApproved}
                    title={`Approved Requests  •  ${totalApprovedRequests}`}
                    onOpenCallback={fetchApprovedContributions}
                    defaultCollapseState={true}
                >
                    <ApprovedVoucherClub
                        voucher={contributionForContributorApproved?.[0]}
                        isFirst={true}
                    />

                    {contributionForContributorApproved?.length > 1 && (
                        <div className="approve-request-more-text">
                            Claim or reject above requests before to claim the
                            following
                        </div>
                    )}

                    {contributionForContributorApproved
                        ?.slice(1)
                        ?.map((x, i) => (
                            <div key={i} className="approve-voucher-wrapper">
                                <ApprovedVoucherClub
                                    voucher={x}
                                    isFirst={false}
                                />
                            </div>
                        ))}
                </RequestCollapsable>
            </div>
            <div className="pending-contributions">
                <RequestCollapsable
                    contributions={contributionForContributorPending}
                    title={`Pending Requests  •  ${
                        contributionCounts?.pending_vouchers || 0
                    }`}
                    onOpenCallback={fetchPendingContributions}
                >
                    {contributionForContributorPending?.map((x, i) => (
                        <ContributionCardV2
                            key={i}
                            index={i}
                            isMinimum={true}
                            item={x}
                            isLast={
                                i ===
                                contributionForContributorPending?.length - 1
                            }
                            contributionType="pending"
                        />
                    ))}
                </RequestCollapsable>
            </div>
            <div className="past-contributions">
                <RequestCollapsable
                    contributions={reversedPastContributions}
                    title={`Past Requests  •  ${
                        reversedPastContributions?.length || 0
                    }`}
                    onOpenCallback={fetchPastContributions}
                    showSyncing={pastContributionsSyncing}
                >
                    {reversedPastContributions.map((x, i) => (
                        <ContributionCardV2
                            key={i}
                            index={i}
                            isMinimum={true}
                            item={x}
                            isLast={
                                i === contributionForContributorPast?.length - 1
                            }
                            contributionType="past"
                        />
                    ))}
                </RequestCollapsable>
            </div>
        </div>
    )

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
                                    </button>

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
                <div
                    className={
                        currentMembershipBadge && schemaOfDao
                            ? "contribution-screen-wrapper"
                            : "noMembershipBadge"
                    }
                >
                    {currentMembershipBadge && schemaOfDao ? (
                        contribution.length > 0 ? (
                            renderNonEmptyScreen()
                        ) : (
                            renderEmptyContributorScreen()
                        )
                    ) : (
                        <div>
                            <div className="noMembershipHeading">
                                A new beginning! ✨
                            </div>
                            <div className="noMembershipContent">
                                Welcome to {currentDao?.name}, we’re glad to
                                have you here. This space will fill up with
                                badges and rewards as you participate in the
                                community.
                            </div>
                        </div>
                    )}
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

                        {currentDao?.uuid ===
                            "93ba937e02ea4fdb9633c2cb27345200" ||
                        currentDao?.uuid ===
                            "981349a995c140d8b7fb5c110b0d133b" ? (
                            <video autoPlay loop muted>
                                <source
                                    src={membershipBadgeClaimed.image_url}
                                />
                            </video>
                        ) : (
                            <img
                                className="claimedBadgeImg"
                                src={membershipBadgeClaimed.image_url}
                            />
                        )}

                        <div className="claimedBadgeContent">
                            <div className="claimedBadgeText">
                                Congratulations on becoming{" "}
                                {membershipBadgeClaimed?.name}
                            </div>
                            <div className="successfullyClaimedModalFooterBtn">
                                <button>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=I'm a Pioneer Member of @PonyFinance! %0A%0ACongrats to the team and partners @beefyfinance, @defipulse and @scalara_xyz on the launch. Now lets round up some omni-chain stablecoin yields!🐴🤠 %0A%0Ah/t @rep3gg %0A%0Ahttps://${
                                            chainType(chain?.id) === "Testnet"
                                                ? "testnets."
                                                : ""
                                        } opensea.io/assets/${
                                            chainType(chain?.id) === "Testnet"
                                                ? "mumbai"
                                                : "matic"
                                        }/${
                                            membershipBadgeClaimed
                                                ?.contractAddress?.id
                                        }/${membershipBadgeClaimed?.tokenID}`}
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
            {contriModal && (
                <ContributionRequestModal setVisibility={setContriModal} />
            )}
        </div>
    )
}

import React from "react"
import "./style.scss"
import membershipIconWhite from "../../../../assets/Icons/membershipIconWhite.svg"
import contributionIconWhite from "../../../../assets/Icons/contributionIconWhite.svg"
import appreciationIconWhite from "../../../../assets/Icons/appreciationIconWhite.svg"
import participationIconWhite from "../../../../assets/Icons/participationIconWhite.svg"
import edit_active from "../../../../assets/Icons/edit_active.svg"
import { assets } from "../../../../constant/assets"
import {
    setShowMembershipCreateModal,
    setShowMembershipMintingModal,
} from "../../../../store/actions/membership-action"
import { useDispatch, useSelector } from "react-redux"
import { setContractAddress } from "../../../../store/actions/dao-action"
import ContributionSchemaModal from "../../../SecondaryBadges/ContributionBadge/ContributionSchemeModal"
import {
    actionOnContributionRequestModal,
    actionOnGenerateSchemaModal,
} from "../../../../store/actions/contibutor-action"

import pocpBadgeBg from "../../../../assets/pocp_contri_bg.svg"
import pluralize from "pluralize"

export default function HomeScreen({
    membershipBadges,
    setShowMembershipOverviewModal,
}) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const dispatch = useDispatch()
    const showModal = () => {
        dispatch(setShowMembershipCreateModal(true))
    }
    const showMintingModal = async () => {
        await dispatch(setContractAddress(currentDao?.proxy_txn_hash))
        dispatch(setShowMembershipMintingModal(true))
    }
    const contributionSchema = useSelector(
        (x) => x.contributor.contributorSchema
    )
    const allContributionCount = useSelector(
        (x) => x.contributor.contributionAllCount
    )

    const displaySchemas = (schema) => {
        const contribFeild = []
        schema?.forEach((x, i) => {
            if (i < 3) {
                contribFeild.push(x.fieldName)
            }
        })
        contribFeild.toString()
        return contribFeild.toString().replaceAll(",", " / ")
    }
    const contributionPending = useSelector(
        (x) => x.contributor.contributionForAdmin
    )

    return (
        <div className="badges-home-screen-container">
            <div className="membership-badge-wrapper">
                {membershipBadges?.length ? (
                    <div className="membership-badge">
                        <div className="membership-badge-left">
                            <div className="membership-badge-icon">
                                <img src={membershipIconWhite} alt="" />
                            </div>
                            <div>
                                <div className="membership-badge-heading">
                                    Membership Badge
                                </div>
                                {membershipBadges
                                    .slice(0, 2)
                                    .map((badge, index) => (
                                        <div
                                            key={index}
                                            className="badge-and-holder-row"
                                        >
                                            <div className="badge-name">
                                                {badge.name}
                                            </div>
                                            <div className="badge-holders">
                                                {badge.members_count}{" "}
                                                {pluralize(
                                                    "holder",
                                                    badge.members_count
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {membershipBadges?.length > 2 && (
                                    <div>
                                        {membershipBadges?.length - 2} more
                                    </div>
                                )}
                                <div className="membership-badge-buttons">
                                    <button onClick={showMintingModal}>
                                        Mint Badges
                                    </button>
                                    <div
                                        onClick={() =>
                                            setShowMembershipOverviewModal(true)
                                        }
                                    >
                                        <img src={edit_active} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="membership-badge-right">
                            {currentDao?.uuid ===
                                "93ba937e02ea4fdb9633c2cb27345200" ||
                            currentDao?.uuid ===
                                "981349a995c140d8b7fb5c110b0d133b" ? (
                                <video autoPlay loop muted>
                                    <source
                                        src={membershipBadges?.[0]?.image_url}
                                    />
                                </video>
                            ) : (
                                <img
                                    className="claimedBadgeImg"
                                    src={membershipBadges?.[0]?.image_url}
                                />
                            )}
                            {/* {dao_uuid === "981349a995c140d8b7fb5c110b0d133b"?
                            <img
                                src={membershipBadges?.[0]?.image_url}
                                alt=""
                            />} */}
                        </div>
                    </div>
                ) : (
                    <div className="membership-empty">
                        <div className="membership-badge-icon">
                            <img src={membershipIconWhite} alt="" />
                        </div>
                        <div className="membership-badge-content">
                            <div>Setup</div>
                            <div>Membership Badge</div>
                            <button onClick={showModal}>Setup Badges</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="rest-badges">
                <div className="contribution-div">
                    <div className="contribution-div-row">
                        <div className="badge-row-left">
                            <img src={contributionIconWhite} alt="" />
                            <div className="contribution-title-div">
                                <span>Contribution Badge </span>
                                {contributionSchema?.length > 0 && (
                                    <div className="contribution-badge-stats">
                                        {allContributionCount} Approved | 00
                                        Claimed
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="badge-row-right">
                            {membershipBadges?.length ? (
                                <button
                                    onClick={() => {
                                        if (
                                            contributionSchema?.length === 0 ||
                                            !contributionSchema
                                        ) {
                                            dispatch(
                                                actionOnGenerateSchemaModal(
                                                    true
                                                )
                                            )
                                        } else {
                                            dispatch(
                                                actionOnContributionRequestModal(
                                                    true
                                                )
                                            )
                                        }
                                    }}
                                    style={{
                                        background:
                                            contributionSchema?.length > 0 &&
                                            "#6852FF",
                                    }}
                                    className="btn-steps"
                                >
                                    <div>
                                        {contributionSchema?.length > 0
                                            ? "Mint Badges"
                                            : "Enable Badges"}
                                    </div>
                                    <img
                                        src={assets.icons.chevronRightWhite}
                                        alt=""
                                    />
                                </button>
                            ) : (
                                <span>Setup membership badge to enable it</span>
                            )}
                        </div>
                    </div>
                    {contributionSchema?.length > 0 && (
                        <div className="contribution-bottom-div">
                            <div className="psuedo-space" />
                            <div className="contribution-schema-div">
                                <div className="schema-title">
                                    {displaySchemas(contributionSchema)}{" "}
                                    {contributionSchema?.length > 3 &&
                                        `and ${contributionSchema?.length - 3}
                                    more`}
                                </div>
                                <div
                                    onClick={() =>
                                        dispatch(
                                            actionOnGenerateSchemaModal(true)
                                        )
                                    }
                                    className="schema-edit"
                                >
                                    Edit Schema
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="rest-badge-row">
                    <div className="badge-row-left">
                        <img src={appreciationIconWhite} alt="" />
                        <span>Appreciation Badge </span>
                    </div>
                    <div className="badge-row-right">
                        {membershipBadges?.length ? (
                            <button className="btn-steps">
                                <div>Enable Badges</div>
                                <img
                                    src={assets.icons.chevronRightWhite}
                                    alt=""
                                />
                            </button>
                        ) : (
                            <span>Setup membership badge to enable it</span>
                        )}
                    </div>
                </div>
                <div className="rest-badge-row">
                    <div className="badge-row-left">
                        <img src={participationIconWhite} alt="" />
                        <span>Participation Badge </span>
                    </div>
                    <div className="badge-row-right">
                        {membershipBadges?.length ? (
                            <button className="btn-steps">
                                <div>Enable Badges</div>
                                <img
                                    src={assets.icons.chevronRightWhite}
                                    alt=""
                                />
                            </button>
                        ) : (
                            <span>Setup membership badge to enable it</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

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
                                                {badge.holders} holders
                                            </div>
                                        </div>
                                    ))}
                                {membershipBadges.length > 2 && (
                                    <div>
                                        {membershipBadges.length - 2} more
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
                            {/* {currentDao?.uuid !==
                            "93ba937e02ea4fdb9633c2cb27345200" ? ( */}
                            {/* <div className="stack-card"> */}
                            {/* {["1", "2", "3"].map((x, i) => ( */}
                            <img
                                // key={i}
                                src={membershipBadges?.[0]?.image_url}
                                alt=""
                                // style={{ right: `${i * 10}px` }}
                            />
                            {/* ))} */}
                            {/* </div> */}
                            {/* ) : (
                                <video autoPlay loop muted>
                                    <source
                                        src={membershipBadges?.[0]?.image_url}
                                    />
                                </video>
                            )} */}
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
                <div className="rest-badge-row">
                    <div className="badge-row-left">
                        <img src={contributionIconWhite} alt="" />
                        <span>Contribution Badge </span>
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

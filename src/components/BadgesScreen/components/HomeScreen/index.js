import React from "react"
import "./style.scss"
import membershipIconWhite from "../../../../assets/Icons/membershipIconWhite.svg"
import contributionIconWhite from "../../../../assets/Icons/contributionIconWhite.svg"
import appreciationIconWhite from "../../../../assets/Icons/appreciationIconWhite.svg"
import participationIconWhite from "../../../../assets/Icons/participationIconWhite.svg"
import edit_active from "../../../../assets/Icons/edit_active.svg"
import {
    setShowMembershipCreateModal,
    setShowMembershipMintingModal,
} from "../../../../store/actions/membership-action"
import { useDispatch } from "react-redux"

export default function HomeScreen({
    membershipBadges,
    setShowMembershipOverviewModal,
}) {
    const dispatch = useDispatch()
    const showModal = () => {
        dispatch(setShowMembershipCreateModal(true))
    }
    const showMintingModal = () => {
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
                                    .slice(0, 3)
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
                                {membershipBadges.length > 3 && (
                                    <div>
                                        {membershipBadges.length - 3} more
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
                            <img
                                src={membershipBadges?.[0]?.image_url}
                                alt=""
                            />
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
                            <button>Enable Badges</button>
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
                            <button>Enable Badges</button>
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
                            <button>Enable Badges</button>
                        ) : (
                            <span>Setup membership badge to enable it</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

import React from "react"
import "./style.scss"
import membershipIconWhite from "../../../../assets/Icons/membershipIconWhite.svg"

export default function HomeScreen({ setShowModal, membershipBadges }) {
    return (
        <div className="badges-home-screen-container">
            <div className="membership-badge-wrapper">
                {membershipBadges?.length ? (
                    <div className="membership-badge"></div>
                ) : (
                    <div className="membership-empty">
                        <div className="membership-badge-icon">
                            <img src={membershipIconWhite} alt="" />
                        </div>
                        <div className="membership-badge-content">
                            <div>Setup</div>
                            <div>Membership Badge</div>
                            <button onClick={() => setShowModal(true)}>
                                Setup Badges
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="rest-badges"></div>
        </div>
    )
}

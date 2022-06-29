import React from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import edit from "../../../../assets/Icons/edit.svg"
import plus_black from "../../../../assets/Icons/plus_black.svg"

export default function MembershipOverviewModal({
    closeMembershipOverviewModal,
    membershipBadges,
    editMembership,
}) {
    return (
        <div className="membership-overview-modal-container">
            <div
                className="membership-overview-modal-backdrop"
                onClick={closeMembershipOverviewModal}
            >
                <div
                    className="membership-overview-modal-main"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="close-btn"
                        onClick={closeMembershipOverviewModal}
                    >
                        <img src={cross} alt="" />
                    </div>
                    <div className="membership-overview-modal-heading">
                        Membership Overview
                    </div>
                    <div className="membership-modal-content">
                        <div className="membership-content-left">
                            <div className="total-memberships">
                                {membershipBadges?.length} membership levels
                            </div>
                            <div className="total-members">245 members</div>
                            <div className="membership-action-rows-wrapper">
                                <div
                                    className="membership-action-row"
                                    onClick={editMembership}
                                >
                                    <img src={edit} alt="" />
                                    Edit Membership details
                                </div>
                                <div
                                    className="membership-action-row"
                                    onClick={editMembership}
                                >
                                    <img src={plus_black} alt="" />
                                    Add Membership level
                                </div>
                            </div>
                        </div>
                        <div className="membership-content-right">
                            <div className="membership-images-wrapper">
                                {membershipBadges.map((badge, index) => (
                                    <div className="badge-row" key={index}>
                                        <div className="badge-image-wrapper">
                                            {badge.isVideo ? (
                                                <video autoPlay muted loop>
                                                    <source
                                                        src={badge.imgUrl}
                                                    />
                                                </video>
                                            ) : (
                                                <img
                                                    src={badge.imgUrl}
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <div className="membership-badge-name">
                                                {badge.name}
                                            </div>
                                            <div>23 Members</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

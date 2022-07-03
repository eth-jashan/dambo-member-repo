import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import long_arrow_right from "../../../../assets/Icons/long_arrow_right.svg"
import right_arrow_white from "../../../../assets/Icons/right_arrow_white.svg"

export default function MembershipChangeModal({
    closeMembershipChangeModal,
    membershipBadges,
    currentMembershipBadge,
}) {
    const [currentStep, setCurrentStep] = useState(0)

    const selectNewMembership = () => {
        setCurrentStep((currentStep) => currentStep + 1)
    }

    return (
        <div className="membership-change-modal-container">
            <div
                className="membership-change-modal-backdrop"
                onClick={closeMembershipChangeModal}
            >
                <div
                    className="membership-change-modal-main"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="close-btn"
                        onClick={closeMembershipChangeModal}
                    >
                        <img src={cross} alt="" />
                    </div>
                    {currentStep === 0 ? (
                        <>
                            <div className="membership-change-heading">
                                Change membership badges
                            </div>
                            {membershipBadges?.map((badge, index) => (
                                <div
                                    className="membership-badge-row"
                                    key={index}
                                >
                                    <div className="membership-badge-content">
                                        <div className="membership-badge-image-wrapper">
                                            {badge.is_video ? (
                                                <video autoPlay loop muted>
                                                    <source
                                                        src={badge.image_url}
                                                    />
                                                </video>
                                            ) : (
                                                <img src={badge.image_url} />
                                            )}
                                        </div>
                                        <div className="membership-name">
                                            <div>{badge.name}</div>
                                            {currentMembershipBadge && (
                                                <div>Current Role</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="membership-badge-time">
                                        {currentMembershipBadge ? (
                                            "2 months ago"
                                        ) : (
                                            <div
                                                className="badge-type-btn"
                                                onClick={selectNewMembership}
                                            >
                                                <img
                                                    src={arrow_forward}
                                                    alt=""
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="membership-change-heading">
                                Upgrade from Noobie to Padwan
                            </div>
                            <div className="member-name">Noell</div>
                            <div className="membership-update-images-wrapper">
                                <div className="badge-image-wrapper">
                                    {membershipBadges[0].is_video ? (
                                        <video autoPlay loop muted>
                                            <source
                                                src={
                                                    membershipBadges[0]
                                                        .image_url
                                                }
                                            />
                                        </video>
                                    ) : (
                                        <img
                                            src={membershipBadges[0].image_url}
                                        />
                                    )}
                                </div>
                                <img
                                    src={long_arrow_right}
                                    alt=""
                                    className="right-image-long"
                                />
                                <div className="badge-image-wrapper">
                                    {membershipBadges[0].is_video ? (
                                        <video autoPlay loop muted>
                                            <source
                                                src={
                                                    membershipBadges[0]
                                                        .image_url
                                                }
                                            />
                                        </video>
                                    ) : (
                                        <img
                                            src={membershipBadges[0].image_url}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="upgrade-button-wrapper">
                                <button>
                                    Confirm Upgrade
                                    <img src={right_arrow_white} alt="" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

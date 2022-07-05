import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import long_arrow_right from "../../../../assets/Icons/long_arrow_right.svg"
import right_arrow_white from "../../../../assets/Icons/right_arrow_white.svg"
import { useSelector } from "react-redux"

export default function MembershipChangeModal({
    closeMembershipChangeModal,
    membershipBadges,
}) {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectUpgradeMembership, setUpgradeMembership] = useState(null)
    const selectedMember = useSelector((x) => x.membership.selectedMember)
    const [loading, setLoading] = useState(false)
    // const currentMembershipBadge = selectedMember.memberhips[0].uuid === membershipBadges.uuid
    const selectNewMembership = (x) => {
        setCurrentStep((currentStep) => currentStep + 1)
        setUpgradeMembership(x)
    }
    const upgradMembershipNft = async () => {}
    console.log(selectedMember.memberhips[0], membershipBadges)
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
                                            {selectedMember.memberhips[0]
                                                .uuid === badge.uuid && (
                                                <div>Current Role</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="membership-badge-time">
                                        {selectedMember.memberhips[0].uuid ===
                                        badge.uuid ? (
                                            "2 months ago"
                                        ) : (
                                            <div
                                                className="badge-type-btn"
                                                onClick={() =>
                                                    selectNewMembership(badge)
                                                }
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
                                Upgrade from {selectedMember.memberhips[0].name}{" "}
                                to {selectUpgradeMembership.name}
                            </div>
                            <div className="member-name">
                                {selectedMember.name}
                            </div>
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
                                            src={
                                                selectedMember.memberhips[0]
                                                    .image_url
                                            }
                                        />
                                    )}
                                </div>
                                <img
                                    src={long_arrow_right}
                                    alt=""
                                    className="right-image-long"
                                />
                                <div className="badge-image-wrapper">
                                    {selectUpgradeMembership.is_video ? (
                                        <video autoPlay loop muted>
                                            <source
                                                src={
                                                    selectUpgradeMembership.image_url
                                                }
                                            />
                                        </video>
                                    ) : (
                                        <img
                                            src={
                                                selectUpgradeMembership.image_url
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                onClick={async () =>
                                    await upgradMembershipNft()
                                }
                                className="upgrade-button-wrapper"
                            >
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

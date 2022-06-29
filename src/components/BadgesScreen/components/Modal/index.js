import React, { useState } from "react"
import "./style.scss"
import membershipIcon from "../../../../assets/Icons/membershipIcon.svg"
import appreciationIcon from "../../../../assets/Icons/appreciationIcon.svg"
import contributionIcon from "../../../../assets/Icons/contributionIcon.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import cross from "../../../../assets/Icons/cross.svg"
import MembershipCreationStep1 from "../MembershipCreationStep1"
import MembershipCreationStep2 from "../MembershipCreationStep2"
import { useDispatch } from "react-redux"
import { createMembershipBadges } from "../../../../store/actions/membership-action"

export default function Modal({
    closeModal,
    membershipBadges,
    setMembershipBadges,
    isEditing,
}) {
    const [membershipStep, setMembershipStep] = useState(1)
    const [badgeType, setBadgeType] = useState(null)
    const [localMembershipBadges, setLocalMembershipBadges] = useState(
        isEditing
            ? membershipBadges
            : [
                  {
                      name: "",
                      imgUrl: "",
                  },
              ]
    )

    const dispatch = useDispatch()

    const increaseStep = () => {
        console.log("membership step is", membershipStep)
        if (membershipStep >= 2) {
            setMembershipBadges(localMembershipBadges)
            closeModal()
            setMembershipStep(1)
            const mappedBadges = membershipBadges.map((badge) => {
                const formData = new FormData()
                formData.append("file", badge.file)

                return {
                    media: formData,
                    name: badge.name,
                }
            })

            dispatch(createMembershipBadges("abc", mappedBadges))
        } else {
            setMembershipStep((membershipStep) => membershipStep + 1)
        }
    }

    const SelectBadgeType = () => {
        return (
            <>
                <div className="heading">Select badge type</div>
                <div
                    className="badge-type-row"
                    onClick={() => {
                        setBadgeType("membership")
                        increaseStep()
                    }}
                >
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={membershipIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Membership badges
                            </div>
                            <div className="badge-type-content">
                                Membership badges are upgradable entity that
                                will be upgraded with community
                            </div>
                        </div>
                        <div>
                            <div className="badge-type-btn">
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="badge-type-row"
                    onClick={() => {
                        setBadgeType("contribution")
                        increaseStep()
                    }}
                >
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={contributionIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Contribution badges
                            </div>
                            <div className="badge-type-content">
                                Contribution badges are individual badges that
                                work as a proof of contribution, they can either
                                be requested or awarded to community.
                            </div>
                        </div>
                        <div>
                            <div className="badge-type-btn">
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="badge-type-row"
                    onClick={() => {
                        setBadgeType("appreciation")
                        increaseStep()
                    }}
                >
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={appreciationIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Appreciation badges
                            </div>
                            <div className="badge-type-content">
                                Appreciation badges are individual badges that
                                can be given to members for outlier performance.
                            </div>
                        </div>
                        <div>
                            <div className="badge-type-btn">
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const renderOnStep = () => {
        switch (membershipStep) {
            case 0:
                return <SelectBadgeType />
            case 1:
                return (
                    <MembershipCreationStep1
                        increaseStep={increaseStep}
                        membershipBadges={localMembershipBadges}
                        setMembershipBadges={setLocalMembershipBadges}
                    />
                )
            case 2:
                return (
                    <MembershipCreationStep2
                        increaseStep={increaseStep}
                        membershipBadges={localMembershipBadges}
                        setMembershipBadges={setLocalMembershipBadges}
                    />
                )
            default:
                return <SelectBadgeType />
        }
    }

    return (
        <div className="badges-modal-container">
            <div
                className={`modal-backdrop ${
                    membershipStep !== 0 && "main-at-bottom"
                }`}
                onClick={closeModal}
            >
                <div
                    className={`modal-main ${
                        membershipStep !== 0 && "main-expanded"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="close-btn" onClick={closeModal}>
                        <img src={cross} alt="" />
                    </div>
                    {renderOnStep()}
                </div>
            </div>
        </div>
    )
}

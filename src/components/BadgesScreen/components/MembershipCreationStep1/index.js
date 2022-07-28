import React from "react"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import "./style.scss"
import NextButton from "../../../NextButton"

export default function MembershipCreationStep1({
    increaseStep,
    membershipBadges,
    setMembershipBadges,
}) {
    const updateBadgeName = (badgeIndex, newValue) => {
        const copyOfBadges = [...membershipBadges]
        copyOfBadges[badgeIndex] = {
            ...copyOfBadges[badgeIndex],
            name: newValue,
        }
        setMembershipBadges(copyOfBadges)
    }

    const addBadge = () => {
        setMembershipBadges((membershipBadges) => [
            ...membershipBadges,
            {
                name: "",
                image_url: "",
                description: "",
            },
        ])
    }

    const checkIsDisabled = () => {
        let isDisabled = false
        membershipBadges.forEach((badge) => {
            if (!badge.name) {
                isDisabled = true
            }
        })
        return isDisabled
    }

    return (
        <div className="membership-step1">
            <div className="membership-heading">Membership creation</div>
            <div className="membership-content">
                <div className="membership-left">
                    <div className="left-bold">New Payment</div>
                    <div className="left-greyed">Step 1 of 2</div>
                </div>
                <div className="membership-right">
                    <div>
                        {membershipBadges.map((badge, index) => (
                            <input
                                type="text"
                                value={badge.name}
                                onChange={(e) =>
                                    updateBadgeName(index, e.target.value)
                                }
                                placeholder="Level Name"
                                key={index}
                            />
                        ))}
                        <div className="add-btn-wrapper" onClick={addBadge}>
                            <div>Add another Level</div>
                            <div className="add-btn">
                                <img src={plus_black} alt="add" />
                            </div>
                        </div>
                    </div>
                    <div className="next-btn-wrapper">
                        <NextButton
                            text="Upload Designs"
                            isDisabled={checkIsDisabled()}
                            nextButtonCallback={increaseStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

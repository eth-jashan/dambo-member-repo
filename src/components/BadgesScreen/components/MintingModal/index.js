import React, { useState } from "react"
import cross from "../../../../assets/Icons/cross.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import "./style.scss"
import AddAddress from "../AddAddress"

export default function MintingModal({ closeMintingModal, membershipBadges }) {
    const [selectedMembershipBadge, setSelectedMembershipBadge] = useState(null)

    const selectMembershipBadge = () => {
        return (
            <div className="select-membership-badge-container">
                <div>
                    <img
                        src={cross}
                        className="close-icon"
                        alt=""
                        onClick={closeMintingModal}
                    />
                </div>
                <div className="select-membership-badge-heading">
                    Minting
                    <br /> membership badges
                </div>
                <div>
                    {membershipBadges.map((badge, index) => (
                        <div
                            key={index}
                            className="select-badge-row"
                            onClick={() => {
                                setSelectedMembershipBadge(
                                    membershipBadges[index]
                                )
                            }}
                        >
                            <div className="select-badge-row-left">
                                <img src={badge.imgUrl} alt="" />
                                <div>
                                    <div className="badge-name">
                                        {badge.name}
                                    </div>
                                    <div className="badge-holders">
                                        {badge.holders} Members
                                    </div>
                                </div>
                            </div>
                            <div className="select-badge-row-right">
                                <div className="badge-type-btn">
                                    <img src={arrow_forward} alt="" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="minting-modal-container">
            <div className="minting-modal-backdrop" onClick={closeMintingModal}>
                <div
                    className="minting-modal-main"
                    onClick={(e) => e.stopPropagation()}
                >
                    {selectedMembershipBadge ? (
                        <div>
                            <AddAddress
                                selectedMembershipBadge={
                                    selectedMembershipBadge
                                }
                            />
                        </div>
                    ) : (
                        selectMembershipBadge()
                    )}
                </div>
            </div>
        </div>
    )
}

import React, { useState } from "react"
import cross from "../../../../assets/Icons/cross.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import "./style.scss"
import AddAddress from "../AddAddress"
import { useSelector } from "react-redux"

export default function MintingModal({ closeMintingModal, membershipBadges }) {
    const [selectedMembershipBadge, setSelectedMembershipBadge] = useState(null)
    const currentDao = useSelector((x) => x.dao.currentDao)
    console.log("Yo", membershipBadges)
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
                                {currentDao?.uuid ===
                                    "93ba937e02ea4fdb9633c2cb27345200" ||
                                currentDao?.uuid ===
                                    "981349a995c140d8b7fb5c110b0d133b" ? (
                                    <video autoPlay loop muted>
                                        <source src={badge.image_url} />
                                    </video>
                                ) : (
                                    <img
                                        className="claimedBadgeImg"
                                        src={badge.image_url}
                                    />
                                )}
                                <div>
                                    <div className="badge-name">
                                        {badge.name}
                                    </div>
                                    <div className="badge-holders">
                                        {badge.members_count} Members
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
                                closeModal={closeMintingModal}
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

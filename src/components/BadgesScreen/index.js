import React, { useState } from "react"
import "./style.scss"
import plus_black from "../../assets/Icons/plus_black.svg"
import plus_gray from "../../assets/Icons/plus_gray.svg"
import BadgesScreenSearchTab from "../BadgesScreenSearchTab"
// import EmptyScreen from "./components/EmptyScreen"
import Modal from "./components/Modal"
import HomeScreen from "./components/HomeScreen"
import MintingModal from "./components/MintingModal"
import CommunityScreen from "./components/CommunityScreen"
import MembershipOverviewModal from "./components/MembershipOverviewModal"

export default function BadgesScreen() {
    const [addBtnHover, setAddBtnHover] = useState(false)
    const [selectedNav, setSelectedNav] = useState("badges")
    const [showModal, setShowModal] = useState(false)
    const [membershipBadges, setMembershipBadges] = useState([
        {
            name: "badge 1",
            imgUrl: "https://i.imgur.com/mufSVRW.jpg",
            holders: 2,
            isVideo: false,
        },
    ])
    // const [membershipBadges, setMembershipBadges] = useState([])

    const [showMintingModal, setShowMintingModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [showMembershipOverviewModal, setShowMembershipOverviewModal] =
        useState(false)

    const closeModal = () => {
        setShowModal(false)
    }

    const closeMintingModal = () => {
        setShowMintingModal(false)
    }

    const closeMembershipOverviewModal = () => {
        setShowMembershipOverviewModal(false)
    }

    const editMembership = () => {
        setShowMembershipOverviewModal(false)
        setIsEditing(true)
        setShowModal(true)
    }

    return (
        <div className="badges-screen-container">
            <div className="badges-screen-header">
                <div className="header-row">
                    <div className="row-links">
                        <div
                            className={`nav-link ${
                                selectedNav === "badges" && "active-nav-link"
                            }`}
                            onClick={() => setSelectedNav("badges")}
                        >
                            Badges
                        </div>
                        <div
                            className={`nav-link ${
                                selectedNav === "community" && "active-nav-link"
                            }`}
                            onClick={() => setSelectedNav("community")}
                        >
                            Community
                        </div>
                    </div>
                    <div
                        onMouseEnter={() => setAddBtnHover(true)}
                        onMouseLeave={() => setAddBtnHover(false)}
                        // onClick={setModalContri(true)}
                        className={`add-btn ${addBtnHover ? "" : ""}`}
                    >
                        <img
                            src={addBtnHover ? plus_black : plus_gray}
                            alt="plus"
                        />
                    </div>
                </div>
            </div>
            <BadgesScreenSearchTab />
            {selectedNav === "badges" ? (
                <HomeScreen
                    setShowModal={setShowModal}
                    membershipBadges={membershipBadges}
                    setShowMintingModal={setShowMintingModal}
                    setShowMembershipOverviewModal={
                        setShowMembershipOverviewModal
                    }
                />
            ) : (
                <CommunityScreen />
            )}
            {showModal && (
                <Modal
                    closeModal={closeModal}
                    membershipBadges={membershipBadges}
                    setMembershipBadges={setMembershipBadges}
                    isEditing={isEditing}
                />
            )}
            {showMintingModal && (
                <MintingModal
                    closeMintingModal={closeMintingModal}
                    membershipBadges={membershipBadges}
                />
            )}
            {showMembershipOverviewModal && (
                <MembershipOverviewModal
                    closeMembershipOverviewModal={closeMembershipOverviewModal}
                    membershipBadges={membershipBadges}
                    editMembership={editMembership}
                />
            )}
        </div>
    )
}

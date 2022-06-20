import React, { useState } from "react"
import "./style.scss"
import plus_black from "../../assets/Icons/plus_black.svg"
import plus_gray from "../../assets/Icons/plus_gray.svg"
import BadgesScreenSearchTab from "../BadgesScreenSearchTab"
// import EmptyScreen from "./components/EmptyScreen"
import Modal from "./components/Modal"
import HomeScreen from "./components/HomeScreen"
import MintingModal from "./components/MintingModal"

export default function BadgesScreen() {
    const [addBtnHover, setAddBtnHover] = useState(false)
    const [selectedNav, setSelectedNav] = useState("badges")
    const [showModal, setShowModal] = useState(false)
    const [membershipBadges, setMembershipBadges] = useState([
        {
            name: "badge 1",
            imgUrl: "https://i.imgur.com/mufSVRW.jpg",
            holders: 2,
        },
    ])
    const [showMintingModal, setShowMintingModal] = useState(false)

    const closeModal = () => {
        setShowModal(false)
    }

    const closeMintingModal = () => {
        setShowMintingModal(false)
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
            <HomeScreen
                setShowModal={setShowModal}
                membershipBadges={membershipBadges}
                setShowMintingModal={setShowMintingModal}
            />
            {showModal && <Modal closeModal={closeModal} />}
            {showMintingModal && (
                <MintingModal
                    closeMintingModal={closeMintingModal}
                    membershipBadges={membershipBadges}
                />
            )}
        </div>
    )
}

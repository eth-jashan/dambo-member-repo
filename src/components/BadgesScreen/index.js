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
import MembershipChangeModal from "./components/MembershipChangeModal"
import { useSelector, useDispatch } from "react-redux"
import {
    getAllDaoMembers,
    setSelectedNav,
    setShowMembershipChangeModal,
    setShowMembershipCreateModal,
    setShowMembershipMintingModal,
} from "../../store/actions/membership-action"
import ContributionSchemaModal from "../SecondaryBadges/ContributionBadge/ContributionSchemeModal"
import ConfirmationBadgesModal from "../SecondaryBadges/component/ConfirmationModal"
import BadgeRequestModal from "../SecondaryBadges/component/BadgeRequestModal"
import {
    actionOnBadgesModal,
    actionOnGenerateSchemaModal,
    successConfirmationModal,
} from "../../store/actions/contibutor-action"

export default function BadgesScreen() {
    const [addBtnHover, setAddBtnHover] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const selectedNav = useSelector((x) => x.membership.selectedNav)
    const dispatch = useDispatch()

    const [showMembershipOverviewModal, setShowMembershipOverviewModal] =
        useState(false)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const contributorSchema = useSelector(
        (x) => x.contributor.contributorSchema
    )
    const contributorRequestModal = useSelector(
        (x) => x.contributor.contributionBadgeModal
    )

    const showMembershipChangeModal = useSelector(
        (x) => x.membership.showMembershipChangeModal
    )

    const showContributorSchemaModal = useSelector(
        (x) => x.contributor.schemaModal
    )

    const showContributorSuccessModal = useSelector(
        (x) => x.contributor.successModal
    )

    const showMembershipCreateModal = useSelector(
        (x) => x.membership.showMembershipCreateModal
    )

    const showMembershipMintingModal = useSelector(
        (x) => x.membership.showMembershipMintingModal
    )

    const membershipBadges = useSelector((x) => x.membership.membershipBadges)

    const closeModal = () => {
        dispatch(setShowMembershipCreateModal(false))
    }

    const closeMintingModal = () => {
        dispatch(setShowMembershipMintingModal(false))
    }

    const closeMembershipOverviewModal = () => {
        setShowMembershipOverviewModal(false)
    }

    const allMintModal = useSelector((x) => x.contributor.allMintModal)
    const editMembership = () => {
        setShowMembershipOverviewModal(false)
        setIsEditing(true)
        dispatch(setShowMembershipCreateModal(true))
    }

    const closeMembershipChangeModal = () => {
        dispatch(setShowMembershipChangeModal(false))
    }

    const schemaTemplate = useSelector((x) => x.contributor.contributorSchema)

    return (
        <div className="badges-screen-container">
            <div className="badges-screen-header">
                <div className="header-row">
                    <div className="row-links">
                        <div
                            className={`nav-link ${
                                selectedNav === "badges" && "active-nav-link"
                            }`}
                            onClick={() => dispatch(setSelectedNav("badges"))}
                        >
                            Badges
                        </div>
                        <div
                            className={`nav-link ${
                                selectedNav === "community" && "active-nav-link"
                            }`}
                            onClick={async () => {
                                dispatch(getAllDaoMembers())
                                dispatch(setSelectedNav("community"))
                            }}
                        >
                            Community
                        </div>
                    </div>
                    {/* <div
                        onMouseEnter={() => setAddBtnHover(true)}
                        onMouseLeave={() => setAddBtnHover(false)}
                        className={`add-btn ${addBtnHover ? "" : ""}`}
                    >
                        <img
                            src={addBtnHover ? plus_black : plus_gray}
                            alt="plus"
                        />
                    </div> */}
                </div>
            </div>
            {/* <BadgesScreenSearchTab /> */}
            {selectedNav === "badges" ? (
                <HomeScreen
                    membershipBadges={membershipBadges}
                    setShowMembershipOverviewModal={
                        setShowMembershipOverviewModal
                    }
                />
            ) : (
                <CommunityScreen />
            )}
            {showMembershipCreateModal && (
                <Modal
                    closeModal={closeModal}
                    membershipBadges={membershipBadges}
                    // setMembershipBadges={setMembershipBadges}
                    isEditing={isEditing}
                />
            )}
            {showMembershipMintingModal && (
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

            {showMembershipChangeModal && (
                <MembershipChangeModal
                    closeMembershipChangeModal={closeMembershipChangeModal}
                    membershipBadges={membershipBadges}
                />
            )}
            {showContributorSchemaModal && (
                <ContributionSchemaModal
                    closeModal={() =>
                        dispatch(actionOnGenerateSchemaModal(false))
                    }
                />
            )}
            {showContributorSuccessModal && (
                <ConfirmationBadgesModal
                    badgeSchema={contributorSchema}
                    type={"Contribution"}
                    closeModal={() => dispatch(successConfirmationModal(false))}
                />
            )}
            {contributorRequestModal && (
                <BadgeRequestModal
                    badgeSchema={schemaTemplate}
                    type="Contribution"
                />
            )}
            {allMintModal && (
                <ContributionSchemaModal
                    overviewModal={true}
                    closeModal={() => dispatch(actionOnBadgesModal(false))}
                />
            )}
        </div>
    )
}

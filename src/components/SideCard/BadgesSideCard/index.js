import React from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import cross_white from "../../../assets/Icons/cross_white.svg"
import {
    setSelectedMember,
    setShowMembershipChangeModal,
} from "../../../store/actions/membership-action"
import { assets } from "../../../constant/assets"

const CommunitySideCard = ({ show }) => {
    const selectedMember = useSelector((x) => x.membership.selectedMember)
    const selectedNav = useSelector((x) => x.membership.selectedNav)

    const dispatch = useDispatch()

    const closeSideBar = () => {
        dispatch(setSelectedMember(null))
    }

    const openMembershipUpdateModal = () => {
        dispatch(setShowMembershipChangeModal(true))
    }

    const changeLevel = () => (
        <div
            onClick={() => openMembershipUpdateModal()}
            className="change-level-container"
        >
            <div className="change-text">Change Level</div>
            {/* <img
                src={assets.icons.tuneIcon}
                style={{ height: "1.5rem", width: "1.5rem" }}
            /> */}
        </div>
    )

    return (
        <div
            className={`community-side-card-container ${
                !selectedMember && "not-selected-container"
            }`}
        >
            {selectedNav === "community" ? (
                selectedMember ? (
                    <div className="selected-member-wrapper">
                        <img src={cross_white} alt="" onClick={closeSideBar} />
                        <div className="member-name">
                            {selectedMember?.name}
                        </div>
                        <div className="member-addr">
                            {selectedMember?.public_address?.slice(0, 4)}...
                            {selectedMember?.public_address?.slice(-3)}
                        </div>
                        <div className="membership-info">
                            {/* <div className="membership-info-left">
                                <div className="membership-name">
                                    
                                    {selectedMember?.memberships[0]?.name}
                                </div>
                                <div className="membership-time">
                                    11:25AM, 4 Jul
                                </div>
                                <div
                                    className="change-membership"
                                    onClick={openMembershipUpdateModal}
                                >
                                    Change Membership
                                </div>
                            </div> */}
                            <img
                                src={selectedMember?.memberships[0]?.image_url}
                                className="member-image"
                            />
                            <div className="badge-info">
                                <div>
                                    <div className="level-name">Noobie</div>
                                    <div className="level-time">
                                        2 Hours ago
                                    </div>
                                </div>
                                {changeLevel()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="no-member-selected">
                        Select member to see details
                    </div>
                )
            ) : (
                <div className="no-member-selected">
                    Select badge to see details
                </div>
            )}
        </div>
    )
}

export default CommunitySideCard

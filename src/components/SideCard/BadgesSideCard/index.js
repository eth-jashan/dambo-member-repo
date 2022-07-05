import React from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import cross_white from "../../../assets/Icons/cross_white.svg"
import {
    setSelectedMember,
    setShowMembershipChangeModal,
} from "../../../store/actions/membership-action"

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
                        <div className="membership-info">
                            <div className="membership-info-left">
                                <div className="membership-name">
                                    Noobie
                                    {/* {selectedMember?.membership?.name} */}
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
                            </div>
                            <img
                                // className='membership-image'
                                src={
                                    "http://arweave.net/FD1g0umqte1Vbz-7BBN8NaZm_511bHenazj5q63h4eY"
                                }
                                alt=""
                            />
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

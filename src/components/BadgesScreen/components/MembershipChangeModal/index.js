import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import long_arrow_right from "../../../../assets/Icons/long_arrow_right.svg"
import right_arrow_white from "../../../../assets/Icons/right_arrow_white.svg"
import { useDispatch, useSelector } from "react-redux"
import {
    getMembershipBadgeFromTxHash,
    upgradeMembershipNft,
} from "../../../../utils/POCPServiceSdk"
import {
    setAllDaoMember,
    setSelectedMember,
    updateTxHash,
} from "../../../../store/actions/membership-action"
import { useNetwork } from "wagmi"

export default function MembershipChangeModal({
    closeMembershipChangeModal,
    membershipBadges,
}) {
    const [currentStep, setCurrentStep] = useState(0)
    const [selectUpgradeMembership, setUpgradeMembership] = useState(null)
    const selectedMember = useSelector((x) => x.membership.selectedMember)
    const allDaoMembers = useSelector((x) => x.membership.allDaoMembers)
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const currentDao = useSelector((x) => x.dao.currentDao)
    // const currentMembershipBadge = selectedMember.memberhips[0].uuid === membershipBadges.uuid
    const { chain } = useNetwork()
    const selectNewMembership = (x) => {
        setCurrentStep((currentStep) => currentStep + 1)
        setUpgradeMembership(x)
    }
    const upgradMembershipNft = async () => {
        if (proxyContract && !loading) {
            setLoading(true)

            if (selectedMember.membership_txns[0].membership_txn_hash) {
                const res = await getMembershipBadgeFromTxHash(
                    selectedMember.membership_txns[0].membership_txn_hash
                )

                await upgradeMembershipNft(
                    proxyContract,
                    res.data?.membershipNFTs[0].tokenID,
                    selectUpgradeMembership.level,
                    selectUpgradeMembership.category,
                    selectUpgradeMembership.metadata_hash,
                    (x) => {
                        dispatch(
                            updateTxHash(
                                x,
                                "upgrade",
                                selectedMember.membership_txns[0]
                                    .membership_txn_hash,
                                chain?.id
                            )
                        )
                    },
                    (x) => {
                        setLoading(false)
                        const newMember = {
                            ...selectedMember,
                            memberships: [selectUpgradeMembership],
                        }
                        dispatch(setSelectedMember(newMember))
                        const newObj = {
                            dao_members: [],
                            non_claimers_addr: [],
                        }
                        allDaoMembers.dao_members.forEach((x, i) => {
                            if (selectedMember.index === i) {
                                const newMembership = {
                                    ...selectedMember,
                                    memberships: [selectUpgradeMembership],
                                }
                                newObj.dao_members.push(newMembership)
                            } else {
                                newObj.dao_members.push(x)
                            }
                        })
                        allDaoMembers.non_claimers_addr.forEach((x) => {
                            newObj.non_claimers_addr.push(x)
                        })
                        dispatch(setAllDaoMember(newObj))
                        // closeMembershipChangeModal()
                        closeMembershipChangeModal()
                        // dispatch(setSelectedMember())
                    }
                )
            }
        }
    }
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
                                            {currentDao?.uuid ===
                                                "93ba937e02ea4fdb9633c2cb27345200" ||
                                            currentDao?.uuid ===
                                                "981349a995c140d8b7fb5c110b0d133b" ? (
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
                                            {selectedMember.memberships[0]
                                                ?.uuid === badge.uuid && (
                                                <div>Current Role</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="membership-badge-time">
                                        {selectedMember.memberships[0]?.uuid ===
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
                                Upgrade from {selectedMember.memberships.name}{" "}
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
                                                selectedMember?.memberships[0]
                                                    ?.image_url
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
                                    {loading
                                        ? "Upgrading...."
                                        : "Confirm Upgrade"}
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

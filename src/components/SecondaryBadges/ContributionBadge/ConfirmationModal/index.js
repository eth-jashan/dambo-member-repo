import React, { useState } from "react"
import "./style.scss"

export default function ContributionSchemaModal({
    closeModal,
    membershipBadges,
    isEditing,
}) {
    const increaseStep = () => {
        // setContributionStep(2)
        // console.log("membership step is", membershipStep)
        // if (membershipStep >= 2) {
        //     closeModal()
        //     setMembershipStep(1)
        //     const formData = new FormData()
        //     localMembershipBadges.forEach((badge, index) => {
        //         formData.append("file", badge.file)
        //         formData.append("name", badge.name)
        //         formData.append("level", badge.level || index + 1)
        //         formData.append("category", 1)
        //         formData.append("description", badge.description)
        //     })
        //     dispatch(
        //         createMembershipBadges(
        //             formData,
        //             localMembershipBadges,
        //             isEditing
        //         )
        //     )
        // } else {
        //     setMembershipStep((membershipStep) => membershipStep + 1)
        // }
    }

    const SelectBadgeType = () => {
        return (
            // <>
            //     <div className="heading">Select badge type</div>
            //     <div
            //         className="badge-type-row"
            //         onClick={() => {
            //             // setBadgeType("membership")
            //             increaseStep()
            //         }}
            //     >
            //         <div className="badge-type">
            //             <div className="badge-icon">
            //                 {/* <img src={membershipIcon} alt="membership" /> */}
            //             </div>
            //             <div>
            //                 <div className="badge-type-heading">
            //                     Membership badges
            //                 </div>
            //                 <div className="badge-type-content">
            //                     Membership badges are upgradable entity that
            //                     will be upgraded with community
            //                 </div>
            //             </div>
            //             <div>
            //                 <div className="badge-type-btn">
            //                     {/* <img src={arrow_forward} alt="" /> */}
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div
            //         className="badge-type-row"
            //         onClick={() => {
            //             setBadgeType("contribution")
            //             increaseStep()
            //         }}
            //     >
            //         <div className="badge-type">
            //             <div className="badge-icon">
            //                 {/* <img src={contributionIcon} alt="membership" /> */}
            //             </div>
            //             <div>
            //                 <div className="badge-type-heading">
            //                     Contribution badges
            //                 </div>
            //                 <div className="badge-type-content">
            //                     Contribution badges are individual badges that
            //                     work as a proof of contribution, they can either
            //                     be requested or awarded to community.
            //                 </div>
            //             </div>
            //             <div>
            //                 <div className="badge-type-btn">
            //                     {/* <img src={arrow_forward} alt="" /> */}
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            //     <div
            //         className="badge-type-row"
            //         onClick={() => {
            //             setBadgeType("appreciation")
            //             increaseStep()
            //         }}
            //     >
            //         <div className="badge-type">
            //             <div className="badge-icon">
            //                 {/* <img src={appreciationIcon} alt="membership" /> */}
            //             </div>
            //             <div>
            //                 <div className="badge-type-heading">
            //                     Appreciation badges
            //                 </div>
            //                 <div className="badge-type-content">
            //                     Appreciation badges are individual badges that
            //                     can be given to members for outlier performance.
            //                 </div>
            //             </div>
            //             <div>
            //                 <div className="badge-type-btn">
            //                     {/* <img src={arrow_forward} alt="" /> */}
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </>
        )
    }

    const renderOnStep = () => {
        switch (contributionStep) {
            case 0:
                return <SelectBadgeType />
            case 1:
                return (
                    <ContributionCreationStep1
                        increaseStep={increaseStep}
                        schemaTemplate={schemaTemplate}
                        setSchemaTemplate={setSchemaTemplate}
                    />
                )
            case 2:
                return (
                    <ContributionCreationStep2
                        increaseStep={increaseStep}
                        schemaTemplate={schemaTemplate}
                        setSchemaTemplate={setSchemaTemplate}
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
                    contributionStep !== 0 && "main-at-bottom"
                }`}
                onClick={closeModal}
            >
                <div
                    className={`modal-main ${
                        contributionStep !== 0 && "main-expanded"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="close-btn" onClick={closeModal}>
                        <img src={assets.icons.crossBlack} alt="" />
                    </div>
                    {renderOnStep()}
                </div>
            </div>
        </div>
    )
}

import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import ContributionCreationStep1 from "../../component/ContributionCreationStep1"
import ContributionCreationStep2 from "../../component/ContributionCreationStep2"
import { assets } from "../../../../constant/assets"
import membershipIcon from "../../../../assets/Icons/membershipIcon.svg"
import appreciationIcon from "../../../../assets/Icons/appreciationIcon.svg"
import contributionIcon from "../../../../assets/Icons/contributionIcon.svg"
import arrow_forward from "../../../../assets/Icons/arrow_forward.svg"
import cross from "../../../../assets/Icons/cross.svg"
import {
    actionOnBadgesModal,
    actionOnContributionRequestModal,
    actionOnGenerateSchemaModal,
    badgeSelectionMember,
    createContributionBadgeSchema,
    successConfirmationModal,
} from "../../../../store/actions/contibutor-action"

export default function ContributionSchemaModal({
    closeModal,
    membershipBadges,
    isEditing,
    overviewModal = false,
}) {
    const [contributionStep, setContributionStep] = useState(
        overviewModal ? 0 : 1
    )
    const selectedMember = useSelector((x) => x.membership.selectedMember)
    const [badgeType, setBadgeType] = useState(null)
    const schema = useSelector((x) => x.contributor.contributorSchema)
    const schemaId = useSelector((x) => x.contributor.contributorSchemaId)

    const [schemaTemplate, setSchemaTemplate] = useState([
        {
            fieldName: "Contribution Title",
            fieldType: "Text Field",
            options: [],
            maxSelection: 1,
        },

        {
            fieldName: "Time Spent in Hours",
            fieldType: "Numbers",
            options: [],
            maxSelection: 1,
        },
        {
            fieldName: "Additional Notes",
            fieldType: "Long text",
            options: [],
            maxSelection: 1,
        },
        {
            fieldName: "Contribution Category",
            fieldType: "Multiselect",
            options: ["Design", "Development", "Content", "Marketing"],
            maxSelection: 1,
        },
    ])

    const dispatch = useDispatch()

    const increaseStep = async () => {
        if (contributionStep === 1) {
            setContributionStep(2)
        } else {
            try {
                await dispatch(
                    createContributionBadgeSchema(schemaTemplate, schemaId + 1)
                )
                dispatch(successConfirmationModal(true))
                dispatch(actionOnGenerateSchemaModal(false))
                setContributionStep(1)
            } catch (error) {
                console.error("error on creating schema", error)
            }
        }
    }

    const SelectBadgeType = () => {
        return (
            <>
                <div className="heading">Select badge type</div>
                <div className="badge-type-row">
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={membershipIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Contribution badges
                            </div>
                            <div className="badge-type-content">
                                Contribution badges are individual badges that
                                work as a proof of contribution, they can either
                                be requested or awarded to community.
                            </div>
                            {!schema && (
                                <div
                                    onClick={() => {
                                        dispatch(
                                            actionOnGenerateSchemaModal(true)
                                        )
                                        dispatch(actionOnBadgesModal(false))
                                    }}
                                    className="setup-btn"
                                >
                                    <div>Setup Contribution badge</div>
                                    <img src={assets.icons.chevronRightWhite} />
                                </div>
                            )}
                        </div>
                        <div>
                            <div
                                onClick={() => {
                                    dispatch(actionOnBadgesModal(false))
                                    dispatch(
                                        badgeSelectionMember(
                                            selectedMember.public_address
                                        )
                                    )
                                    dispatch(
                                        actionOnContributionRequestModal(true)
                                    )
                                }}
                                className={
                                    !schema
                                        ? "badge-type-btn-disable"
                                        : "badge-type-btn"
                                }
                            >
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div
                    className="badge-type-row"
                    onClick={() => {
                        setBadgeType("contribution")
                        increaseStep()
                    }}
                >
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={contributionIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Appreciation badges
                            </div>
                            <div className="badge-type-content">
                                Appreciation badges are individual badges that
                                can be given to members for outlier performance.
                            </div>
                            <div className="setup-btn">
                                <div>Setup Appreciation badge</div>
                                <img src={assets.icons.chevronRightWhite} />
                            </div>
                        </div>
                        <div>
                            <div className="badge-type-btn-disable">
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <div
                    className="badge-type-row"
                    onClick={() => {
                        setBadgeType("appreciation")
                        increaseStep()
                    }}
                >
                    <div className="badge-type">
                        <div className="badge-icon">
                            <img src={appreciationIcon} alt="membership" />
                        </div>
                        <div>
                            <div className="badge-type-heading">
                                Appreciation badges
                            </div>
                            <div className="badge-type-content">
                                Appreciation badges are individual badges that
                                can be given to members for outlier performance.
                            </div>
                        </div>
                        <div>
                            <div className="badge-type-btn">
                                <img src={arrow_forward} alt="" />
                            </div>
                        </div>
                    </div>
                </div> */}
            </>
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

import React, { useState } from "react"
import "./style.scss"
import rightArrow from "../../../../assets/Icons/right_arrow_white.svg"
import cross from "../../../../assets/Icons/cross.svg"
import { useDispatch } from "react-redux"
import {
    actionOnContributionRequestModal,
    actionOnGenerateSchemaModal,
    successConfirmationModal,
} from "../../../../store/actions/contibutor-action"

export default function ConfirmationBadgesModal({
    closeModal,
    type,
    badgeSchema,
    isEditing,
}) {
    const dispatch = useDispatch()
    const dismissModal = () => {
        dispatch(successConfirmationModal(false))
    }

    const onEdit = () => {
        dispatch(successConfirmationModal(false))
        dispatch(actionOnGenerateSchemaModal(true))
    }

    return (
        <div className="contribution-confirm-modal-container">
            <div onClick={dismissModal} className="modal-backdrop">
                <div className="modal-div" onClick={(e) => e.stopPropagation()}>
                    <img
                        src={cross}
                        alt=""
                        onClick={dismissModal}
                        className="modal-cross-btn"
                    />
                    <div className="modal-header-div">
                        <div className="modal-header-green">
                            Congratulations
                        </div>
                        <div className="modal-header">Setup complete</div>
                    </div>

                    <div className="modal-title-div">
                        <div className="modal-tilte">{`${type} Badges`}</div>
                    </div>

                    <div className="badge-schema-div">
                        {badgeSchema.map((badge, index) => (
                            <div className="badge-element-div" key={index}>
                                <div className="badge-schema-field">
                                    {badge.fieldName}
                                </div>
                                <div className="badge-schema-type">
                                    {badge.fieldType}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="btn-wrapper-div">
                        <div onClick={() => onEdit()}>Edit Schema</div>
                        <button
                            onClick={() => {
                                dispatch(actionOnContributionRequestModal(true))
                                dispatch(successConfirmationModal(false))
                            }}
                            className="badge-confirmation-btn"
                        >
                            <div>Mint Contribution badge</div>
                            <img src={rightArrow} alt="right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

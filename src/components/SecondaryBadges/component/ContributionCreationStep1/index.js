import React from "react"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import "./style.scss"
import NextButton from "../../../NextButton"

export default function ContributionCreationStep1({
    increaseStep,
    schemaTemplate,
    setSchemaTemplate,
}) {
    const updateSchema = (badgeIndex, newValue) => {
        const copyOfBadges = [...schemaTemplate]
        copyOfBadges[badgeIndex].name = newValue
        setSchemaTemplate(copyOfBadges)
    }

    const addSchema = () => {
        setSchemaTemplate((membershipBadges) => [
            ...membershipBadges,
            {
                fieldName: "",
                fieldType: "",
                options: [],
            },
        ])
    }

    const checkIsDisabled = () => {
        let isDisabled = false
        schemaTemplate.forEach((x) => {
            if (!x.fieldName) {
                isDisabled = true
            }
        })
        return isDisabled
    }

    const renderSchemaHeader = () => (
        <div className="element-row">
            <div className="row-heading">Field Name</div>
            <div className="row-heading">Field Type</div>
        </div>
    )

    return (
        <div className="contribution-step1">
            <div className="contribution-heading">Contribution badge setup</div>
            <div className="contribution-content">
                <div className="contribution-left">
                    <div className="left-bold">Select Fields</div>
                    <div className="left-greyed">Step 1 of 2</div>
                </div>
                <div className="contribution-right">
                    <div>
                        {renderSchemaHeader()}
                        {schemaTemplate.map((x, i) => (
                            <div key={i} className="element-row">
                                <div>
                                    <div className="row-field-name">
                                        {x.fieldName}
                                    </div>
                                    {x.options.length > 0 && (
                                        <div className="options-div">
                                            {x.options.map((option, index) => (
                                                <div
                                                    className="option-text"
                                                    key={index}
                                                >
                                                    {option}
                                                    {index <
                                                        x.options.length - 1 &&
                                                        ` / `}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="row-field-type">
                                    {x.fieldType}
                                </div>
                            </div>
                        ))}
                        <div className="add-btn">
                            <div>Add another Level</div>
                            <img src={plus_black} alt="" />
                        </div>
                    </div>
                    <div className="next-btn-wrapper-contri1">
                        <NextButton
                            text="Review Details"
                            isContributor={true}
                            isDisabled={checkIsDisabled()}
                            nextButtonCallback={increaseStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

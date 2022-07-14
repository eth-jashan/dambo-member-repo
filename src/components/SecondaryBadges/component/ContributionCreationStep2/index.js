import React from "react"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import "./style.scss"
import NextButton from "../../../NextButton"
import { assets } from "../../../../constant/assets"

export default function ContributionCreationStep2({
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

    const renderDesignChangeRequest = () => (
        <div className="design-change-div">
            <img src={assets.icons.errorIcon} />
            <div>Please contact us to change the design for the badge</div>
        </div>
    )

    return (
        <div className="contribution-step1">
            <div className="contribution-heading">Contribution badge setup</div>
            <div className="contribution-content">
                <div className="contribution-left">
                    <div className="left-bold">Review Badge</div>
                    <div className="left-greyed">Step 2 of 2</div>
                </div>
                <div className="contribution-right">
                    <div>
                        <div className="contribution-card">
                            {renderDesignChangeRequest()}
                        </div>
                    </div>
                    <div className="schema-overview-div">
                        {/* {renderSchemaHeader()} */}
                        {schemaTemplate.map((x, i) => (
                            <div key={i} className="element-row-step2">
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
                                <div className="row-field-type-step2">
                                    {x.fieldType}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="next-btn-wrapper-contri2">
                        <NextButton
                            text="Finish Setup"
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

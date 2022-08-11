import React from "react"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import "./style.scss"
import NextButton from "../../../NextButton"
import FormElementSelection from "../../../Form/FormElementSelection"
import { Select, Menu, Dropdown } from "antd"

const { Option } = Select

export default function ContributionCreationStep1({
    increaseStep,
    schemaTemplate,
    setSchemaTemplate,
}) {
    const updateSchema = (badgeIndex, newValue) => {
        const copyOfBadges = [...schemaTemplate]
        copyOfBadges[badgeIndex].fieldName = newValue
        setSchemaTemplate(copyOfBadges)
    }

    const updateSchemaType = (badgeIndex, newValue) => {
        const copyOfBadges = [...schemaTemplate]
        copyOfBadges[badgeIndex].fieldType = newValue
        setSchemaTemplate(copyOfBadges)
    }
    const onMaxSelection = (badgeIndex, newValue) => {
        const copyOfBadges = [...schemaTemplate]
        copyOfBadges[badgeIndex].maxSelection = newValue
        setSchemaTemplate(copyOfBadges)
    }
    const onChangeOption = (
        badgeIndex,
        optionIndex,
        newValue,
        reset = false
    ) => {
        if (reset) {
            const copyOfBadges = [...schemaTemplate]
            copyOfBadges[badgeIndex].options = [""]
            setSchemaTemplate(copyOfBadges)
            console.log("input", badgeIndex, newValue, copyOfBadges, newValue)
        } else {
            const copyOfBadges = [...schemaTemplate]
            copyOfBadges[badgeIndex].options[optionIndex] = newValue
            setSchemaTemplate(copyOfBadges)
            console.log("input", badgeIndex, newValue, copyOfBadges, newValue)
        }
    }
    const onRemoveOptions = (badgeIndex, optionIndex) => {
        console.log("fired remove option", badgeIndex, optionIndex)
        const copyOfBadges = [...schemaTemplate]
        let copyOfOption = copyOfBadges[badgeIndex].options
        copyOfOption = copyOfOption.filter(
            (x, i) => i !== optionIndex && x !== null
        )
        copyOfBadges[badgeIndex].options = copyOfOption
        setSchemaTemplate(copyOfBadges)
        console.log("input", badgeIndex, copyOfBadges)
    }

    const deleteFeild = (index) => {
        const copyOfBadges = [...schemaTemplate]
        const newBadgeSchema = []
        copyOfBadges.forEach((x, i) => {
            if (index !== i) {
                newBadgeSchema.push(x)
            }
        })
        setSchemaTemplate(newBadgeSchema)
    }

    const addSchema = (type) => {
        let element
        if (type === "Multiselect") {
            element = {
                fieldName: "",
                fieldType: type,
                options: ["Option1"],
                maxSelection: 1,
            }
        } else {
            element = {
                fieldName: "",
                fieldType: type,
                options: [],
                maxSelection: 1,
            }
        }
        console.log("added element", element)
        setSchemaTemplate((membershipBadges) => [...membershipBadges, element])
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
            <div className="header">
                <div className="row-heading">Field Name</div>
                <div className="row-heading">Field Type</div>
            </div>
        </div>
    )

    const addLevelMenu = (
        <Menu
            items={[
                {
                    key: "1",
                    label: (
                        <a onClick={() => addSchema("Text Field")}>
                            Text Field
                        </a>
                    ),
                },
                {
                    key: "2",
                    label: <a onClick={() => addSchema("Numbers")}>Numbers</a>,
                },
                {
                    key: "3",
                    label: (
                        <a
                            onClick={() => {
                                addSchema("Multiselect")
                            }}
                        >
                            Multiselect
                        </a>
                    ),
                },
                {
                    key: "4",
                    label: (
                        <a onClick={() => addSchema("Long text")}>Long text</a>
                    ),
                },
                {
                    key: "5",
                    label: (
                        <a onClick={() => addSchema("Media Upload")}>
                            Media Upload
                        </a>
                    ),
                },
            ]}
        />
    )
    return (
        <div className="contribution-step1">
            <div className="contribution-heading">Contribution badge setup</div>
            <div className="contribution-content">
                <div className="contribution-left1">
                    <div className="left-bold">Select Fields</div>
                    <div className="left-greyed">Step 1 of 2</div>
                </div>
                <div className="contribution-right">
                    <div>
                        {renderSchemaHeader()}
                        {schemaTemplate.map((x, i) => (
                            <FormElementSelection
                                onChangeFeildValue={updateSchema}
                                onChangeFeildType={updateSchemaType}
                                item={x}
                                key={i}
                                index={i}
                                onChangeOption={onChangeOption}
                                onMaxSelection={onMaxSelection}
                                removeOptions={onRemoveOptions}
                                deleteFeild={(i) => deleteFeild(i)}
                                schema={schemaTemplate}
                            />
                        ))}
                        <Dropdown trigger="click" overlay={addLevelMenu}>
                            <div className="add-btn">
                                <img src={plus_black} alt="" />
                                <div>Add another Level</div>
                            </div>
                        </Dropdown>
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

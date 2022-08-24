import React, { useState } from "react"
import "./styles.scss"
import { MdChevronRight } from "react-icons/all"
import cross from "../../../assets/Icons/cross.svg"
import InputText from "../../InputComponent/Input"
import { Input, message, Progress, InputNumber } from "antd"
import { useDispatch, useSelector } from "react-redux"
import {
    createContributionrequest,
    raiseContributionRequest,
    getPendingContributions,
} from "../../../store/actions/contibutor-action"
import Select from "react-select"
import { getContriRequest } from "../../../store/actions/dao-action"
import { getAllMembershipBadges } from "../../../utils/POCPServiceSdk"

const ContributionRequestModal = ({ setVisibility }) => {
    const schemaOfDao = useSelector((x) => x.contributor.contributorSchema)
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const address = useSelector((x) => x.auth.address)
    const [title, setTile] = useState("")
    const [time, setTime] = useState("")
    const [link, setLink] = useState("")
    const [comments, setComments] = useState("")
    const [contributionType, setContributionType] = useState("")
    const [descriptionFocus, setDescriptionFocus] = useState("")
    const [loading, setLoading] = useState(false)
    const [focusOnTime, setFocusOnTime] = useState(false)
    const [focusOnSelect, setFocusOnSelect] = useState(false)
    const [linkError, setLinkError] = useState(false)

    const dispatch = useDispatch()
    const [schemaTemplate, setSchemaTemplate] = useState(schemaOfDao)

    const isValid = () => {
        const urlExpression =
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        const regex = new RegExp(urlExpression)
        if (link.length > 0 && !link.match(regex)) {
            return false
        }
        if (title.length > 0 && time > 0 && comments.length > 0) {
            return true
        } else {
            return false
        }
    }

    const onSubmit = async () => {
        if (!loading) {
            setLoading(true)
            const memberTokenId = await getAllMembershipBadges(
                address,
                proxyContract,
                false
            )

            try {
                await dispatch(
                    raiseContributionRequest(
                        parseInt(memberTokenId.data.membershipNFTs[0].tokenID),
                        schemaTemplate
                    )
                )
                setLoading(false)
                setVisibility(false)
                message.success("contribution created successfully")
                dispatch(getPendingContributions())
            } catch (error) {
                console.error("error", error)
                setLoading(false)
                message.error("something went wrong")
            }
        }
    }

    const handleLinkBlur = () => {
        const urlExpression =
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        const regex = new RegExp(urlExpression)
        if (link.length > 0 && !link.match(regex)) {
            setLinkError(true)
        } else {
            setLinkError(false)
        }
    }

    const onChangeText = (values, index) => {
        const newCopy = schemaTemplate.map((item, i) => {
            if (i === index) {
                return { ...item, value: values }
            } else {
                return item
            }
        })
        setSchemaTemplate(newCopy)
    }
    const onMultiTextChange = (value, index) => {
        let newValue
        if (schemaTemplate[index].maxSelection > 1) {
            newValue = []
            value.forEach((x) => {
                newValue.push(x.value)
            })
            if (schemaTemplate[index].maxSelection + 1 > value.length) {
                const newCopy = schemaTemplate?.map((item, i) => {
                    if (i === index) {
                        return { ...item, value: newValue }
                    } else {
                        return item
                    }
                })
                setSchemaTemplate(newCopy)
            }
        } else {
            newValue = value.value
            const newCopy = schemaTemplate?.map((item, i) => {
                if (i === index) {
                    return { ...item, value: newValue }
                } else {
                    return item
                }
            })
            setSchemaTemplate(newCopy)
        }
    }

    const textInput = (placeholder, index) => (
        <div className="contribution-title-input-wrapper">
            <InputText
                key={index}
                placeholder={placeholder}
                onChange={(e) => onChangeText(e.target?.value, index)}
                value={schemaTemplate[index].value}
            />
        </div>
    )

    const numberInput = (placeholder, index) => (
        <div className="rowInput">
            <div className="contribution-time-input-wrapper">
                <InputNumber
                    key={index}
                    placeholder={placeholder}
                    onChange={(e) => onChangeText(e, index)}
                    value={schemaTemplate[index].value}
                    min={0}
                    onFocus={() => setFocusOnTime(true)}
                    onBlur={() => setFocusOnTime(false)}
                    className={`numberInput ${
                        !focusOnTime && time ? "timeDark" : ""
                    }`}
                />
            </div>
        </div>
    )

    const buildMultiOptions = (options) => {
        const newOptions = []
        options.forEach((x) => {
            if (x !== null && x !== "" && x !== " ") {
                newOptions.push({ value: x, label: x })
            }
        })
        return newOptions
    }

    const selectInput = (placeholder, index) => (
        <div className="contribution-type-input-wrapper">
            <div>
                <Select
                    isMulti={schemaTemplate[index].maxSelection > 1}
                    classNamePrefix="select"
                    closeMenuOnSelect
                    onChange={(x) => {
                        if (schemaTemplate[index].maxSelection > 1) {
                            if (
                                x.length <
                                schemaTemplate[index].maxSelection + 1
                            ) {
                                onMultiTextChange(x, index)
                            }
                        } else {
                            onMultiTextChange(x, index)
                        }
                    }}
                    isOptionDisabled={(option) =>
                        schemaTemplate[index].value?.length >=
                        schemaTemplate[index].maxSelection
                    }
                    isSearchable={false}
                    name="color"
                    options={buildMultiOptions(schemaTemplate[index].options)}
                    placeholder={placeholder}
                    onFocus={() => setFocusOnSelect(true)}
                    onBlur={() => setFocusOnSelect(false)}
                    className={`select-input ${
                        !focusOnSelect && contributionType?.value
                            ? "selectDark"
                            : ""
                    }`}
                />
            </div>
        </div>
    )

    const longTextInput = (placeholder, index) => (
        <div
            className={`text-area-wrapper ${
                descriptionFocus ? "text-area-focused" : ""
            } ${
                !descriptionFocus && comments?.length > 0
                    ? "text-area-dark"
                    : ""
            }`}
        >
            <Input.TextArea
                placeholder={placeholder}
                key={index}
                className="textArea"
                onFocus={() => setDescriptionFocus(true)}
                onBlur={() => setDescriptionFocus(false)}
                autoSize={{ maxRows: 3 }}
                maxLength={200}
                bordered={false}
                value={schemaTemplate[index]?.value}
                onChange={(e) => onChangeText(e.target?.value, index)}
            />
            <Progress
                trailColor="#CCCCCC"
                strokeColor="#6852FF"
                strokeWidth={10}
                style={{
                    bottom: 12,
                    right: 12,
                    position: "absolute",
                }}
                width={20}
                type="circle"
                showInfo={false}
                percent={(schemaTemplate[index]?.value?.length / 200) * 100}
            />
        </div>
    )

    const getInputField = (type, placeholder, index) => {
        switch (type) {
            case "Text Field":
                return textInput(placeholder, index)
            case "Numbers":
                return numberInput(placeholder, index)
            case "Long text":
                return longTextInput(placeholder, index)
            case "Multiselect":
                return selectInput(placeholder, index)
        }
    }

    return (
        <div className="backdrop contribution-request-container">
            <div className="modal">
                <div className="contribution-body">
                    <img
                        onClick={() => setVisibility(false)}
                        alt="cross"
                        src={cross}
                        className="cross"
                    />
                    <div className="heading">
                        New contribution
                        <br /> request
                    </div>
                    {schemaTemplate.map((badge, index) =>
                        getInputField(badge.fieldType, badge.fieldName, index)
                    )}
                </div>

                <div onClick={() => onSubmit()} className="buttonSubmit">
                    <div className={"validText"}>
                        {loading ? "Creating..." : "Create Request"}
                    </div>
                    <MdChevronRight color={isValid() ? "white" : "#B4A8FF"} />
                </div>
            </div>
        </div>
    )
}

export default ContributionRequestModal

import React, { useState } from "react"
import "./styles.scss"
import { MdChevronRight } from "react-icons/all"
import cross from "../../../assets/Icons/cross.svg"
import InputText from "../../InputComponent/Input"
import { Input, message, Progress, InputNumber } from "antd"
import { useDispatch } from "react-redux"
import { createContributionrequest } from "../../../store/actions/contibutor-action"
import Select from "react-select"
import { getContriRequest } from "../../../store/actions/dao-action"

const ContributionRequestModal = ({ setVisibility }) => {
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
            if (isValid()) {
                const res = await dispatch(
                    createContributionrequest(
                        title,
                        contributionType.value,
                        link,
                        time,
                        comments
                    )
                )
                if (res) {
                    message.success("Request Submitted Successfully")
                    setVisibility(false)
                } else {
                    message.error("Try creating again")
                }
                await dispatch(getContriRequest())
            }
            setLoading(false)
        }
    }

    const contributionTypeOptions = [
        { value: "DESIGN", label: "DESIGN" },
        { value: "CODEBASE", label: "CODEBASE" },
        { value: "CONTENT", label: "CONTENT" },
    ]

    const handleLinkBlur = () => {
        let urlExpression =
            /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
        let regex = new RegExp(urlExpression)
        if (link.length > 0 && !link.match(regex)) {
            setLinkError(true)
        } else {
            setLinkError(false)
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

                    <div className="contribution-title-input-wrapper">
                        <InputText
                            placeholder="Contribution Title"
                            onChange={(e) => setTile(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="rowInput">
                        <div className="contribution-time-input-wrapper">
                            <InputNumber
                                placeholder="Time Spent(in hours)"
                                onChange={(value) => setTime(value)}
                                value={time}
                                min={0}
                                onFocus={() => setFocusOnTime(true)}
                                onBlur={() => setFocusOnTime(false)}
                                className={`numberInput ${
                                    !focusOnTime && time ? "timeDark" : ""
                                }`}
                            />
                        </div>
                        <div
                            className={`external-link-input-wrapper ${
                                linkError ? "external-link-error" : ""
                            }`}
                        >
                            <InputText
                                placeholder="External Link"
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                onBlur={handleLinkBlur}
                            />
                        </div>
                    </div>

                    <div className="contribution-type-input-wrapper">
                        <div>
                            <Select
                                classNamePrefix="select"
                                closeMenuOnSelect
                                onChange={setContributionType}
                                isSearchable={false}
                                name="color"
                                options={contributionTypeOptions}
                                placeholder="Contribution Type"
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
                            placeholder="Write your feedback here"
                            className="textArea"
                            onFocus={() => setDescriptionFocus(true)}
                            onBlur={() => setDescriptionFocus(false)}
                            autoSize={{ maxRows: 3 }}
                            maxLength={200}
                            bordered={false}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
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
                            percent={(comments.length / 200) * 100}
                        />
                    </div>
                </div>

                <div onClick={() => onSubmit()} className="buttonSubmit">
                    <div className={isValid() ? "validText" : "greyedText"}>
                        {loading ? "Creating..." : "Create Request"}
                    </div>
                    <MdChevronRight color={isValid() ? "white" : "#B4A8FF"} />
                </div>
            </div>
        </div>
    )
}

export default ContributionRequestModal

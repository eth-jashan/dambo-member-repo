import React, { useState } from "react"
import styles from "./styles.module.css"
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

    const textAreaProperty = () => {
        if (descriptionFocus) {
            return { background: "white", border: "1px solid #6852FF" }
        } else if (!descriptionFocus && comments.length > 0) {
            return { background: "#E1DCFF", border: "1px solid #EEEEF0" }
        } else if (!descriptionFocus && comments.length === 0) {
            return { background: "white", border: "1px solid #EEEEF0" }
        }
    }

    const colourStyles = {
        control: (styles, state) => {
            return {
                ...styles,
                width: "100%",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                backgroundColor: "transparent",
                border:
                    state.menuIsOpen || state.isFocused
                        ? "1px solid #6852FF"
                        : "1px solid #eeeef0",
            }
        },
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            //   const color = chroma(data.color);
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1.1rem",
                width: "100%",
                color: "black",
                textAlign: "left",
            }
        },
        dropdownIndicator: (styles, state) => ({
            ...styles,
            color: state.menuIsOpen || state.isFocused ? "#6852FF" : "#e0e0e0",
        }),
        menu: (styles) => ({ ...styles, width: "100%" }),
        input: (styles, { data, isDisabled, isFocused, isSelected }) => {
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                textAlign: "left",
            }
        },
        placeholder: (styles) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px",
            textAlign: "left",
        }),
        singleValue: (styles, { data }) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "16px",
            lineHeight: "24px",
            width: "100%",
            color: "black",
            textAlign: "left",
        }),
    }

    const contributionTypeOptions = [
        { value: "DESIGN", label: "DESIGN" },
        { value: "CODEBASE", label: "CODEBASE" },
        { value: "CONTENT", label: "CONTENT" },
    ]

    //   const contributionTypeOptions = ['DESIGN', 'CODEBASE', 'DUMMY', 'CONTENT']
    // console.log("contributionType", contributionType);
    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "start",
                        flexDirection: "column",
                        width: "100%",
                    }}
                >
                    <img
                        onClick={() => setVisibility(false)}
                        alt="cross"
                        src={cross}
                        className={styles.cross}
                    />
                    <div className={`${styles.heading}`}>
                        New contribution
                        <br /> request
                    </div>

                    <div style={{ width: "100%" }}>
                        <InputText
                            placeholder="Contribution Title"
                            onChange={(e) => setTile(e.target.value)}
                            value={title}
                            width={"100%"}
                        />
                    </div>

                    <div className={styles.rowInput}>
                        <div style={{ width: "48%" }}>
                            <InputNumber
                                placeholder="Time Spent(in hours)"
                                onChange={(value) => setTime(value)}
                                value={time}
                                width={"100%"}
                                min={0}
                                onFocus={() => setFocusOnTime(true)}
                                onBlur={() => setFocusOnTime(false)}
                                className={`${styles.numberInput} ${
                                    !focusOnTime && time ? styles.timeDark : ""
                                }`}
                            />
                        </div>
                        <div style={{ width: "48%" }}>
                            <InputText
                                placeholder="External Link"
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                width={"100%"}
                            />
                        </div>
                    </div>

                    <div style={{ width: "100%" }}>
                        {/* <InputText
              placeholder="Contribution Type"
              onChange={(e) => setContributionType(e.target.value)}
              value={contributionType}
              width={"100%"}
            /> */}
                        <div>
                            <Select
                                // components={{Option: CustomOption}}
                                classNamePrefix="select"
                                closeMenuOnSelect
                                onChange={setContributionType}
                                styles={colourStyles}
                                isSearchable={false}
                                name="color"
                                options={contributionTypeOptions}
                                placeholder="Contribution Type"
                                onFocus={() => setFocusOnSelect(true)}
                                onBlur={() => setFocusOnSelect(false)}
                                className={`basic-single ${
                                    !focusOnSelect && contributionType?.value
                                        ? styles.selectDark
                                        : ""
                                }`}
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            height: "7.25rem",
                            width: "100%",
                            marginTop: "1rem",
                            position: "relative",
                            border: textAreaProperty()?.border,
                            borderRadius: "0.5rem",
                            background: textAreaProperty()?.background,
                        }}
                    >
                        <Input.TextArea
                            placeholder="Write your feedback here"
                            className={styles.textArea}
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

                <div onClick={() => onSubmit()} className={styles.buttonSubmit}>
                    <div
                        className={
                            isValid() ? styles.validText : styles.gereyedText
                        }
                    >
                        {loading ? "Creating..." : "Create Request"}
                    </div>
                    <MdChevronRight color={isValid() ? "white" : "#B4A8FF"} />
                </div>

                {/* </div> */}
            </div>
            {/* <div className={styles.opacity}/> */}
        </div>
    )
}

export default ContributionRequestModal

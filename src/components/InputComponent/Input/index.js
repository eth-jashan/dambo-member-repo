import React, { useState } from "react"
import styles from "./styles.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"

const InputText = ({
    value,
    onChange,
    placeholder,
    width,
    disabled = false,
    multi,
    textLabel,
    onBlur,
}) => {
    const [onFocus, setOnFocus] = useState()

    const backGroundStatus = () => {
        if (value?.length > 0 && onFocus) {
            return "white"
        } else if (onFocus) {
            return "white"
        } else if (value?.length > 0 && !onFocus) {
            return "#E1DCFF"
        } else {
            return "white"
        }
    }

    return (
        <div className={textLabel && styles.inputContainer}>
            {textLabel && <div className={textStyles.m_16}>To</div>}
            <input
                value={value}
                onChange={(e) => onChange(e)}
                placeholder={placeholder}
                className={styles.textInput}
                onFocus={() => setOnFocus(true)}
                onBlur={(e) => {
                    setOnFocus(false)
                    onBlur && onBlur(e)
                }}
                disabled={disabled}
                style={{
                    width,
                    height: multi || null,
                    background: backGroundStatus(),
                }}
            />
        </div>
    )
}

export default InputText

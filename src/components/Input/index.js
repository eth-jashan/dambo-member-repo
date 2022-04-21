import React, { useState } from "react"
import styles from "./styles.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"

const InputText = ({
    value,
    onChange,
    placeholder,
    width,
    disabled = false,
    multi,
    textLabel,
}) => {
    const [onFocus, setOnFocus] = useState()

    const backGroundStatus = () => {
        if (value.length > 0 && onFocus) {
            return "white"
        } else if (onFocus) {
            return "white"
        } else if (value.length > 0 && !onFocus) {
            return "#E1DCFF"
        } else {
            return "white"
        }
    }

    return (
        <div
            className={
                textLabel ? styles.labelContainer : styles.inputContainer
            }
        >
            {textLabel && <div className={textStyles.m_16}>To</div>}
            <input
                value={value}
                onChange={(e) => onChange(e)}
                placeholder={placeholder}
                className={styles.textInput}
                onFocus={() => setOnFocus(true)}
                onBlur={() => setOnFocus(false)}
                disabled={disabled}
                style={{
                    width: width,
                    height: multi ? multi : null,
                    background: backGroundStatus(),
                }}
            />
        </div>
    )
}

export default InputText

import { Typography } from "antd"
import React, { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { useSelector } from "react-redux"
import Select from "react-select"

import textStyles from "../../../commonStyles/textType/styles.module.css"
import { convertTokentoUsd } from "../../../utils/conversion"
// import InputText from "../InputComponent/Input";
import styles from "./styles.module.css"

export const TokenInput = ({
    dark,
    onChange,
    updateTokenType,
    hideDropDown,
}) => {
    const token_available = useSelector((x) => x.dao.balance)
    const [amount, setAmount] = useState()

    const [onFocus, setOnFocus] = useState(false)
    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)
    const [token_symbol, setToken_symbol] = useState(ETHprice)
    const onChangeAmount = (e) => {
        onChange(e)
        setAmount(e.target.value)
    }
    const darkColourStyles = {
        control: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? "#B1A6FF" : "#ECFFB8",
                width: "100%",
                height: "3rem",
                margin: 0,
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderRight: isFocused ? 0 : "1px solid #A1AE7E",
                paddingRight: "1.25rem",
                outline: "none",
                borderLeft: "none",
                borderTop: "none",
                borderBottom: "none",
            }
        },
        option: (styles, _state) => {
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1rem",
            }
        },
        indicatorSeparator: (styles, _state) => ({
            ...styles,
            height: 0,
            width: 0,
        }),
        dropdownIndicator: (styles, _state) => ({ ...styles, color: "black" }),
        menu: (styles) => ({
            ...styles,
            width: "100%",
            backgroundColor: "#585858",
        }),
        input: (styles, { isFocused }) => {
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                height: "100%",
                outline: isFocused ? "none" : "none",
                border: 0,
            }
        },
        placeholder: (styles) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
        }),
        singleValue: (styles, _state) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            width: "100%",
        }),
    }

    const ligntColourStyles = {
        control: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: "white",
                width: "100%",
                height: "3rem",
                margin: 0,
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                border:
                    isFocused || onFocus
                        ? "1px solid #6852FF"
                        : "1px solid #EEEEF0",
                paddingRight: "1.25rem",
                outline: isFocused ? "none" : "none",
            }
        },
        option: (styles, _state) => {
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1rem",
            }
        },
        indicatorSeparator: (styles, _state) => ({
            ...styles,
            height: 0,
            width: 0,
        }),
        dropdownIndicator: (styles, _state) => ({ ...styles, color: "black" }),
        menu: (styles) => ({ ...styles, width: "100%" }),
        input: (styles, { isFocused }) => {
            return {
                ...styles,
                fontFamily: "TelegrafMedium",
                fontStyle: "normal",
                fontWeight: "normal",
                fontSize: "1rem",
                lineHeight: "1.5rem",
                height: "100%",
                outline: isFocused ? "none" : "none",
                border: 0,
            }
        },
        placeholder: (styles) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
        }),
        singleValue: (styles, _state) => ({
            ...styles,
            fontFamily: "TelegrafMedium",
            fontStyle: "normal",
            fontWeight: "normal",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            width: "100%",
        }),
    }

    const CustomDropDownIndicator = () =>
        hideDropDown && (
            <AiFillCaretDown
                style={{ alignSelf: "center" }}
                color="black"
                size={"1rem"}
            />
        )

    const dropDownSelect = async (x) => {
        updateTokenType(x)
        const amount = await convertTokentoUsd(x.label)
        setToken_symbol(amount)
    }

    return (
        <div className={styles.container}>
            <div className={styles.selectContainer}>
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    closeMenuOnSelect
                    isDisabled={token_available?.length === 1}
                    components={{ DropdownIndicator: CustomDropDownIndicator }}
                    onChange={(x) => dropDownSelect(x)}
                    styles={dark ? darkColourStyles : ligntColourStyles}
                    isSearchable={false}
                    name="color"
                    options={token_available}
                    defaultValue={{ label: "ETH", value: "ETH" }}
                    menuPosition="fixed"
                />
            </div>
            <div
                style={{
                    background: dark ? (onFocus ? "#D2E4A6" : null) : null,
                    border: dark
                        ? onFocus
                            ? 0
                            : 0
                        : onFocus
                        ? "1px #6852FF solid "
                        : "1px solid #EEEEF0",
                }}
                className={
                    dark ? styles.inputContainerDark : styles.inputContainer
                }
            >
                <input
                    onFocus={() => setOnFocus(true)}
                    onBlur={() => setOnFocus(false)}
                    placeholder="Enter Amount"
                    onChange={onChangeAmount}
                    className={
                        dark ? styles.amountInputDark : styles.amountInput
                    }
                />
                <Typography.Text
                    ellipsis={1}
                    style={{ width: "36%", color: "#818081" }}
                    className={`${textStyles.m_16}`}
                >
                    {amount &&
                        `$ ${(parseFloat(amount) * token_symbol).toFixed(2)}`}
                </Typography.Text>
            </div>
        </div>
    )
}

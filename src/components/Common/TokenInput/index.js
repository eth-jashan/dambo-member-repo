import React, { useState } from "react"
import { Select, Menu, Dropdown } from "antd"

import "./styles.scss"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { assets } from "../../../constant/assets"
import { useSelector } from "react-redux"
import { convertTokentoUsd } from "../../../utils/conversion"

const { Option } = Select

const TokenInput = ({ updateTokenType, tokenInput, onChange, payDetail }) => {
    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)
    const [tokenUsd, setTokenUsd] = useState(ETHprice)
    const [tokenSymbol, setTokenSymbol] = useState("ETH")
    const availableToken = useSelector((x) => x.dao.balance)
    const [input, setInput] = useState("0")

    const onInputChange = (e) => {
        onChange(e)
        setInput(e.target.value)
    }

    const tokenItem = []

    availableToken.forEach((element, index) => {
        tokenItem.push({
            label: <div className={textStyles.m_16}>{element.label}</div>,
            key: index,
        })
    })

    console.log(availableToken, tokenItem, payDetail)

    const onCoinChange = async (e, i) => {
        setTokenSymbol(availableToken[parseInt(e.key)].label)
        updateTokenType(availableToken[parseInt(e.key)])
        const amount = await convertTokentoUsd(
            availableToken[parseInt(e.key)].label
        )
        console.log(amount)
        setTokenUsd(amount)
    }

    const tokenMenu = () => (
        <Menu
            onClick={async (e, i) => await onCoinChange(e, i)}
            items={tokenItem}
        />
    )

    const getAvailAmount = () => {
        const tokenIfo = availableToken.filter((x) => x.label === tokenSymbol)
        console.log(tokenIfo)
        return (tokenIfo[0]?.value?.balance * 1) / 1000000000000000000
    }

    const tokenSelect = () => (
        <Dropdown overlay={tokenMenu}>
            <div className="token-select-container">
                <img className="down-icon" src={assets.icons.downWhite} />
                <div style={{ color: "white" }} className={textStyles.m_16}>
                    {tokenSymbol}
                </div>
            </div>
        </Dropdown>
    )

    const selectedTokenInfo = () => (
        <div className="token-info-container">
            <div>
                <div
                    style={{ color: "gray", textAlign: "start" }}
                    className={textStyles.m_14}
                >
                    Avl balance
                </div>
                <div
                    style={{ color: "white", textAlign: "start" }}
                    className={textStyles.m_14}
                >
                    {getAvailAmount()} {tokenSymbol}
                </div>
            </div>
            {tokenSelect()}
        </div>
    )

    const tokenValueInput = () => (
        <div className="token-info-container">
            <div>
                <div className="token-input-container">
                    <input
                        // value={tokenInput}
                        onChange={(e) => onInputChange(e)}
                        placeholder="0"
                        style={{ width: `${input.length}rem` }}
                        className="token-input"
                    />
                    <div
                        className={textStyles.m_16}
                        style={{ color: "#ECFFB8" }}
                    >
                        {tokenSymbol}
                    </div>
                </div>
                <div
                    style={{ color: "white", textAlign: "start" }}
                    className={textStyles.m_14}
                >
                    {`${(parseFloat(input) * tokenUsd).toFixed(2)}`} USD
                </div>
            </div>
        </div>
    )

    return (
        <div className="layout input-container">
            {selectedTokenInfo()}
            <div className="divider-token" />
            {tokenValueInput()}
        </div>
    )
}

export default TokenInput

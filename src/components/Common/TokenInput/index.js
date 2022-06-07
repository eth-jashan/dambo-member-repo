import React, { useState } from "react"
import { Menu, Dropdown } from "antd"

import "./styles.scss"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { assets } from "../../../constant/assets"
import { useSelector } from "react-redux"
import { convertTokentoUsd } from "../../../utils/conversion"

const TokenInput = ({ updateTokenType, tokenInput, onChange, payDetail }) => {
    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)
    const [tokenUsd, setTokenUsd] = useState(ETHprice)
    const [tokenSymbol, setTokenSymbol] = useState("ETH")
    const availableToken = useSelector((x) => x.dao.balance)
    const [input, setInput] = useState("0")

    const onInputChange = (e) => {
        const value = e.target.value
        if (!isNaN(+value)) {
            onChange(e)
            setInput(e.target.value)
        }
    }

    const tokenItem = []

    availableToken.forEach((element, index) => {
        tokenItem.push({
            label: <div className={textStyles.m_16}>{element.label}</div>,
            key: index,
        })
    })

    const onCoinChange = async (e, i) => {
        setTokenSymbol(availableToken[parseInt(e.key)].label)
        updateTokenType(availableToken[parseInt(e.key)])
        const amount = await convertTokentoUsd(
            availableToken[parseInt(e.key)].label
        )

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

        return (tokenIfo[0]?.value?.balance * 1) / 1000000000000000000
    }

    const tokenSelect = () => (
        <Dropdown overlay={tokenMenu}>
            <div className="token-select-container">
                <img className="down-icon" src={assets.icons.downWhite} />
                <div className="token-select-symbol">{tokenSymbol}</div>
            </div>
        </Dropdown>
    )

    const selectedTokenInfo = () => (
        <div className="token-info-container">
            <div>
                <div className="avl-balance-text">Avl balance</div>
                <div className="avl-balance-text">
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
                        value={input}
                        onChange={(e) => onInputChange(e)}
                        placeholder="0"
                        style={{
                            width: `${
                                input.length * 0.75 > 6
                                    ? 6
                                    : input.length * 0.75
                            }rem`,
                        }}
                        className="token-input"
                    />
                    <div className="token-symbol-text">{tokenSymbol}</div>
                </div>
                <div className="amount-conversion">
                    {input ? `${(parseFloat(input) * tokenUsd).toFixed(2)}` : 0}{" "}
                    USD
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

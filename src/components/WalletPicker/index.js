import React, { useEffect, useState } from "react"

import { useSelector } from "react-redux"

import chevronDown from "../../assets/Icons/chevron_down.svg"
import styles from "./style.module.css"
import textStyles from "./../../commonStyles/textType/styles.module.css"

import { ethers } from "ethers"

export default function WalletPicker({ signer }) {
    const address = useSelector((x) => x.auth.address)

    const [chainId, setChainId] = useState(false)

    const getNetwork = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const { chainId } = await provider.getNetwork()
        setChainId(chainId)
    }

    useEffect(async () => {
        await getNetwork()
    })

    return (
        <div className={styles.walletCnt}>
            {chainId === 4 && (
                <div className={`${textStyles.m_14} ${styles.testnet}`}>
                    Rinkeby testnet
                </div>
            )}
            <div className={styles.address}>
                {address?.slice(0, 5) + "....." + address?.slice(-3)}
            </div>
            <img alt="chevron_down" src={chevronDown} className={styles.icon} />
            {/* <div style={{ top: "20px" }}>
                
            </div> */}
        </div>
    )
}

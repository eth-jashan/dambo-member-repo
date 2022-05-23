import React, { useEffect, useState } from "react"
import WalletPicker from "../../components/WalletPicker"
import { useSelector } from "react-redux"
import styles from "./style.module.css"
import { ethers } from "ethers"
import ProfileModal from "../Modal/ProfileModal"

export default function Header({
    children,
    decreaseStep,
    signer,
    contributorWallet,
}) {
    const jwt = useSelector((x) => x.auth.jwt)
    const role = useSelector((x) => x.dao.role)
    const [chainId, setChainId] = useState(false)

    const getNetwork = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const { chainId } = await provider.getNetwork()
        setChainId(chainId)
    }

    useEffect(async () => {
        await getNetwork()
    })

    console.log(contributorWallet)

    return (
        <div
            align="middle"
            justify="center"
            style={{
                width: "100%",
            }}
        >
            <div className={styles.headerCnt}>
                {/* <ProfileModal /> */}
                {contributorWallet ? (
                    <div className={styles.header}>
                        <div className={styles.headerName}>Drepute | </div>
                        {chainId === 4 && role !== "ADMIN" && (
                            <div
                                style={{ color: "#FFB22E", marginLeft: "6px" }}
                                className={styles.headerName}
                            >
                                Rinkeby testnet
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.headerName}>Drepute</div>
                )}
                {jwt && (
                    <div>
                        <WalletPicker signer={signer} />
                    </div>
                )}
            </div>
        </div>
    )
}

import React, { useEffect, useState } from "react"
import { message } from "antd"
import { useSelector, useDispatch } from "react-redux"
import { setAdminStatus, signout } from "../../store/actions/auth-action"
import { useNavigate } from "react-router"
import chevronDown from "../../assets/Icons/chevron_down.svg"
import styles from "./style.module.css"
import textStyles from "./../../commonStyles/textType/styles.module.css"
import { getSelectedChainId } from "../../utils/POCPutils"
import { ethers } from "ethers"
// import chevron_right from "../../../assets/Icons/chevron_right.svg"
// import email from "../../../assets/Icons/email_black.svg"

export default function WalletPicker({ signer }) {
    const address = useSelector((x) => x.auth.address)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentChainId = getSelectedChainId()?.chainId
    async function copyTextToClipboard() {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(address)
        } else {
            return document.execCommand("copy", true, address)
        }
    }
    const onClick = ({ key }) => {
        if (key === "1") {
            message.info(`address copied on clicpboard`)
            copyTextToClipboard()
        } else if (key === "2") {
            if (isAdmin) {
                dispatch(signout())
                navigate("/")
            } else {
                dispatch(signout())
                dispatch(setAdminStatus(false))
                navigate("/")
            }
        }
    }
    const onDisconnect = () => {
        dispatch(signout())
        navigate("/")
    }

    // const walletMenu = (
    //     <Menu style={{ borderRadius: "8px" }}>
    //         <div
    //             className={styles.disconnectDiv}
    //             style={{ marginTop: "1.5rem" }}
    //         >
    //             <div className={styles.addrContainer}>
    //                 <div className={styles.dot} />
    //                 <div>
    //                     <div className={textStyles.m_14}>
    //                         {`${address.slice(0, 5)}...${address.slice(-3)}`}
    //                     </div>
    //                     <div
    //                         onClick={() => onDisconnect()}
    //                         className={`${textStyles.m_14} ${styles.disconnect}`}
    //                     >
    //                         {currentChainId === 4
    //                             ? "Rinkeby Testnet"
    //                             : "Ethereum"}
    //                     </div>
    //                 </div>
    //             </div>
    //             <div>
    //                 <img
    //                     onClick={async () => await copyTextToClipboard()}
    //                     src={open_link}
    //                     className={styles.copy}
    //                     style={{ marginRight: "12px" }}
    //                     alt="cross"
    //                 />
    //                 <img
    //                     onClick={async () => await copyTextToClipboard()}
    //                     src={copy_black}
    //                     className={styles.copy}
    //                     alt="cross"
    //                 />
    //             </div>
    //         </div>
    //         {/* <Menu.Item key="1">
    //             <a
    //                 style={{
    //                     color: "black",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Copy wallet address
    //             </a>
    //         </Menu.Item>
    //         <div
    //             style={{
    //                 width: "100%",
    //                 height: 0,
    //                 border: "0.5px solid #EEEEF0",
    //             }}
    //         />
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item>
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item>
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item>
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item>
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item>
    //         <Menu.Item key="2">
    //             <a
    //                 style={{
    //                     color: "#FF0000",
    //                     textDecorationLine: "underline",
    //                     fontFamily: "TelegrafMedium",
    //                     fontWeight: "500",
    //                 }}
    //             >
    //                 Disconnect
    //             </a>
    //         </Menu.Item> */}
    //     </Menu>
    // )

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
        </div>
    )
}

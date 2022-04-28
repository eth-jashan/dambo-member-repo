import React from "react"
import { Menu, message, Dropdown } from "antd"
import { useSelector, useDispatch } from "react-redux"
import { setAdminStatus, signout } from "../../store/actions/auth-action"
import { useNavigate } from "react-router"
import chevronDown from "../../assets/Icons/chevron_down.svg"
import styles from "./style.module.css"
import { useLookupAddress } from "../../hooks"

export default function WalletPicker({ signer }) {
    const address = useSelector((x) => x.auth.address)
    // const { ensName } = useLookupAddress(signer, address)
    // //console.log('ens nmae', en)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const dispatch = useDispatch()
    const navigate = useNavigate()
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

    const walletMenu = (
        <Menu style={{ borderRadius: "8px" }} onClick={onClick}>
            <Menu.Item key="1">
                <a
                    style={{
                        color: "black",
                        textDecorationLine: "underline",
                        fontFamily: "TelegrafMedium",
                        fontWeight: "500",
                    }}
                >
                    Copy wallet address
                </a>
            </Menu.Item>
            <div
                style={{
                    width: "100%",
                    height: 0,
                    border: "0.5px solid #EEEEF0",
                }}
            />
            <Menu.Item key="2">
                <a
                    style={{
                        color: "#FF0000",
                        textDecorationLine: "underline",
                        fontFamily: "TelegrafMedium",
                        fontWeight: "500",
                    }}
                >
                    Disconnect
                </a>
            </Menu.Item>
            {/* <Menu.Item key="3">3rd menu item</Menu.Item> */}
        </Menu>
    )

    return (
        <Dropdown overlay={walletMenu}>
            <div className={styles.walletCnt}>
                <div className={styles.address}>
                    ETH . {address?.slice(0, 5) + "....." + address?.slice(-3)}
                </div>
                <img
                    alt="chevron_down"
                    src={chevronDown}
                    className={styles.icon}
                />
            </div>
        </Dropdown>
    )
}

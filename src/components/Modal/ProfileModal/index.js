import React from "react"
import styles from "./style.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import copy_black from "../../../assets/Icons/copy_black.svg"
import open_link from "../../../assets/Icons/open_in_new.svg"
import chevron_right from "../../../assets/Icons/chevron_right.svg"
import email from "../../../assets/Icons/email_black.svg"
import setting from "../../../assets/Icons/settings_black.svg"
import disconnect from "../../../assets/Icons/signal_disconnected.svg"
import { useDispatch, useSelector } from "react-redux"
import { signout } from "../../../store/actions/auth-action"
import { message } from "antd"
import { useNavigate } from "react-router"
import { getSelectedChainId } from "../../../utils/POCPutils"

const ProfileModal = ({ isOnboard = false, onActionComplete = () => {} }) => {
    const address = useSelector((x) => x.auth.address)
    const dispatch = useDispatch()

    async function copyTextToClipboard() {
        if ("clipboard" in navigator) {
            message.success("Address coppied")
            onActionComplete()
            return await navigator.clipboard.writeText(address)
        } else {
            return document.execCommand("copy", true, address)
        }
    }

    const navigate = useNavigate()

    const onDisconnect = () => {
        onActionComplete()
        dispatch(signout())
        navigate("/")
    }

    const currentChainId = getSelectedChainId().chainId

    return (
        <div className={styles.modal}>
            <div
                className={styles.disconnectDiv}
                style={{ marginTop: "1.5rem" }}
            >
                <div className={styles.addrContainer}>
                    <div className={styles.dot} />
                    <div>
                        <div className={textStyles.m_14}>
                            {`${address?.slice(0, 5)}...${address?.slice(-3)}`}
                        </div>
                        <div
                            onClick={() => onDisconnect()}
                            className={`${textStyles.m_14} ${styles.disconnect}`}
                        >
                            {currentChainId === 4
                                ? "Rinkeby Testnet"
                                : "Ethereum"}
                        </div>
                    </div>
                </div>
                <div>
                    <img
                        onClick={async () => await copyTextToClipboard()}
                        src={open_link}
                        className={styles.copy}
                        style={{ marginRight: "12px" }}
                        alt="cross"
                    />
                    <img
                        onClick={async () => await copyTextToClipboard()}
                        src={copy_black}
                        className={styles.copy}
                        alt="cross"
                    />
                </div>
            </div>

            <div className={styles.divider} />

            {!isOnboard && (
                <div className={styles.singleOption}>
                    <div>
                        <img
                            src={setting}
                            alt="setting"
                            className={styles.icon}
                        />
                        <div className={textStyles.m_16}>Settings</div>
                    </div>
                    <img
                        src={chevron_right}
                        alt="chevro_right"
                        className={styles.chevron}
                    />
                </div>
            )}

            {!isOnboard && (
                <div
                    style={{
                        marginTop: "4px",
                        width: "90%",
                        alignSelf: "center",
                    }}
                    className={styles.divider}
                />
            )}

            <div className={styles.singleOption}>
                <div>
                    <img src={email} alt="email" className={styles.icon} />
                    <div className={textStyles.m_16}>Contact Us</div>
                </div>
                <img
                    src={chevron_right}
                    alt="chevro_right"
                    className={styles.chevron}
                />
            </div>

            <div onClick={() => onDisconnect()} className={styles.singleOption}>
                <div>
                    <img src={disconnect} alt="email" className={styles.icon} />
                    <div
                        className={`${textStyles.m_16} ${styles.disconnectText}`}
                    >
                        Disconnect
                    </div>
                </div>
                <img
                    src={chevron_right}
                    alt="chevro_right"
                    className={styles.chevron}
                />
            </div>
        </div>
    )
}

export default ProfileModal

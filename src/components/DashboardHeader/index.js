import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { message } from "antd"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { getSelectedChainId } from "../../utils/POCPutils"
import {
    setPayment,
    setTransaction,
} from "../../store/actions/transaction-action"
import { setContributionDetail } from "../../store/actions/contibutor-action"
import AccountSwitchModal from "../../components/Modal/AccountSwitchModal"
import { AiFillCaretDown } from "react-icons/ai"
import TestnetInfo from "../../components/ToolTip/TestnetInfo"
import ProfileModal from "../../components/Modal/ProfileModal"

const DashboardHeader = ({
    currentPage,
    setCurrentPage,
    modalBackdrop,
    route,
    setShowSettings,
}) => {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const role = useSelector((x) => x.dao.role)
    const address = useSelector((x) => x.auth.address)
    const account_mode = useSelector((x) => x.dao.account_mode)

    const [safeInfoHover, setSafeInfoHover] = useState(false)
    const [onTestnetHover, setTestnetHover] = useState(false)
    const [roleContainerHover, setRoleContainerHover] = useState(false)
    const [profile_modal, setProfileModal] = useState(false)
    const [switchRoleModal, setSwitchRoleModal] = useState(false)

    const currentChainId = getSelectedChainId()?.chainId
    const dispatch = useDispatch()

    const currentUser = useSelector((x) => x.dao.username)

    async function copyTextToClipboard(textToCopy) {
        if ("clipboard" in navigator) {
            message.success("Copied Successfully")
            return await navigator.clipboard.writeText(textToCopy)
        } else {
            return document.execCommand("copy", true, address)
        }
    }

    const onProfileModal = () => {
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
        setProfileModal(!profile_modal)
        setSwitchRoleModal(false)
    }

    const onSwitchRoleModal = () => {
        setProfileModal(false)
        modalBackdrop(!switchRoleModal)
        setSwitchRoleModal(!switchRoleModal)
    }

    const accountSwitchPress = () => {
        setCurrentPage("request")
        setShowSettings(false)
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
        setSwitchRoleModal(false)
    }

    const getInitialForAccount = () => {
        if (currentUser) {
            const nameArray = currentUser.split(" ")
            if (nameArray?.length > 1) {
                return {
                    first: nameArray[0].charAt(0)?.toUpperCase(),

                    last: nameArray[1].charAt(0)?.toUpperCase(),
                }
            } else {
                return {
                    first: nameArray
                        ? nameArray[0]?.charAt(0)?.toUpperCase()
                        : "",
                    last: "",
                }
            }
        }
    }

    const onBackDropPress = () => {
        setSwitchRoleModal(false)
        setProfileModal(false)
    }

    return (
        <div className="dashboard-header-container">
            {(switchRoleModal || profile_modal) && (
                <div onClick={() => onBackDropPress()} className="backdrop" />
            )}
            <div>
                <div className={`${textStyles.ub_14} dao-name`}>
                    {currentDao?.name}
                </div>
                {/* <div
                    className="safeContainer"
                    onMouseLeave={() => setSafeInfoHover(false)}
                    onMouseEnter={() => setSafeInfoHover(true)}
                >
                    <div className="safe_addr">
                        {currentDao?.safe_public_address?.slice(0, 5)}...
                        {currentDao?.safe_public_address?.slice(-4)}
                    </div>
                    {safeInfoHover && (
                        <div className="safeContainer">
                            <div
                                onClick={async () =>
                                    await copyTextToClipboard(
                                        currentDao?.safe_public_address
                                    )
                                }
                                className="safeCopy"
                            >
                                copy link
                            </div>
                            <div className="dot">•</div>
                            <div className="safeCopy">etherscan</div>
                        </div>
                    )}
                </div> */}
            </div>
            {role === "ADMIN" && (
                <div className="routeLinks">
                    <div
                        className={
                            currentPage === "request" ? "activePageLink" : ""
                        }
                        onClick={() => {
                            setCurrentPage("request")
                            setShowSettings(false)
                        }}
                    >
                        Request
                    </div>
                    {/* <div
                        className={
                            currentPage === "treasury" ? "activePageLink" : ""
                        }
                        onClick={() => {
                            setCurrentPage("treasury")
                            setShowSettings(false)
                        }}
                    >
                        Treasury
                    </div> */}
                    {/* <div
                        className={
                            currentPage === "badges" ? "activePageLink" : ""
                        }
                        onClick={() => {
                            setCurrentPage("badges")
                            setShowSettings(false)
                        }}
                    >
                        Badges
                    </div> */}
                </div>
            )}
            <div className="profileContainer">
                {currentChainId === 4 ? (
                    <div
                        onMouseLeave={() => setTestnetHover(false)}
                        onMouseEnter={() => setTestnetHover(true)}
                        className="testnet-wrapper"
                    >
                        <div className="testnetText">Rinkeby testnet</div>
                        {onTestnetHover && <TestnetInfo />}
                    </div>
                ) : null}

                <div>
                    {account_mode === "ADMIN" && (
                        <div
                            onMouseEnter={() => setRoleContainerHover(true)}
                            onMouseLeave={() => setRoleContainerHover(false)}
                            onClick={() => onSwitchRoleModal()}
                            style={{
                                background:
                                    switchRoleModal || roleContainerHover
                                        ? "white"
                                        : "#1f1f1f",
                            }}
                            className="roleSwitchContainer"
                        >
                            <div
                                style={{
                                    color:
                                        switchRoleModal || roleContainerHover
                                            ? "black"
                                            : "white",
                                }}
                                className={textStyles.m_14}
                            >
                                {role === "ADMIN" ? "Approval" : "Contributor"}
                            </div>
                            {
                                <AiFillCaretDown
                                    color={
                                        switchRoleModal || roleContainerHover
                                            ? "black"
                                            : "white"
                                    }
                                    className="dropdown-icon"
                                    size={12}
                                />
                            }
                        </div>
                    )}
                    {switchRoleModal && (
                        <AccountSwitchModal
                            route={route}
                            onChange={() => accountSwitchPress()}
                        />
                    )}
                </div>
                <div>
                    <div
                        onClick={() => onProfileModal()}
                        className="accountIcon"
                    >
                        <div
                            className={`${textStyles.m_14} ${textStyles.m_14} initialText`}
                        >
                            {getInitialForAccount()?.first}
                        </div>
                        <div
                            className={`${textStyles.m_14} ${textStyles.m_14} initialText`}
                        >
                            {getInitialForAccount()?.last}
                        </div>
                    </div>
                    {profile_modal && (
                        <ProfileModal
                            setShowSettings={setShowSettings}
                            onActionComplete={onBackDropPress}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader

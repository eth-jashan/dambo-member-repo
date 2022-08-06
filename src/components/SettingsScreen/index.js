import React, { useState, useRef, useEffect } from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import { Switch, message, Spin } from "antd"
import CheckSvg from "../../assets/Icons/check.svg"
import { LoadingOutlined } from "@ant-design/icons"
import {
    updateDaoInfo,
    updateUserInfo,
    toggleBot,
    getAllDaowithAddress,
} from "../../store/actions/dao-action"
import { links } from "../../constant/links"
import { useNetwork } from "wagmi"

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
)

export default function SettingsScreen() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    // const currentChainId = getSelectedChainId().chainId
    const address = useSelector((x) => x.auth.address)
    const [showDaoNameEdit, setShowDaoNameEdit] = useState(false)
    const [showUserNameEdit, setShowUserNameEdit] = useState(false)
    const [daoName, setDaoName] = useState("")
    const [userName, setUserName] = useState("")
    const [activeSetting, setActiveSetting] = useState("dao")
    const [updatingDaoName, setUpdatingDaoName] = useState(false)
    const [updatingUserName, setUpdatingUserName] = useState(false)
    const [botStatus, setBotStatus] = useState(currentDao?.discord_bot_active)
    const [botStatusLoading, setBotStatusLoading] = useState(false)
    const settingsRef = useRef(null)
    const daoNameInputRef = useRef(null)
    const userNameInputRef = useRef(null)
    const { chain } = useNetwork()

    const dispatch = useDispatch()

    const currentUser = currentDao?.signers?.filter(
        (x) => x.public_address === address
    )

    useEffect(() => {
        setBotStatus(currentDao?.discord_bot_active)
    }, [currentDao?.discord_bot_active])

    const handleScroll = () => {
        if (settingsRef.current.scrollTop > 200) {
            setActiveSetting(() => "discord")
        } else {
            setActiveSetting(() => "dao")
        }
    }

    const copyText = async (textToCopy) => {
        if ("clipboard" in navigator) {
            await navigator.clipboard.writeText(textToCopy)
            message.success("Copied Successfully")
        } else {
            return document.execCommand("copy", true, textToCopy)
        }
    }
    const openTreasuryOnEtherscan = () => {
        const link = `https://${
            chain?.id === 4 ? "rinkeby." : ""
        }etherscan.io/address/${currentDao?.safe_public_address}`
        window.open(link)
    }

    const onChange = async (checked) => {
        setBotStatus(checked)
        setBotStatusLoading(true)
        const success = await dispatch(toggleBot())
        if (!success) {
            setBotStatus(!checked)
            message.error("Something went wrong please try again later")
        }
        setBotStatusLoading(false)
    }

    const discordCommands = [
        {
            name: "/add-contribution",
            description: "Add a contribution request",
        },
        {
            name: "/register",
            description: "Register a new DAO",
        },
        {
            name: "/verify",
            description: "Verify your discord ID and map it to DAO",
        },
    ]

    const updateDaoName = async () => {
        setUpdatingDaoName(true)
        await dispatch(
            updateDaoInfo({
                dao_uuid: currentDao?.uuid,
                dao_name: daoName,
            })
        )
        setShowDaoNameEdit(false)
        setUpdatingDaoName(false)
    }

    const updateUserName = async () => {
        setUpdatingUserName(true)
        // TODO: dispatch API call to update DAO Name
        await dispatch(updateUserInfo(userName, currentDao?.uuid))
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = await provider.getSigner()
        // const chainId = await signer.getChainId()
        const chainId = chain?.id

        dispatch(getAllDaowithAddress(chainId))
        setShowUserNameEdit(false)
        setUpdatingUserName(false)
    }

    const openDiscordBot = () => {
        localStorage.setItem("discord_bot_dao_uuid", currentDao.uuid)
        window.open(links.discord_add_bot, "_self")
    }

    const copyCommandsList = () => {
        const commands = discordCommands.map((command) => {
            return command.name + "\n" + command.description
        })
        copyText(commands.join("\n\n"))
    }

    const handleDaoNameEdit = () => {
        setDaoName(currentDao?.name)
        setShowDaoNameEdit(true)
    }

    const handleUserNameEdit = () => {
        setUserName(currentUser?.[0]?.metadata?.name)
        setShowUserNameEdit(true)
    }

    useEffect(() => {
        if (showDaoNameEdit) {
            daoNameInputRef.current.focus()
        }
    }, [showDaoNameEdit])

    useEffect(() => {
        if (showUserNameEdit) {
            userNameInputRef.current.focus()
        }
    }, [showUserNameEdit])

    return (
        <div className="settings-screen-container">
            <div
                className="settings-temp"
                ref={settingsRef}
                onScroll={handleScroll}
            >
                <div className="settings-main-wrapper">
                    <div className="settings-sticky-header">
                        <div className="title">Settings</div>
                        <div className="navbar">
                            <div
                                className={`nav-item ${
                                    activeSetting === "dao" && "active-nav-item"
                                }`}
                            >
                                Basic Details
                            </div>
                            {/* <div
                                className={`nav-item ${
                                    activeSetting === "discord" &&
                                    "active-nav-item"
                                }`}
                            >
                                Discord Bot
                            </div> */}
                        </div>
                    </div>
                    <div className="settings-item">
                        <div className="safe-details">
                            <div className="safe-name-and-avatar-wrapper">
                                <div className="safe-avatar">
                                    {currentDao?.logo_url ? (
                                        <img
                                            src={currentDao?.logo_url}
                                            alt="logo"
                                        />
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                                <div className="safe-name-and-address">
                                    <div className="safe-name">
                                        {currentDao?.name}
                                    </div>
                                    <div className="safe-address">
                                        eth:
                                        {currentDao?.safe_public_address?.slice(
                                            0,
                                            5
                                        )}
                                        ...
                                        {currentDao?.safe_public_address?.slice(
                                            -4
                                        )}
                                    </div>
                                    <div className="safe-links">
                                        <div
                                            className="link"
                                            onClick={() =>
                                                copyText(
                                                    currentDao?.safe_public_address
                                                )
                                            }
                                        >
                                            Copy address
                                        </div>
                                        <div className="separator">•</div>
                                        <div
                                            className="link"
                                            onClick={openTreasuryOnEtherscan}
                                        >
                                            View on etherscan
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="setting-row border-bottom">
                            <div className="row-heading">
                                What should we call your DAO
                            </div>
                            {showDaoNameEdit ? (
                                <div className="edit-input">
                                    <input
                                        type="text"
                                        value={daoName}
                                        onChange={(e) =>
                                            setDaoName(e.target.value)
                                        }
                                        ref={daoNameInputRef}
                                    />
                                    <div
                                        className="confirm-btn"
                                        onClick={updateDaoName}
                                    >
                                        {updatingDaoName ? (
                                            <Spin indicator={antIcon} />
                                        ) : (
                                            <img src={CheckSvg} alt="tick" />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="row-content">
                                    <div>{currentDao?.name}</div>
                                    <div
                                        className="action-button"
                                        onClick={handleDaoNameEdit}
                                    >
                                        Edit
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="setting-row border-bottom">
                            <div className="row-heading">Your Name</div>
                            {showUserNameEdit ? (
                                <div className="edit-input">
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) =>
                                            setUserName(e.target.value)
                                        }
                                        ref={userNameInputRef}
                                    />
                                    <div
                                        className="confirm-btn"
                                        onClick={updateUserName}
                                    >
                                        {updatingUserName ? (
                                            <Spin indicator={antIcon} />
                                        ) : (
                                            <img src={CheckSvg} alt="tick" />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="row-content">
                                    <div>
                                        {currentUser?.[0]?.metadata?.name}
                                    </div>
                                    <div
                                        className="action-button"
                                        onClick={handleUserNameEdit}
                                    >
                                        Edit
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="setting-row">
                            <div className="row-heading">Your Address</div>
                            <div className="row-content">
                                <div>{address}</div>
                                <div
                                    className="action-button"
                                    onClick={() => copyText(address)}
                                >
                                    Copy
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="settings-item">
                        {currentDao?.guild_id ? (
                            <>
                                <div className="discord-switch-row">
                                    <Switch
                                        checked={botStatus}
                                        onChange={onChange}
                                        loading={botStatusLoading}
                                    />
                                    Discord Bot
                                </div>
                                <div className="discord-info">
                                    <div className="avatar">
                                        {currentDao?.guild_icon_url ? (
                                            <img
                                                src={currentDao?.guild_icon_url}
                                                alt="logo"
                                            />
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    <div className="discord-info-content">
                                        <div className="discord-server-name">
                                            {currentDao?.guild_name ||
                                                currentDao?.name}
                                        </div>
                                        <div className="discord-link-row">
                                            <div className="discord-link">
                                                https://discord.gg/EymcnsFJ
                                            </div>
                                            <div
                                                className="action-button"
                                                onClick={openDiscordBot}
                                            >
                                                Change Discord Server
                                            </div>
                                        </div>
                                        <div className="discord-commands-container">
                                            <div className="discord-commands-wrapper">
                                                {discordCommands.map(
                                                    (command, index) => (
                                                        <div
                                                            className="discord-command-row"
                                                            key={index}
                                                        >
                                                            <div className="discord-command-name">
                                                                {command.name}
                                                            </div>
                                                            <div className="discord-command-description">
                                                                {
                                                                    command.description
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div
                                                className="discord-copy-commands"
                                                onClick={copyCommandsList}
                                            >
                                                Copy entire command list
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                onClick={() => openDiscordBot()}
                                className="enable-discord-btn"
                            >
                                Enable Discord bot
                            </div>
                        )}
                    </div> */}
                </div>
            </div>
        </div>
    )
}

import React, { useCallback, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
    authWithSign,
    getJwt,
    setAddress,
    setAdminStatus,
    setLoggedIn,
    signout,
} from "../../store/actions/auth-action"
import "./styles.scss"
import { message } from "antd"
import { useNavigate } from "react-router"
import { getAddressMembership } from "../../store/actions/gnosis-action"
import { getRole } from "../../store/actions/contibutor-action"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { setChainInfoAction } from "../../utils/wagmiHelpers"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
    useAccount,
    useSigner,
    useDisconnect,
    useNetwork,
    useSwitchNetwork,
} from "wagmi"
import account_balance_wallet from "../../assets/Icons/account_balance_wallet.svg"
import right_arrow_white from "../../assets/Icons/right_arrow_white.svg"
import metamask_circular from "../../assets/Icons/metamask_circular.svg"
import coinbase_circular from "../../assets/Icons/coinbase_circular.svg"
import rainbow_circular from "../../assets/Icons/rainbow_circular.svg"
import { links } from "../../constant/links"

const ConnectWallet = ({ isAdmin, afterConnectWalletCallback }) => {
    const jwt = useSelector((x) => x.auth.jwt)
    const uuid = useSelector((x) => x.contributor.invite_code)
    const [auth, setAuth] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { address, isConnected, status } = useAccount()
    const { data: signer } = useSigner()
    const [showConnectBtn, setShowConnectBtn] = useState(true)
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()
    const { chains, error, isLoading, pendingChainId, switchNetwork } =
        useSwitchNetwork()

    const authWithWallet = useCallback(
        async (address, chainId, signer) => {
            setAuth(true)
            if (
                chainId === 4 ||
                chainId === 1 ||
                chainId === 5 ||
                chainId === 10 ||
                chainId === 137
            ) {
                try {
                    const res = await dispatch(
                        authWithSign(address, signer, chainId)
                    )
                    if (res) {
                        if (!isAdmin) {
                            const res = await dispatch(getRole(uuid))
                            if (res) {
                                message.success("Already a member")
                                dispatch(setAdminStatus(true))
                                const isMember = await dispatch(
                                    getAddressMembership(chainId)
                                )
                                if (isMember) {
                                    setAuth(false)
                                    navigate(`/dashboard`)
                                } else {
                                    setAuth(false)
                                }
                            } else {
                                navigate(`/onboard/contributor/${uuid}`, {
                                    state: {
                                        discordUserId: "userId",
                                    },
                                })
                            }
                        } else {
                            await afterConnectWalletCallback(setAuth)
                        }
                    } else {
                        message.error("Check metamask popup!")
                    }
                } catch (error) {
                    console.error(error)
                    setAuth(false)
                }
            } else {
                try {
                    message.error(
                        "You are in a wrong chain, We are live in rinkeby and mainnet"
                    )
                    setAuth(false)
                } catch (error) {
                    setAuth(false)
                }
            }
            setAuth(false)
        },
        [dispatch, isAdmin, navigate, uuid]
    )

    const checkIsAdminInvite = useCallback(() => {
        if (!uuid && !isAdmin) {
            dispatch(signout())
        }
    }, [])

    useEffect(() => {
        checkIsAdminInvite()
    }, [checkIsAdminInvite])

    const onDiscordAuth = () => {
        // dispatch(setDiscordOAuth(address, uuid, jwt))
        window.location.replace(`${links.discord_oauth}`)
    }

    const loadWeb3Modal = useCallback(async () => {
        setAuth(true)
        try {
            const chainId = await signer.getChainId()
            const newAddress = await signer.getAddress()
            // dispatch(setAddress(newAddress))

            // check jwt validity
            const res = await dispatch(getJwt(newAddress, jwt))
            console.log("response of getJwt ", res, chainId)
            if (
                res &&
                (chainId === 4 ||
                    chainId === 1 ||
                    chainId === 5 ||
                    chainId === 10 ||
                    chainId === 137)
            ) {
                // has token and chain is selected for rinkeby
                setChainInfoAction(chainId)
                dispatch(setLoggedIn(true))
                if (isAdmin) {
                    // checks whether has dao membership or not
                    const res = await dispatch(getAddressMembership(chainId))
                    if (res) {
                        setAuth(false)
                        navigate(`/dashboard`)
                    } else {
                        setAuth(false)
                        navigate("/onboard/dao")
                    }
                } else {
                    // setAuth(false)
                    if (!isAdmin) {
                        try {
                            const res = await dispatch(getRole(uuid))
                            if (res) {
                                message.success("Already a member")
                                dispatch(setAdminStatus(true))
                                const isMember = await dispatch(
                                    getAddressMembership(chainId)
                                )
                                if (isMember) {
                                    setAuth(false)
                                    navigate(`/dashboard`)
                                } else {
                                    setAuth(false)
                                    // navigate("/onboard/dao")
                                }
                                // navigate(`/dashboard`)
                            } else {
                                // console.log("hereeee", uuid)
                                navigate(`/onboard/contributor/${uuid}`, {
                                    state: {
                                        discordUserId: "userId",
                                    },
                                })
                            }
                        } catch (error) {
                            message.error("Error on getting role")
                        }
                    }
                }
            } else if (
                !res &&
                (chainId === 4 ||
                    chainId === 1 ||
                    chainId === 5 ||
                    chainId === 137 ||
                    chainId === 10)
            ) {
                // if (!isAdmin) {
                //     await authWithWallet(newAddress, chainId, signer)
                // } else {
                // doesn't have valid token and chain is selected one
                console.log("in else if")
                setAuth(false)
                dispatch(setLoggedIn(false))
                await authWithWallet(newAddress, chainId, signer)
                // }
            } else {
                // chain is wrong
                setAuth(false)
                dispatch(setLoggedIn(false))
                message.error(
                    "You are in a wrong chain, We are live in rinkeby and mainnet"
                )
                // await chainSwitch(process.env.REACT_APP_ETHEREUM_CHAIN_ID)
            }
        } catch (error) {
            message.error("Please Check your metamask")
        }
    }, [authWithWallet, dispatch, isAdmin, navigate, uuid, signer])

    const authenticateWallet = async () => {
        const chainId = await signer.getChainId()
        dispatch(setAddress(address))
        await authWithWallet(address, chainId, signer)
    }

    // const checkIsAdminInvite = useCallback(() => {
    //     if (!uuid && !isAdmin) {
    //         dispatch(signout())
    //     }
    // }, [])

    useEffect(() => {
        checkIsAdminInvite()
    }, [checkIsAdminInvite])

    const authWallet = () => (
        <div className="walletCntAuth">
            <div className="rightContainer">
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        mounted,
                    }) => {
                        return (
                            <div
                                {...(!mounted && {
                                    "aria-hidden": true,
                                    style: {
                                        opacity: 0,
                                        pointerEvents: "none",
                                        userSelect: "none",
                                    },
                                })}
                            >
                                {(() => {
                                    if (!mounted || !account || !chain) {
                                        return (
                                            <button
                                                onClick={() => {
                                                    openConnectModal()
                                                    setShowConnectBtn(false)
                                                }}
                                                type="button"
                                                className="rainbow-connect-button"
                                            >
                                                <div className="wallet-images-wrapper">
                                                    <img
                                                        src={metamask_circular}
                                                        alt=""
                                                    />
                                                    <img
                                                        src={coinbase_circular}
                                                        alt=""
                                                    />
                                                    <img
                                                        src={rainbow_circular}
                                                        alt=""
                                                    />
                                                </div>
                                                Connect Wallet
                                                <img
                                                    src={right_arrow_white}
                                                    alt=""
                                                    className="right-arrow-img"
                                                />
                                            </button>
                                        )
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <button
                                                onClick={openChainModal}
                                                type="button"
                                            >
                                                Wrong network
                                            </button>
                                        )
                                    }

                                    return (
                                        <>
                                            <div className="connect-address-line">
                                                <div className="connect-address-left">
                                                    <div className="connect-address-name">
                                                        {account.displayName}{" "}
                                                    </div>
                                                    &bull;{" "}
                                                    <div className="connect-address-chain-name">
                                                        {chain.name} |{" "}
                                                        {account.displayBalance}
                                                    </div>
                                                    &bull;{" "}
                                                    <div
                                                        className="switch-chain-text"
                                                        onClick={openChainModal}
                                                    >
                                                        Switch chain
                                                    </div>
                                                </div>
                                                <div
                                                    className="connect-address-right"
                                                    onClick={disconnect}
                                                >
                                                    Disconnect
                                                </div>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>
                        )
                    }}
                </ConnectButton.Custom>

                {address && (
                    <div
                        onClick={
                            auth
                                ? () => {}
                                : async () => await authenticateWallet(address)
                        }
                        className="authBtn"
                    >
                        <div className="btnTextAuth">
                            <img
                                src={account_balance_wallet}
                                alt=""
                                className="wallet-img"
                            />
                            Sign Wallet
                            <img
                                src={right_arrow_white}
                                alt=""
                                className="right-arrow-img"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    useEffect(() => {
        if (status === "disconnected") {
            navigate("/")
        } else if (address && signer && isConnected && !showConnectBtn) {
            dispatch(setAddress(address))
            // loadWeb3Modal()
        }
    }, [signer])

    useEffect(() => {
        console.log("chain is", chain)
        if (chain) {
            window.localStorage.setItem(
                "chainId",
                JSON.stringify({ chainId: chain.id })
            )
        }
    }, [chain])

    return (
        <div className="connect-wallet-container">
            <div className="headingCnt">
                <div className={`heading ${textStyles.ub_53}`}>
                    welcome to rep3
                </div>
                <div className={`greyHeading ${textStyles.ub_53}`}>
                    Cozy corner for all your
                    <br /> communities
                </div>
            </div>
            {authWallet()}
        </div>
    )
}

export default ConnectWallet

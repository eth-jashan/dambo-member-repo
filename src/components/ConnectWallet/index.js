import React, { useCallback, useEffect, useState } from "react"
import { ethers } from "ethers"
import { useSelector, useDispatch } from "react-redux"
import {
    authWithSign,
    getJwt,
    setAddress,
    setAdminStatus,
    setLoggedIn,
    signout,
} from "../../store/actions/auth-action"
import styles from "./style.module.css"
import metamaskIcon from "../../assets/Icons/metamask.svg"
import { Divider, message } from "antd"
import { useNavigate } from "react-router"
import walletIcon from "../../assets/Icons/wallet.svg"
import tickIcon from "../../assets/Icons/tick.svg"
import { FaDiscord } from "react-icons/fa"
import { getAddressMembership } from "../../store/actions/gnosis-action"
import { getRole, setDiscordOAuth } from "../../store/actions/contibutor-action"
import chevron_right from "../../assets/Icons/chevron_right.svg"
import { links } from "../../constant/links"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { setChainInfoAction } from "../../utils/POCPutils"
// import { ConnectButton } from "@rainbow-me/rainbowkit"

const ConnectWallet = ({ isAdmin, afterConnectWalletCallback }) => {
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    // here jwt
    const uuid = useSelector((x) => x.contributor.invite_code)
    const [auth, setAuth] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const authWithWallet = useCallback(
        async (address, chainId, signer) => {
            setAuth(true)
            if (chainId === 4 || chainId === 1 || chainId === 5) {
                try {
                    const res = await dispatch(
                        authWithSign(address, signer, chainId)
                    )
                    if (res) {
                        if (!isAdmin) {
                            // console.log("contributor", uuid)
                            // navigate(`/onboard/contributor/${uuid}`, {
                            //     state: {
                            //         discordUserId: "userId",
                            //     },
                            // })
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
                                    message.error("Closed For Beta Test")
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
                    // await chainSwitch(process.env.REACT_APP_ETHEREUM_CHAIN_ID)
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
        dispatch(setDiscordOAuth(address, uuid, jwt))
        window.location.replace(`${links.discord_oauth.local}`)
    }

    const loadWeb3Modal = useCallback(async () => {
        console.log(isAdmin)
        setAuth(true)
        try {
            await window.ethereum.request({
                method: "eth_requestAccounts",
            })

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = await provider.getSigner()
            const chainId = await signer.getChainId()
            const newAddress = await signer.getAddress()
            dispatch(setAddress(newAddress))
            // check jwt validity
            const res = await dispatch(getJwt(newAddress, jwt))
            if (res && (chainId === 4 || chainId === 1 || chainId === 5)) {
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
                        message.error("Closed For Beta Test")
                        // navigate("/onboard/dao")
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
                                    message.error("Closed For Beta Test")
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
                (chainId === 4 || chainId === 1 || chainId === 5)
            ) {
                // if (!isAdmin) {
                //     await authWithWallet(newAddress, chainId, signer)
                // } else {
                // doesn't have valid token and chain is selected one
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
    }, [authWithWallet, dispatch, isAdmin, navigate, uuid])

    const connectWallet = () => (
        <div className={styles.walletCnt}>
            <div onClick={() => loadWeb3Modal()} className={styles.walletLogo}>
                <img
                    src={metamaskIcon}
                    alt="metamask"
                    className={styles.walletImg}
                />
                <div className={styles.walletName}>Metamask</div>
            </div>
            <img
                src={chevron_right}
                className={styles.chevronIcon}
                width="32px"
                height="32px"
                alt="cheveron-right"
            />
        </div>
    )

    const authenticateWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const chainId = await signer.getChainId()
        await authWithWallet(address, chainId, signer)
    }

    const authWallet = () => (
        <div className={styles.walletCntAuth}>
            <img src={metamaskIcon} alt="metamask" height={32} width={32} />

            <div className={styles.rightContainer}>
                <div className={styles.walletName}>Metamask</div>
                <div className={styles.addresCnt}>
                    <div className={styles.address}>{address}</div>
                    <div
                        onClick={() => dispatch(signout())}
                        className={styles.disconnectLink}
                    >
                        Disconnect
                    </div>
                </div>

                <Divider />
                <div
                    style={{ color: "black", paddingLeft: "1.25rem" }}
                    className={textStyles.m_23}
                >
                    Authenticate your wallet
                </div>
                <div
                    style={{ color: "#999999", paddingLeft: "1.25rem" }}
                    className={styles.authGreyHeading}
                >
                    This is required to login, create or
                    <br /> import your safes
                </div>

                <div
                    onClick={
                        auth
                            ? () => {}
                            : async () => await authenticateWallet(address)
                    }
                    className={styles.authBtn}
                >
                    <div className={styles.btnTextAuth}>
                        {auth ? "Authenticating...." : "Authenticate wallet"}
                    </div>
                </div>
            </div>
        </div>
    )

    // const disconnectContributor = () => {
    //     dispatch(signout())
    //     dispatch(setAdminStatus(false))
    // }
    //Cozy corner for all your communities

    const daoWallet = () => (
        <div style={{ width: "100%" }}>
            <div className={styles.headingCnt}>
                <div className={`${styles.heading} ${textStyles.ub_53}`}>
                    welcome to rep3
                </div>
                <div className={`${styles.greyHeading} ${textStyles.ub_53}`}>
                    Cozy corner for all your
                    <br /> communities
                </div>
            </div>
            {address ? authWallet() : connectWallet()}
        </div>
    )
    // const contributorWallet = () => (
    //     <div className={styles.walletContri}>
    //         <div className={styles.metaCard}>
    //             <div style={{ height: "100%" }}>
    //                 <div
    //                     style={{
    //                         height: "64px",
    //                         width: "64px",
    //                         borderRadius: "64px",
    //                         border: "1px solid #c2c2c2",
    //                         display: "flex",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                     }}
    //                 >
    //                     <img
    //                         src={!jwt ? walletIcon : tickIcon}
    //                         alt="wallet"
    //                         height={32}
    //                         width={32}
    //                     />
    //                 </div>
    //             </div>

    //             <div className={styles.rightContent}>
    //                 <div>
    //                     <div className={styles.walletHeading}>
    //                         {!jwt ? "Connect your Wallet" : "Wallet Connected"}
    //                     </div>
    //                     {!jwt ? (
    //                         <div className={styles.walletsubHeading}>
    //                             Lorem ipsum dolor sit amet,
    //                             <br />
    //                             consectetur adipiscing elit.
    //                         </div>
    //                     ) : (
    //                         <div className={styles.connectedText}>
    //                             {address?.slice(0, 5)}...{address?.slice(-3)}
    //                         </div>
    //                     )}
    //                 </div>
    //                 {!jwt && (
    //                     <div
    //                         onClick={() => loadWeb3Modal()}
    //                         className={styles.connectBtn}
    //                     >
    //                         <span className={styles.btnTitle}>
    //                             {auth ? "Conecting..." : "Connect Wallet"}
    //                         </span>
    //                     </div>
    //                 )}
    //                 {address && jwt && (
    //                     <div
    //                         onClick={() => disconnectContributor()}
    //                         className={styles.disconnectDiv}
    //                     >
    //                         <div className={styles.divider} />
    //                         <span className={styles.disconnectTitle}>
    //                             Disconnect Wallet
    //                         </span>
    //                     </div>
    //                 )}
    //             </div>
    //         </div>
    //         {/* inline style required */}
    //         <div className={styles.metaCard}>
    //             <div style={{ height: "100%" }}>
    //                 <div
    //                     style={{
    //                         height: "64px",
    //                         width: "64px",
    //                         borderRadius: "64px",
    //                         border: "1px solid #c2c2c2",
    //                         display: "flex",
    //                         alignItems: "center",
    //                         justifyContent: "center",
    //                     }}
    //                 >
    //                     <FaDiscord
    //                         size={32}
    //                         color={!jwt ? "#B3B3B3" : "#5865F2"}
    //                     />
    //                 </div>
    //             </div>

    //             <div className={styles.rightContentDown}>
    //                 <div>
    //                     <div
    //                         style={{ color: !jwt && "#B3B3B3" }}
    //                         className={styles.walletHeading}
    //                     >
    //                         Connect Discord
    //                     </div>
    //                     <div className={styles.walletsubHeading}>
    //                         We use Discord to check your name
    //                         <br />
    //                         and servers you've joined
    //                     </div>
    //                 </div>
    //                 <div
    //                     onClick={() => onDiscordAuth()}
    //                     className={
    //                         !jwt ? styles.connectBtnGrey : styles.connectBtn
    //                     }
    //                 >
    //                     <span className={styles.btnTitle}>Connect Discord</span>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // )

    return isAdmin ? daoWallet() : daoWallet()
    // return <ConnectButton />
}

export default ConnectWallet

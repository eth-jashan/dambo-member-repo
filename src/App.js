import React, { useEffect, useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Onboarding from "./pages/DaoOnboarding"
import Dashboard from "./pages/Dashboard/index"
import ContributorOnbording from "./pages/ContributorOnboarding"
import AuthWallet from "./pages/AuthWallet"
import "./App.scss"
import DiscordFallback from "./pages/DiscordFallback"
import ContributorSignupFallback from "./pages/ContributorSignupFallback"
import * as dayjs from "dayjs"
import * as relativeTimePlugin from "dayjs/plugin/relativeTime"
import { useDispatch, useSelector } from "react-redux"
import {
    setAdminStatus,
    setLoggedIn,
    signout,
    setAddress,
} from "./store/actions/auth-action"
import AppContext from "./appContext"
// import { getSelectedChainId } from "./utils/POCPutils"
import AddBotFallback from "./pages/AddBotFallback"
import MetamaskError from "./pages/MetamaskError"
import { useAccount } from "wagmi"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
    dayjs.extend(relativeTimePlugin)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const addressPersisted = useSelector((x) => x.auth.address)

    const [pocpAction, setPocpAction] = useState(false)
    const [chainId, setChainId] = useState(null)
    const [redirected, setRedirected] = useState(false)

    const setPocpActionValue = (status, chainId) => {
        setPocpAction(status)
        setChainId(chainId)
    }
    const { address } = useAccount({
        onConnect({ address: newAddress }) {
            dispatch(setAddress(newAddress))
        },
        onDisconnect() {
            console.log("setting address as null")
            dispatch(setAddress(null))
        },
    })
    // const provider = useProvider()

    // console.log(
    //     "in app",
    //     address,
    //     isConnecting,
    //     isDisconnected,
    //     isReconnecting,
    //     isConnected
    // )

    console.log("address persisited ", addressPersisted)

    // useEffect(() => {
    //     console.log("address changed", address, addressPersisted)
    //     if (addressPersisted) {
    //         if (isAdmin) {
    //             dispatch(setLoggedIn(false))
    //             dispatch(signout())
    //             navigate("/")
    //         } else {
    //             dispatch(setLoggedIn(false))
    //             dispatch(signout())
    //             dispatch(setAdminStatus(false))
    //             navigate("/")
    //         }
    //     }
    // }, [address, addressPersisted])

    if (window.location.hostname === "pony.rep3.gg" && !redirected) {
        if (window.location.pathname) {
            window.open(
                `https://app.rep3.gg${window.location.pathname}`,
                "_self"
            )
            setRedirected(true)
        }
    }

    const pocpActionSetup = {
        status: pocpAction,
        chainId,
        setPocpActionValue,
    }

    // console.log("provider wagmi", provider._isProvider, provider)
    // provider.on()

    // provider.on("accountsChanged", () => {
    //     console.log("account changed in provider")
    // })

    // if (window.ethereum) {
    //     window.ethereum.on("accountsChanged", () => {
    //         console.log("accounts changed")
    //         if (isAdmin) {
    //             dispatch(setLoggedIn(false))
    //             dispatch(signout())
    //             navigate("/")
    //         } else {
    //             dispatch(setLoggedIn(false))
    //             dispatch(signout())
    //             dispatch(setAdminStatus(false))
    //             navigate("/")
    //         }
    //     })

    //     window.ethereum.on("chainChanged", (x) => {
    //         const selectedChainId = getSelectedChainId()
    //         const maticNetwork = selectedChainId.chainId === 4 ? 80001 : 137
    //         if (
    //             parseInt(x) !== selectedChainId.chainId &&
    //             parseInt(x) !== maticNetwork
    //         ) {
    //             if (isAdmin) {
    //                 dispatch(setLoggedIn(false))
    //                 dispatch(signout())
    //                 navigate("/")
    //             } else {
    //                 dispatch(setLoggedIn(false))
    //                 dispatch(signout())
    //                 dispatch(setAdminStatus(false))
    //                 navigate("/")
    //             }
    //         }
    //     })
    // }

    useEffect(() => {
        if (!window.ethereum) {
            navigate("/metamask-error")
        }
    }, [])

    return (
        <ErrorBoundary>
            <AppContext.Provider value={pocpActionSetup}>
                <div className="App">
                    <div className="App-header">
                        <Routes>
                            <Route path="/" element={<AuthWallet />} />
                            <Route
                                path="/discord/fallback"
                                element={<DiscordFallback />}
                            />
                            <Route
                                path="/onboard/dao"
                                element={<Onboarding />}
                            />
                            <Route
                                path="onboard/contributor/:id"
                                element={<ContributorOnbording />}
                            />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route
                                path="contributor/invite/:name/:id"
                                element={<ContributorSignupFallback />}
                            />
                            <Route
                                path="/discord/add-bot-fallback"
                                element={<AddBotFallback />}
                            />
                            <Route
                                path="/metamask-error"
                                element={<MetamaskError />}
                            />
                        </Routes>
                    </div>
                </div>
            </AppContext.Provider>
        </ErrorBoundary>
    )
}

export default App

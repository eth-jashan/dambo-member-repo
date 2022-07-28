import React, { useState, useRef } from "react"
import { Routes, Route } from "react-router-dom"
import Onboarding from "./pages/DaoOnboarding"
import Dashboard from "./pages/Dashboard/index"
import ContributorOnbording from "./pages/ContributorOnboarding"
import AuthWallet from "./pages/AuthWallet"
import "./App.scss"
import DiscordFallback from "./pages/DiscordFallback"
import ContributorSignupFallback from "./pages/ContributorSignupFallback"
import * as dayjs from "dayjs"
import * as relativeTimePlugin from "dayjs/plugin/relativeTime"
import { useDispatch } from "react-redux"
import { signout } from "./store/actions/auth-action"
import AppContext from "./appContext"
import AddBotFallback from "./pages/AddBotFallback"
import MetamaskError from "./pages/MetamaskError"
import { useSigner } from "wagmi"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
    dayjs.extend(relativeTimePlugin)
    const dispatch = useDispatch()

    const [pocpAction, setPocpAction] = useState(false)
    const [chainId, setChainId] = useState(null)
    const [redirected, setRedirected] = useState(false)

    const setPocpActionValue = (status, chainId) => {
        setPocpAction(status)
        setChainId(chainId)
    }

    const { data: signer } = useSigner()
    const listenersSet = useRef(null)

    if (signer?.provider?.provider && !listenersSet.current) {
        console.log("setting listeners")
        signer.provider?.provider?.on("accountsChanged", () => {
            dispatch(signout())
            window.location.replace(window.location.origin)
        })
        signer.provider?.provider?.on("chainChanged", () => {
            dispatch(signout())
            window.location.replace(window.location.origin)
        })
        signer.provider?.provider?.on("disconnect", () => {
            dispatch(signout())
            window.location.replace(window.location.origin)
        })
        listenersSet.current = true
    }

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

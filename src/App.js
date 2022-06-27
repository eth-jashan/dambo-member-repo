import React, { useState } from "react"
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
} from "./store/actions/auth-action"
import AppContext from "./appContext"
import { getSelectedChainId } from "./utils/POCPutils"
import AddBotFallback from "./pages/AddBotFallback"

function App() {
    dayjs.extend(relativeTimePlugin)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [pocpAction, setPocpAction] = useState(false)
    const [chainId, setChainId] = useState(null)

    const setPocpActionValue = (status, chainId) => {
        setPocpAction(status)
        setChainId(chainId)
    }

    const pocpActionSetup = {
        status: pocpAction,
        chainId,
        setPocpActionValue,
    }

    window.ethereum.on("accountsChanged", () => {
        if (isAdmin) {
            dispatch(setLoggedIn(false))
            dispatch(signout())
            navigate("/")
        } else {
            dispatch(setLoggedIn(false))
            dispatch(signout())
            dispatch(setAdminStatus(false))
            navigate("/")
        }
    })

    window.ethereum.on("chainChanged", (x) => {
        const selectedChainId = getSelectedChainId()
        const maticNetwork = selectedChainId.chainId === 4 ? 80001 : 137
        if (
            parseInt(x) !== selectedChainId.chainId &&
            parseInt(x) !== maticNetwork
        ) {
            if (isAdmin) {
                dispatch(setLoggedIn(false))
                dispatch(signout())
                navigate("/")
            } else {
                dispatch(setLoggedIn(false))
                dispatch(signout())
                dispatch(setAdminStatus(false))
                navigate("/")
            }
        }
    })

    return (
        <AppContext.Provider value={pocpActionSetup}>
            <div className="App">
                <div className="App-header">
                    <Routes>
                        <Route path="/" element={<AuthWallet />} />
                        <Route
                            path="/discord/fallback"
                            element={<DiscordFallback />}
                        />
                        <Route path="/onboard/dao" element={<Onboarding />} />
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
                    </Routes>
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default App

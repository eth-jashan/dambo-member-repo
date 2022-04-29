import React, { useCallback, useEffect } from "react"
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
import { web3 } from "./constant/web3"

function App() {
    dayjs.extend(relativeTimePlugin)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pocp_action = useSelector((x) => x.toast.pocp_action)

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
        // //console.log(
        //     "network changed",
        //     x.toString(),
        //     web3.chainid.polygon === x,
        //     pocp_action
        // )
        // if (x !== "0x4" && !pocp_action) {
        //     dispatch(signout())
        //     navigate("/")
        // }
    })

    return (
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
                        path="contributor/invite/:id"
                        element={<ContributorSignupFallback />}
                    />
                </Routes>
            </div>
        </div>
    )
}

export default App
import React, { useCallback, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Onboarding from "./pages/DaoOnboarding"
import Dashboard from "./pages/Dashboard/index"
import ContributorOnbording from "./pages/ContributorOnboarding"
import AuthWallet from "./pages/AuthWallet"
import "./App.css"
import { useDispatch, useSelector } from "react-redux"
import DiscordFallback from "./pages/DiscordFallback"
import {
    setAdminStatus,
    setLoggedIn,
    signout,
} from "./store/actions/auth-action"
import { INFURA_ID } from "./constants"
import WalletConnectProvider from "@walletconnect/web3-provider"
import Web3Modal from "web3modal"
import ContributorSignupFallback from "./pages/ContributorSignupFallback"

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider, // required
        options: {
            bridge: "https://polygon.bridge.walletconnect.org",
            infuraId: INFURA_ID,
            rpc: {
                1: `https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
                100: "https://dai.poa.network", // xDai
            },
        },
    },
}

const web3Modal = new Web3Modal({
    network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
    cacheProvider: true, // optional
    theme: "light", // optional. Change to "dark" for a dark theme.
    providerOptions: {
        providerOptions,
    },
})

function App() {
    const loggedIn = useSelector((x) => x.auth.loggedIn)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const address = useSelector((x) => x.auth.address)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const loadWeb3Modal = useCallback(async () => {
        const provider = await web3Modal.connect()

        provider.on("chainChanged", (chainId) => {
            // console.log(`CHAIN changed!`, chainId);
            if (chainId === "0x4") {
            } else {
                // if(isAdmin){
                //   dispatch(setLoggedIn(false))
                //   dispatch(signout())
                //   navigate('/')
                // }else{
                //   dispatch(setLoggedIn(false))
                //   dispatch(signout())
                //   dispatch(setAdminStatus(false))
                //   navigate('/')
                // }
            }
        })

        provider.on("accountsChanged", async () => {
            // console.log(`account changed!.....`);
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
    }, [dispatch, isAdmin, navigate])

    useEffect(() => {
        loadWeb3Modal()
    }, [loadWeb3Modal])

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

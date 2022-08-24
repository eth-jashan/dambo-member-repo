import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store, { persistor } from "./store/index"
import "./assets/fonts/PPTelegraf-Medium.otf"
import { PersistGate } from "redux-persist/integration/react"
import "@rainbow-me/rainbowkit/dist/index.css"

import {
    RainbowKitProvider,
    wallet,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { infuraProvider } from "wagmi/providers/infura"

const { chains, provider, webSocketProvider } = configureChains(
    process.env.NODE_ENV === "production"
        ? [chain.mainnet, chain.polygon, chain.rinkeby, chain.polygonMumbai]
        : [chain.rinkeby, chain.polygon, chain.mainnet, chain.polygonMumbai],
    [infuraProvider({ infuraId: "25f28dcc7e6b4c85b74ddfb3eeda03e5" })]
)

// const { connectors } = getDefaultWallets({
//     appName: "My RainbowKit App",
//     chains,
// })

const connectors = connectorsForWallets([
    {
        groupName: "Recommended",
        wallets: [
            wallet.metaMask({ chains }),
            wallet.coinbase({ chains }),
            wallet.rainbow({ chains }),
            wallet.brave({ chains }),
        ],
    },
])

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
})

const savedChainId = JSON.parse(window.localStorage.getItem("chainId"))

if (process.env.NODE_ENV === "production") {
    console.log = () => {}
    // console.error = () => {}
    console.debug = () => {}
}

ReactDOM.render(
    <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                initialChain={savedChainId?.chainId || 1}
            >
                <BrowserRouter>
                    <Provider store={store}>
                        <PersistGate loading={null} persistor={persistor}>
                            <App />
                        </PersistGate>
                    </Provider>
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>,
    document.getElementById("root")
)

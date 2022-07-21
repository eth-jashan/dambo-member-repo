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
    getDefaultWallets,
    RainbowKitProvider,
    wallet,
    connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
    defaultChains,
} from "wagmi"
import { infuraProvider } from "wagmi/providers/infura"

const { chains, provider, webSocketProvider } = configureChains(
    [chain.rinkeby, chain.mainnet, chain.polygon],
    // defaultChains,
    [infuraProvider({ infuraId: "2f446b2b3fb241cfb99bfb807be35c6f" })]
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

ReactDOM.render(
    <React.StrictMode>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
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

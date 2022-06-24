import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store, { persistor } from "./store/index"
import "./assets/fonts/PPTelegraf-Medium.otf"
import { PersistGate } from "redux-persist/integration/react"
// import "@rainbow-me/rainbowkit/dist/index.css"

// import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
// import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
// import { infuraProvider } from "wagmi/providers/infura"
// import { web3 } from "./constant/web3"

// const { chains, provider } = configureChains(
//     [chain.rinkeby, chain.mainnet, chain.polygon],
//     [infuraProvider({ infuraId: "2f446b2b3fb241cfb99bfb807be35c6f" })]
// )

// const { connectors } = getDefaultWallets({
//     appName: "My RainbowKit App",
//     chains,
// })

// const wagmiClient = createClient({
//     autoConnect: true,
//     connectors,
//     provider,
// })

// ReactDOM.render(
//     <React.StrictMode>
//         <WagmiConfig client={wagmiClient}>
//             <RainbowKitProvider chains={chains}>
//                 <BrowserRouter>
//                     <Provider store={store}>
//                         <PersistGate loading={null} persistor={persistor}>
//                             <App />
//                         </PersistGate>
//                     </Provider>
//                 </BrowserRouter>
//             </RainbowKitProvider>
//         </WagmiConfig>
//     </React.StrictMode>,
//     document.getElementById("root")
// )

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
)

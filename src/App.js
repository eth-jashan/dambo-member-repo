import { ethers } from "ethers";
import Web3Modal from "web3modal";
import React, { useCallback, useEffect, useState } from "react";
import { INFURA_ID, NETWORKS } from "./constants";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./App.css";
// import { Safe, SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { Account, GnosisSafe } from "./components";
// import Web3 from 'web3';
import { useUserSigner } from "./hooks";

const targetNetwork = NETWORKS.rinkeby;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://mainnet.infura.io/v3/" + INFURA_ID
    )
  : null;
const localProviderUrl = targetNetwork.rpcUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(
  localProviderUrl
);
const blockExplorer = targetNetwork.blockExplorer;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "e651a77de4974d9bae11ed4a9fcf7e57",
    },
  },
};
const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: false, // optional
  providerOptions, // required
});

function App() {
  const mainnetProvider = mainnetInfura;
  const [injectedProvider, setInjectedProvider] = useState();
  const userSigner = useUserSigner(injectedProvider, localProvider);
  const [address, setAddress] = useState();
  console.log('injected Provider', injectedProvider);
  console.log('userSigner', userSigner)
  console.log('localProvider', localProvider) 
  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        console.log('...', newAddress);
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  


  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    console.log('loadWeb3Modal', provider);
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if(injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function"){
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  return (
    <div className="App">
      <div className="App-header">
        <div
          style={{
            position: "fixed",
            textAlign: "right",
            right: 0,
            top: 0,
            padding: 10,
          }}
        >
          <div
            style={{
              position: "fixed",
              textAlign: "right",
              right: 0,
              top: 0,
              padding: 10,
            }}
          >
            <Account
              address={address}
              localProvider={localProvider}
              userSigner={userSigner}
              mainnetProvider={mainnetProvider}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              blockExplorer={blockExplorer}
            />
          </div>
        </div>
        {/* <Web3Func /> */}
      </div>
      <GnosisSafe 
      userSigner={userSigner}
      userAddress={address}
      />
    </div>
  );
}

export default App;

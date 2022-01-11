import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { useUserSigner } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux'
import { setAddress, selectAddress } from '../../redux/authSlice'


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
// const blockExplorer = targetNetwork.blockExplorer;

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

export default function ConnectWallet({ increaseStep, owners, setOwners }) {
  const [injectedProvider, setInjectedProvider] = useState();
  const userSigner = useUserSigner(injectedProvider, localProvider);
  console.log("injected Provider", injectedProvider);
  console.log("userSigner", userSigner);
  console.log("localProvider", localProvider);
  const address = useSelector(selectAddress);
  console.log('address..............', address);

  const dispatch = useDispatch()


  const loadWeb3Modal = useCallback(async () => {
    console.log('callbacks')
    const provider = await web3Modal.connect();
    console.log("loadWeb3Modal", provider);
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", (chainId) => {
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
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  useEffect(() => {
    async function getAddress() {
      console.log(userSigner)
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        dispatch(setAddress(newAddress));
        increaseStep()
        console.log("...", newAddress);
        console.log(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  useEffect(() => {
    console.log(web3Modal.cachedProvider)
    if (!web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);
  
  return (
    <div />
  );
}

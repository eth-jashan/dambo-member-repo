import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { useUserSigner } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux'
import { authWithSign, setAddress, setProvider } from "../../store/actions/auth-action";
import { BsChevronRight } from 'react-icons/bs'
import styles from './style.module.css'
import metamaskIcon from '../../assets/Icons/metamask.svg'
import { Divider, Typography } from "antd";


const targetNetwork = NETWORKS.rinkeby;
// const mainnetInfura = navigator.onLine
//   ? new ethers.providers.StaticJsonRpcProvider(
//       "https://mainnet.infura.io/v3/" + INFURA_ID
//     )
//   : null;
const localProviderUrl = targetNetwork.rpcUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(
  localProviderUrl
);
// const blockExplorer = targetNetwork.blockExplorer;

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      bridge: "https://polygon.bridge.walletconnect.org",
      infuraId: INFURA_ID,
      rpc: {
        1:`https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
        100:"https://dai.poa.network", // xDai
      },
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme:"light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    providerOptions
  },
});

const ConnectWallet = ({ increaseStep, owners, setOwners }) =>{
  const [injectedProvider, setInjectedProvider] = useState();
  const address = useSelector(x=>x.auth.address)
  const userSigner = useUserSigner(injectedProvider, localProvider);
  console.log("injected Provider", injectedProvider);
  console.log("userSigner", userSigner);
  console.log("localProvider", localProvider);
  console.log('address..............', address);

  const dispatch = useDispatch()


  const loadWeb3Modal = useCallback(async () => {
    console.log('callbacks')
    const provider = await web3Modal.connect();
    // console.log("loadWeb3Modal", provider);
    setInjectedProvider(new ethers.providers.Web3Provider(provider));
    dispatch(setProvider(provider,new ethers.providers.Web3Provider(provider),4));
    const newAddress = userSigner.getAddress();
    console.log("loadWeb3Modal", address);
    dispatch(setAddress(newAddress));
    // dispatch(authWithSign(newAddress))

    provider.on("chainChanged", async(chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
      dispatch(setProvider(provider,new ethers.providers.Web3Provider(provider),4));
      const newAddress = await userSigner.getAddress();
      dispatch(setAddress(newAddress));
      // dispatch(authWithSign(newAddress))
    });

    provider.on("accountsChanged",async () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
      dispatch(setProvider(provider,new ethers.providers.Web3Provider(provider),4));
      const newAddress = await userSigner.getAddress();
      dispatch(setAddress(newAddress));
      // dispatch(authWithSign(newAddress, provider))
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  const authWithWallet = async() => {
    console.log('started....')
    const provider = await web3Modal.connect()
    const signer = new ethers.providers.Web3Provider(provider).getSigner()
    dispatch(authWithSign(address, signer))
  }

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

  // useEffect(useCallback( async() => {
  //   console.log("Status======>", web3Modal.cachedProvider)
  //   if (web3Modal.cachedProvider) {
  //     await loadWeb3Modal();
  //   }
  // }, [loadWeb3Modal]),[loadWeb3Modal])

  const connectWallet = () => (
      <div className={styles.walletCnt}>
        <div className={styles.walletLogo}>
        <img 
          src={metamaskIcon}
          alt='metamask' 
          height={32} 
          width={32} 
        />
        <div className={styles.walletName}>Metamask</div>
        </div>
        <BsChevronRight />
      </div>
  )
  
  const authWallet = () => (
    <div className={styles.walletCntAuth}>
      <img 
        src={metamaskIcon}
        alt='metamask' 
        height={32} 
        width={32} 
      />

      <div className={styles.rightContainer}>
        <div className={styles.walletName}>Metamask</div>
        <div className={styles.addresCnt}>
          <div className={styles.address}>{address}</div>
          <div className={styles.disconnectLink}>Disconnect</div>
        </div>

        <Divider />
        <div className={styles.authHeading}>Authenticate your wallet</div>
        <div className={styles.authGreyHeading}>This is required to login, create or<br/> import your safes</div>

        <div onClick={async()=>await authWithWallet()} className={styles.authBtn}>
          <div className={styles.btnTextAuth}>Authenticate wallet</div>
        </div>
      </div>

    </div>
)
  return (
    <div>
      <div className={styles.headingCnt}>
        <div className={styles.heading}>Connect wallet</div>
        <div className={styles.greyHeading}>First step towards streamlining your DAO</div>
      </div>
      {connectWallet()}
    </div>
  );
}

export default ConnectWallet

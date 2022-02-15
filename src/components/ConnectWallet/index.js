import React, { useCallback, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { useUserSigner } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux'
import { authWithSign, getJwt, setAddress, setLoggedIn, setProvider } from "../../store/actions/auth-action";
import { BsChevronRight } from 'react-icons/bs'
import styles from './style.module.css'
import metamaskIcon from '../../assets/Icons/metamask.svg'
import { Divider, Alert } from "antd";
import { useNavigate } from "react-router";
import walletIcon from '../../assets/Icons/wallet.svg'
import tickIcon from '../../assets/Icons/tick.svg'
import { FaDiscord } from 'react-icons/fa'
const targetNetwork = NETWORKS.rinkeby;
const localProviderUrl = targetNetwork.rpcUrl;
const localProvider = new ethers.providers.StaticJsonRpcProvider(
  localProviderUrl
);

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

const ConnectWallet = ({ increaseStep, isDao }) =>{
  const address = useSelector(x=>x.auth.address)
  const jwt = useSelector(x=>x.auth.jwt)
  const web3Provider = useSelector(x=>x.auth.web3Provider)
  const userSigner = useUserSigner(web3Provider, localProvider);


  const dispatch = useDispatch()

  const authWithWallet = useCallback(async(address) => {
    
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    const chainId = await signer.getChainId()
    console.log('adresssss.....',chainId)
    if(chainId === 4){
      try {
      const res =  await dispatch(authWithSign(address, signer))
      if(res){
        dispatch(setLoggedIn(true))
      }
      } catch (error) {
        console.log('error on signing....', error)
      }
    }else{
      console.log('change chain id')
      alert('change chain id......')
    }
    // navigate('/dashboard')
  })

  const logoutOfWeb3Modal = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (
      web3Provider &&
      web3Provider.provider &&
      typeof web3Provider.provider.disconnect == "function"
    ) {
      await web3Provider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });

  const alertBanner = () => (
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description"
      type="error"
    />
  )

  const loadWeb3Modal = useCallback(async () => {
    console.log('callbacks')
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    dispatch(setProvider(provider,web3Provider,4));
    const signer = web3Provider.getSigner()
    const newAddress = await signer.getAddress()
    const chainid = await signer.getChainId()
    dispatch(setAddress(newAddress));
      const res = dispatch(getJwt(newAddress))
      if(res && chainid === 4){
        //has token and chain is 4
        dispatch(setLoggedIn(true))
      }else if(!res && chainid === 4 ){
        //doesnot token and chain is 4
        dispatch(setLoggedIn(false))
        console.log('no jwt....')
        authWithWallet(newAddress)
      }
      else{
        //chain is wrong
        dispatch(setLoggedIn(false))
        alert('change chain id......')
        alertBanner()
      }
    
    
    provider.on("chainChanged", async(chainId) => {
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider)
      const signer = web3Provider.getSigner()
      const newAddress = await signer.getAddress()
      const chainid = await signer.getChainId()
      dispatch(setProvider(provider,web3Provider,4));
      dispatch(setAddress(newAddress));
      const res = dispatch(getJwt(newAddress))
      console.log(`chain changed to ${chainid}! updating providers`);
      console.log('jwt........ chain', res)
      if(res && chainid === 4){
        //has token and chain is 4
        dispatch(setProvider(provider,web3Provider,4));
        dispatch(setLoggedIn(true))
      }else if(!res && chainid === 4 ){
        //doesnot token and chain is 4
        dispatch(setProvider(provider,web3Provider,4));
        dispatch(setLoggedIn(false))
        console.log('no jwt....')
        authWithWallet(newAddress)
      }
      else{
        //chain is wrong
        dispatch(setLoggedIn(false))
        alert('change chain id......')
        alertBanner()
      }
    });

    provider.on("accountsChanged",async () => {
      console.log(`account changed!`);
      const provider = await web3Modal.connect();
      const web3Provider = new providers.Web3Provider(provider)
      const signer = web3Provider.getSigner()
      const newAddress = await signer.getAddress()
      dispatch(setProvider(provider,web3Provider,4));
      dispatch(setAddress(newAddress));
      const res = dispatch(getJwt(newAddress))
      if(res && chainid === 4){
        dispatch(setLoggedIn(false))
        //has token and chain is 4
        dispatch(setLoggedIn(true))
      }else if(!res && chainid === 4 ){
        //doesnot token and chain is 4
        dispatch(setLoggedIn(false))
        console.log('no jwt....')
        authWithWallet(newAddress)
      }
      else{
        //chain is wrong
        dispatch(setLoggedIn(false))
        alert('change chain id......')
        alertBanner()
      }
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [dispatch]);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        dispatch(setAddress(newAddress));
        // increaseStep()
      }
    }
    getAddress();
  }, [dispatch, userSigner]);

  // useEffect(useCallback( async() => {
  //   console.log("Status======>", web3Modal.cachedProvider)
  //   if (web3Modal.cachedProvider) {
  //     await loadWeb3Modal();
  //   }
  //   const provider = await web3Modal.connect();
  //   const web3Provider = new providers.Web3Provider(provider)
  //   dispatch(setProvider(provider,web3Provider,4));
  //   const signer = web3Provider.getSigner()
  //   const newAddress = await signer.getAddress()
  //   dispatch(setAddress(newAddress));
  // }, [loadWeb3Modal]),[loadWeb3Modal])

  const connectWallet = () => (
      <div className={styles.walletCnt}>
        <div onClick={()=>loadWeb3Modal()} className={styles.walletLogo}>
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
          <div onClick={()=>logoutOfWeb3Modal()} className={styles.disconnectLink}>Disconnect</div>
        </div>

        <Divider />
        <div className={styles.authHeading}>Authenticate your wallet</div>
        <div className={styles.authGreyHeading}>This is required to login, create or<br/> import your safes</div>

        <div onClick={async()=>await authWithWallet(address)} className={styles.authBtn}>
          <div className={styles.btnTextAuth}>Authenticate wallet</div>
        </div>
      </div>

    </div>
  )

  const daoWallet = () => (
    <div>
      <div className={styles.headingCnt}>
        <div className={styles.heading}>Connect wallet</div>
        <div className={styles.greyHeading}>First step towards streamlining your DAO</div>
      </div>
      {address?authWallet():connectWallet()}
    </div>
  )

  const contributorWallet = () => (
    <div className={styles.walletContri}>
      <div className={styles.metaCard}>
        <div style={{height:'100%'}}>
          <div style={{height:'64px', width:'64px', borderRadius:'64px', border:'1px solid #c2c2c2', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <img 
            src={(!jwt && !address)?walletIcon:tickIcon}
            alt='wallet' 
            height={32} 
            width={32} 
          />
          </div>
        </div>

        <div className={styles.rightContent}>
          <div>
            <div className={styles.walletHeading}>
              {(!jwt && !address)?'Connect your Wallet':'Wallet Connected'}
            </div>
            {(!jwt && !address)?<div className={styles.walletsubHeading}>
              Lorem ipsum dolor sit amet,<br/>consectetur adipiscing elit.
            </div>:
            <div className={styles.connectedText}>
              {address.slice(0,5)}...{address.slice(-3)}
            </div>}
          </div>
          {(!jwt && !address)&&<div  onClick={()=>loadWeb3Modal()} className={styles.connectBtn}>
            <span className={styles.btnTitle}>
              Connect Wallet
            </span>
          </div>}
          {(jwt && address)&&
          <div  onClick={()=>loadWeb3Modal()} className={styles.disconnectDiv}>
            <div className={styles.divider}/>
            <span className={styles.disconnectTitle}>
              Disconnect Wallet
            </span>
          </div>
          }
        </div>
      </div>

      <div className={styles.metaCard}>
        <div style={{height:'100%'}}>
        <div style={{height:'64px', width:'64px', borderRadius:'64px', border:'1px solid #c2c2c2', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <FaDiscord size={32} color={!jwt?'#B3B3B3':'#5865F2'} />
          </div>
        </div>

        <div className={styles.rightContentDown}>
          <div>
            <div style={{color:!jwt && '#B3B3B3'}} className={styles.walletHeading}>
              Connect Discord
            </div>
            <div className={styles.walletsubHeading}>
              We use Discord to check your name<br/>and servers you've joined
            </div>
          </div>
          <div style={{background:!jwt && '#B3B3B3'}} className={styles.connectBtn}>
            <div className={`${styles.btnTitle}`}>
              Connect Wallet
            </div>
          </div>
        </div>
      </div>
    </div>
  )


  return ( 
    isDao?daoWallet():contributorWallet()
  );
}

export default ConnectWallet

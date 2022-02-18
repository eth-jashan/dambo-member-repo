import React, { useCallback, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { useUserSigner } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux'
import { authWithSign, getJwt, setAddress, setAdminStatus, setLoggedIn, signout } from "../../store/actions/auth-action";
import { BsChevronRight } from 'react-icons/bs'
import styles from './style.module.css'
import metamaskIcon from '../../assets/Icons/metamask.svg'
import { Divider, Alert } from "antd";
import { useNavigate } from "react-router";
import walletIcon from '../../assets/Icons/wallet.svg'
import tickIcon from '../../assets/Icons/tick.svg'
import { FaDiscord } from 'react-icons/fa'
import { getAddressMembership } from "../../store/actions/gnosis-action";
import { setDiscordOAuth } from "../../store/actions/contibutor-action";
import { setProvider, setSigner } from "../../store/actions/we3-action";
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

const ConnectWallet = ({ isAdmin }) =>{
  const address = useSelector(x=>x.auth.address)
  const jwt = useSelector(x=>x.auth.jwt)
  const web3Provider = useSelector(x=>x.auth.web3Provider)
  const userSigner = useUserSigner(web3Provider, localProvider);
  const uuid = useSelector(x=>x.contributor.invite_code)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authWithWallet = useCallback(async(address) => {
    
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    const chainId = await signer.getChainId()
    console.log('adresssss.....',signer)
    dispatch(setSigner(signer));
    if(chainId === 4){
      try {
      const res =  await dispatch(authWithSign(address, signer))
      if(res){
        dispatch(setLoggedIn(true))
        if(isAdmin){
          const res = await dispatch(getAddressMembership())
          if(res){
            navigate(`/dashboard/${res?.dao_details?.uuid}`)
          }else{
            navigate('/onboard/dao')
          }
        }else{
          // navigate(`/onboard/contributor/${uuid}`)
        }
      }
      } catch (error) {
        console.log('error on signing....', error)
      }
    }else{
      console.log('change chain id')
      alert('change chain id.....')
    }
    // navigate('/dashboard')
  },[dispatch, isAdmin, navigate])

  const logoutOfWeb3Modal = useCallback(async () => {
    await web3Modal.clearCachedProvider();
    if (
      web3Provider &&
      web3Provider.provider &&
      typeof web3Provider.provider.disconnect == "function"
    ) {
      await web3Provider.provider.disconnect();
      dispatch(signout())
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  },[dispatch, web3Provider]);

  const alertBanner = () => (
    <Alert
      message="Error Text"
      description="Error Description Error Description Error Description Error Description"
      type="error"
    />
  )
    // console.log('admin..', isAdmin, address)
  const onDiscordAuth = () => {
    console.log('token.....', address,uuid, jwt)
    dispatch(setDiscordOAuth(address,uuid, jwt))
    window.location.replace('https://discord.com/api/oauth2/authorize?client_id=943242563178086540&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20guilds')
  }

  const loadWeb3Modal = useCallback(async () => {
    console.log('start.....')
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    dispatch(setSigner(signer));
    // const signer = web3Provider.getSigner()
    const newAddress = await signer.getAddress()
    const chainid = await signer.getChainId()
    dispatch(setAddress(newAddress));
      const res = dispatch(getJwt(newAddress))
      if(res && chainid === 4){
        //has token and chain is 4
        dispatch(setLoggedIn(true))
        if(isAdmin){
          const res = await dispatch(getAddressMembership())
          if(res){
            // console.log('callbacks.........', selected)
            navigate(`/dashboard/${res?.dao_details?.uuid}`)
          }else{
            navigate('/onboard/dao')
          }
        }else{
          // navigate(`/onboard/contributor/${uuid}`)
        }
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
      // const provider = await web3Modal.connect();
      // const web3Provider = new providers.Web3Provider(provider)
      // const signer = web3Provider.getSigner()
      // const newAddress = await signer.getAddress()
      // const chainid = await signer.getChainId()
      // dispatch(setProvider(provider,web3Provider,4));
      // dispatch(setAddress(newAddress));
      // const res = dispatch(getJwt(newAddress))
      // console.log(`chain changed to ${chainid}! updating providers`);
      // console.log('jwt........ chain', res)
      // if(res && chainid === 4){
      //   //has token and chain is 4
      //   dispatch(setProvider(provider,web3Provider,4));
      //   dispatch(setLoggedIn(true))
      //   if(isAdmin){
      //     const res = await dispatch(getAddressMembership())
      //     if(res){
      //       navigate('/dashboard')
      //     }else{
      //       navigate('/onboard/dao')
      //     }
      //   }else{
      //     navigate(`/onboard/contributor/${uuid}`)
      //   }
      // }else if(!res && chainid === 4 ){
      //   //doesnot token and chain is 4
      //   dispatch(setProvider(provider,web3Provider,4));
      //   dispatch(setLoggedIn(false))
      //   console.log('no jwt....')
      //   authWithWallet(newAddress)
      // }
      // else{
      //   //chain is wrong
      //   dispatch(setLoggedIn(false))
      //   alert('change chain id......')
      //   alertBanner()
      // }
      dispatch(setLoggedIn(false))
      navigate('/')
    });

    provider.on("accountsChanged",async () => {
      console.log(`account changed!.........`);
      dispatch(setLoggedIn(false))
      navigate('/')
      // const provider = await web3Modal.connect();
      // const web3Provider = new providers.Web3Provider(provider)
      // const signer = web3Provider.getSigner()
      // const newAddress = await signer.getAddress()
      // dispatch(setProvider(provider,web3Provider,4));
      // dispatch(setAddress(newAddress));
      // const res = dispatch(getJwt(newAddress))
      // if(res && chainid === 4){
      //   // dispatch(setLoggedIn(false))
      //   //has token and chain is 4
      //   dispatch(setLoggedIn(true))
      //   if(isAdmin){
      //     const res = await dispatch(getAddressMembership())
      //     if(res){
      //       navigate('/dashboard')
      //     }else{
      //       navigate('/onboard/dao')
      //     }
      //   }else{
      //     navigate(`/onboard/contributor/${uuid}`)
      //   }
      // }else if(!res && chainid === 4 ){
      //   //doesnot token and chain is 4
      //   dispatch(setLoggedIn(false))
      //   console.log('no jwt....')
      //   navigate('/onboard/dao')
      //   // authWithWallet(newAddress)
      // }
      // else{
      //   //chain is wrong
      //   dispatch(setLoggedIn(false))
      //   alert('change chain id......')
      //   alertBanner()
      // }
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [authWithWallet, dispatch, isAdmin, logoutOfWeb3Modal, navigate, uuid]);

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

  const initialLoad = useCallback( async() => {
    if (web3Modal.cachedProvider) {
      await loadWeb3Modal();
    }
  },[loadWeb3Modal])

  // useEffect(() => {
  // initialLoad()
  // },[initialLoad])

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
          <div onClick={()=>dispatch(signout())} className={styles.disconnectLink}>Disconnect</div>
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
  
  const disconnectContributor = () => {
    dispatch(signout())
    dispatch(setAdminStatus(false))
  }

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
            src={(!jwt)?walletIcon:tickIcon}
            alt='wallet' 
            height={32} 
            width={32} 
          />
          </div>
        </div>

        <div className={styles.rightContent}>
          <div>
            <div className={styles.walletHeading}>
              {(!jwt)?'Connect your Wallet':'Wallet Connected'}
            </div>
            {(!jwt)?<div className={styles.walletsubHeading}>
              Lorem ipsum dolor sit amet,<br/>consectetur adipiscing elit.
            </div>:
            <div className={styles.connectedText}>
              {address.slice(0,5)}...{address.slice(-3)}
            </div>}
          </div>
          {(!jwt)&&<div  onClick={()=>loadWeb3Modal()} className={styles.connectBtn}>
            <span className={styles.btnTitle}>
              Connect Wallet
            </span>
          </div>}
          {(address)&&
          <div  onClick={()=>disconnectContributor()} className={styles.disconnectDiv}>
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
          <div onClick={()=>onDiscordAuth()}  className={!jwt?styles.connectBtnGrey:styles.connectBtn}>
            <span className={styles.btnTitle}>
              Connect Discord
            </span>
          </div>
        </div>
      </div>
    </div>
  )


  return ( 
    isAdmin?daoWallet():contributorWallet()
  );
}

export default ConnectWallet

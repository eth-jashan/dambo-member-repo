import React, { useCallback, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID, NETWORKS } from "../../constants";
import { useUserSigner } from "../../hooks";
import { useSelector, useDispatch } from 'react-redux'
import { authWithSign, getJwt, setAddress, setAdminStatus, setLoggedIn, signout } from "../../store/actions/auth-action";

import styles from './style.module.css'
import metamaskIcon from '../../assets/Icons/metamask.svg'
import { Divider, Alert, message } from "antd";
import { useNavigate } from "react-router";
import walletIcon from '../../assets/Icons/wallet.svg'
import tickIcon from '../../assets/Icons/tick.svg'
import { FaDiscord } from 'react-icons/fa'
import { getAddressMembership } from "../../store/actions/gnosis-action";
import { getRole, setDiscordOAuth } from "../../store/actions/contibutor-action";
import chevron_right from '../../assets/Icons/chevron_right.svg'
import { links } from "../../constant/links";

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
  const [auth, setAuth] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const authWithWallet = useCallback(async(address) => {
    setAuth(true)
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    const chainId = await signer.getChainId()
  
    if(chainId === 4){
      try {
      const res =  await dispatch(authWithSign(address, signer))
      if(res){
        dispatch(setLoggedIn(true))
        if(isAdmin){
          const res = await dispatch(getAddressMembership())
          if(res){
            setAuth(false)
            navigate(`/dashboard`)
          }else{
            setAuth(false)
            navigate('/onboard/dao')
          }
        }else{
          setAuth(false)
          if(!isAdmin){
            try {
              const res = await dispatch(getRole(uuid))
              if(res){
                message.success('Already a member')
                dispatch(setAdminStatus(true))
                navigate(`/dashboard`)
              }else{

              }
            } catch (error) {
              // message.error('Error on getting role')
            }
          }
        }
      }
      } catch (error) {
        console.log('error on signing....', error)
      }
    }else{
      console.log('change chain id')
      message.error('change chain to rinkeby.....')
    }
    setAuth(false)
    // navigate('/dashboard')
  },[dispatch, isAdmin, navigate, uuid])

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
    dispatch(setDiscordOAuth(address,uuid, jwt))
    window.location.replace(links.discord_oauth.staging)
  }

  const loadWeb3Modal = useCallback(async () => {
    setAuth(true)
    const provider = await web3Modal.connect();
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    // dispatch(setSigner(signer));
    // const signer = web3Provider.getSigner()
    const newAddress = await signer.getAddress()
    const chainid = await signer.getChainId()
    dispatch(setAddress(newAddress, signer));
      const res = dispatch(getJwt(newAddress))
      if(res && chainid === 4){
        //has token and chain is 4
        dispatch(setLoggedIn(true))
        if(isAdmin){
          const res = await dispatch(getAddressMembership())
          if(res){
            // console.log('callbacks.........', selected)
            setAuth(false)
            navigate(`/dashboard`)
          }else{
            setAuth(false)
            navigate('/onboard/dao')
          }
        }else{
          setAuth(false)
          if(!isAdmin){
            try {
              const res = await dispatch(getRole(uuid))
              if(res){
                message.success('Already a member')
                dispatch(setAdminStatus(true))
                navigate(`/dashboard`)
              }else{

              }
            } catch (error) {
              // message.error('Error on getting role')
            }
          }
          // navigate(`/onboard/contributor/${uuid}`)
        }
      }else if(!res && chainid === 4 ){
        //doesnot token and chain is 4
        setAuth(false)
        dispatch(setLoggedIn(false))
        console.log('no jwt....')
        authWithWallet(newAddress)
      }
      else{
        //chain is wrong
        setAuth(false)
        dispatch(setLoggedIn(false))
        alert('change chain id......')
        alertBanner()
      }

    provider.on("chainChanged", async(chainId) => {
      dispatch(setLoggedIn(false))
      navigate('/')
    });

    provider.on("accountsChanged",async () => {
      console.log(`account changed!.........`);
      dispatch(setLoggedIn(false))
      navigate('/')
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      logoutOfWeb3Modal();
    });
    setAuth(false)
  }, [authWithWallet, dispatch, isAdmin, logoutOfWeb3Modal, navigate, uuid]);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        dispatch(setAddress(newAddress, userSigner));
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
          className={styles.walletImg}
        />
        <div className={styles.walletName}>Metamask</div>
        </div>
        <img src={chevron_right} className={styles.chevronIcon} width='32px' height='32px' alt='cheveron-right'/>
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

        <div onClick={auth?()=>{}:async()=>await authWithWallet(address)} className={styles.authBtn}>
          <div className={styles.btnTextAuth}>{auth?'Authenticating....':'Authenticate wallet'}</div>
        </div>
      </div>

    </div>
  )
  
  const disconnectContributor = () => {
    dispatch(signout())
    dispatch(setAdminStatus(false))
  }
  {/* inline style required */}
  const daoWallet = () => (
    <div style={{width:'100%'}}>
      <div className={styles.headingCnt}>
        <div className={styles.heading}>Connect wallet</div>
        <div className={styles.greyHeading}>First step towards<br/> streamlining your DAO</div>
      </div>
      {address?authWallet():connectWallet()}
    </div>
  )
{/* inline style required */}
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
              {auth?'Conecting...':'Connect Wallet'}
            </span>
          </div>}
          {(address && jwt)&&
          <div  onClick={()=>disconnectContributor()} className={styles.disconnectDiv}>
            <div className={styles.divider}/>
            <span className={styles.disconnectTitle}>
              Disconnect Wallet
            </span>
          </div>
          }
        </div>
      </div>
          {/* inline style required */}
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

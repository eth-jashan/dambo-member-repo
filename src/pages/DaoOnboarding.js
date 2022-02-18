import React, { useCallback, useEffect, useState } from "react";
import Layout from "../views/Layout";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ConnectWallet from "../components/ConnectWallet"
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList";
import DaoInfo from "../components/DaoInfo";
import { useDispatch, useSelector } from "react-redux";
import { addSafeAddress, addThreshold, registerDao } from "../store/actions/gnosis-action";
import { useSafeSdk, useUserSigner } from "../hooks";
import { ethers, providers } from "ethers";
import { useNavigate } from "react-router";
import Web3Modal from "web3modal";
import { INFURA_ID, NETWORKS } from "../constants";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { message } from "antd";

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

export default function Onboarding() {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [deploying, setDeploying] = useState(false)
  const [signer, setSigner] = useState()
  // const provider = useSelector(x=>x.web3.provider);
  const userSigner = useSelector(x=>x.web3.signer);
  // const web3Provider = new providers.Web3Provider(provider)
  // const userSigner = useUserSigner(null, null);
  const [safeAddress, setSafeAddress] = useState()
  const { safeSdk, safeFactory } = useSafeSdk(signer, safeAddress)
  
  
  const owners = useSelector(x=>x.gnosis.newSafeSetup.owners)
  const threshold = useSelector(x=>x.gnosis.newSafeSetup.threshold)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const address = useSelector(x=>x.auth.address)
  const jwt = useSelector(x=>x.auth.jwt)

  const preventGoingBack = useCallback(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", () => {
        // navigate.to(1);
        if(address && jwt){
            console.log('on back!!!')
            window.history.pushState(null, document.title, window.location.href);
        }
      });
  },[address, jwt])

  useEffect(()=>{
    preventGoingBack()
  },[preventGoingBack])

  const deploySafe = useCallback(async (owners) => {
    console.log('deployingggg', threshold, safeFactory,userSigner)
    if (!safeFactory) return
    setDeploying(true)
    const safeAccountConfig = { owners, threshold:1 }
    let safe
    console.log('deployingggg')
    try {
      safe = await safeFactory.deploySafe(safeAccountConfig)
    } catch (error) {
      // console.error(error)
      message.error(error.message)
      setDeploying(false)
      return
    }
    const newSafeAddress = ethers.utils.getAddress(safe.getAddress())
    setSafeAddress(newSafeAddress)
    dispatch(addSafeAddress(newSafeAddress))
    try {
      const res = await dispatch(registerDao())
      if(res){
        navigate(`/dashboard/${res}`)
      }
    } catch (error) {
      console.log('error on registering dao.....')
      message.error(error)
    }
  }, [safeFactory])

  const setProvider = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer)
  }

  const increaseStep = async() => {
  
    if(currentStep === 2){
      setCurrentStep(currentStep + 1)
    }else if(currentStep === 3){
      dispatch(addThreshold(selectedIndex + 1))
      setCurrentStep(currentStep + 1)
      if(!hasMultiSignWallet){
        setProvider()
      }
    }else if(currentStep === 4){
      if(hasMultiSignWallet){
       const res = await dispatch(registerDao('Jashan Dao'))
       console.log('ress', res)
       if(res){
        navigate(`/dashboard/${res}`)
       }
      }else{
      try {
        try {
          const owner = []
          owners.map((item, index)=>{
            owner.push(item.address)
          })
          console.log(owner, selectedIndex +1)
          await deploySafe(owner)
        } catch (error) {
          console.log('error.... on deploying', error)
        }
      } catch (error) {
        console.log('error.......', error)
      }
    }
    }
    else setCurrentStep(currentStep + 1);
  };

  const decreaseStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else setCurrentStep(0);
  };

  const getComponentFromStep = (step, hasMultiSignWallet = false) => {
    switch (step) {
      case 1: {
        return (
        <GnosisSafeList
          setStep={(x)=>setCurrentStep(x)}
          increaseStep={increaseStep}
          setHasMultiSignWallet={setHasMultiSignWallet}
        />
        )
      }
      case 2: {
        return (
          <AddOwners
            hasMultiSignWallet={hasMultiSignWallet}
            increaseStep={increaseStep}
            setStep={(x)=>setCurrentStep(x)}
            // setOwners={setOwners}
          />
        )
      }
      case 3:
        return (
          <ApproveTransaction
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            // numberOfOwners={owners.length}
          />
        )
      case 4:
        return (
          <DaoInfo 
            hasMultiSignWallet={hasMultiSignWallet}
            increaseStep={increaseStep}
            
          />
        )
      default: {
        return (
          <ConnectWallet
            increaseStep={increaseStep}
            owners={owners}
            // setOwners={setOwners}
          />
        );
      }
    }
  };
  const loggedIn = useSelector(x=>x.auth.loggedIn)
  return (
    <div>
      <Layout decreaseStep={decreaseStep} currentStep={1}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}



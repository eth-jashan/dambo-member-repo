import React, { useCallback, useEffect, useState } from "react";
import Layout from "../views/Layout";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ConnectWallet from "../components/ConnectWallet"
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList";
import DaoInfo from "../components/DaoInfo";
import { useDispatch, useSelector } from "react-redux";
import { addOwners, addSafeAddress, addThreshold, registerDao } from "../store/actions/gnosis-action";
// import { useHistory } from "react-router-dom";
import { useSafeSdk } from "../hooks";
import { ethers, providers } from "ethers";
import { useNavigate } from "react-router";
import { message } from "antd";

export default function Onboarding() {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  // const history = useHistory();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [deploying, setDeploying] = useState(false)
  const [signer, setSigner] = useState()
  // const userSigner = useSelector(x=>x.web3.signer);
  const [safeAddress, setSafeAddress] = useState()
  const { safeFactory } = useSafeSdk(signer, safeAddress)
  const [gnosisLoad, setGnosisLoad] = useState(false)
  
  const owners = useSelector(x=>x.gnosis.newSafeSetup.owners)
  const threshold = useSelector(x=>x.gnosis.newSafeSetup.threshold)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const address = useSelector(x=>x.auth.address)
  const jwt = useSelector(x=>x.auth.jwt)

  const preventGoingBack = useCallback(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", () => {
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
    console.log('deployingggg', threshold)
    if (!safeFactory) return
    setDeploying(true)
    const safeAccountConfig = { owners, threshold }
    let safe
    console.log('deployingggg')
    try {
      safe = await safeFactory.deploySafe(safeAccountConfig)
      message.success('A safe is successfully created !')
      setDeploying(false)
    } catch (error) {
      message.error(error.message)
      setDeploying(false)
      return
    }
    const newSafeAddress = ethers.utils.getAddress(safe.getAddress())
    setSafeAddress(newSafeAddress)
    dispatch(addSafeAddress(newSafeAddress))
    setDeploying(true)
    try {
      const res = await dispatch(registerDao())
      if(res){
        message.success('Your Dao is created succesfully')
        navigate(`/dashboard`)
        setDeploying(false)
      }
    } catch (error) {
      console.log('error on registering dao.....')
      message.error('error on registering dao.....')
      navigate('/onboard/dao')
      setDeploying(false)
    }
  }, [address, dispatch, navigate, safeFactory, threshold])

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
       const res = await dispatch(registerDao())
       if(res){
        navigate(`/dashboard`)
       }else{
         navigate(`/onboard/dao`)
       }
      }else{
      try {
        try {
          const owner = []
          owners.map((item, index)=>{
            owner.push(item.address)
          })
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
    if(currentStep === 4){
      if(hasMultiSignWallet){
        setCurrentStep(2)
      }else{
        setCurrentStep(3)
      }
    }else if (currentStep === 2){
      setCurrentStep(currentStep - 1)
    }
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
          />
        )
      case 4:
        return (
          <DaoInfo 
            hasMultiSignWallet={hasMultiSignWallet}
            increaseStep={increaseStep}
            deploying={deploying}
          />
        )
      default: {
        return (
          <ConnectWallet
            increaseStep={increaseStep}
            owners={owners}
          />
        );
      }
    }
  };
  return (
    <div>
      <Layout decreaseStep={decreaseStep} currentStep={currentStep}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}



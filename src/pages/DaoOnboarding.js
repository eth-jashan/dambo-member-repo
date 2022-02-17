import React, { useCallback, useState } from "react";
import Layout from "../views/Layout";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ConnectWallet from "../components/ConnectWallet"
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList";
import DaoInfo from "../components/DaoInfo";
import { useDispatch, useSelector } from "react-redux";
import { addSafeAddress, addThreshold, registerDao } from "../store/actions/gnosis-action";
import { useSafeSdk, useUserSigner } from "../hooks";
import { ethers } from "ethers";
import { useNavigate } from "react-router";

export default function Onboarding() {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [deploying, setDeploying] = useState(false)
  const provider = useSelector(x=>x.auth.web3Provider);
  const userSigner = useUserSigner(provider, null);
  const [safeAddress, setSafeAddress] = useState()
  const { safeSdk, safeFactory } = useSafeSdk(userSigner, safeAddress)
  
  
  const owners = useSelector(x=>x.gnosis.newSafeSetup.owners)
  const threshold = useSelector(x=>x.gnosis.newSafeSetup.threshold)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const deploySafe = useCallback(async (owners) => {
    console.log('deployingggg', threshold)
    if (!safeFactory) return
    setDeploying(true)
    const safeAccountConfig = { owners, threshold:1 }
    let safe
    console.log('deployingggg')
    try {
      safe = await safeFactory.deploySafe(safeAccountConfig)
    } catch (error) {
      console.error(error)
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
    }
  }, [safeFactory])

  const increaseStep = async() => {
  
    if(currentStep === 2){
      setCurrentStep(currentStep + 1)
    }else if(currentStep === 3){
      dispatch(addThreshold(selectedIndex + 1))
      setCurrentStep(currentStep + 1)
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



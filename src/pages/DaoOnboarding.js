import React, { useCallback, useEffect, useState } from "react";
import Layout from "../views/Layout";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ConnectWallet from "../components/ConnectWallet";
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList";
import DaoInfo from "../components/DaoInfo";
import { useDispatch, useSelector } from "react-redux";
import {
  addOwners,
  addSafeAddress,
  addThreshold,
  registerDao,
} from "../store/actions/dao-action";
// import { useHistory } from "react-router-dom";
import { useSafeSdk } from "../hooks";
import { ethers, providers } from "ethers";
import { useNavigate } from "react-router";
import { message } from "antd";
import { approvePOCPBadge, claimPOCPBadges, registerDaoToPocp } from "../utils/POCPutils";
import { pollingTransaction, relayFunction, updatePocpRegister } from "../utils/relayFunctions";
import { getAuthToken } from "../store/actions/auth-action";
import { web3 } from "../constant/web3";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [deploying, setDeploying] = useState(false);
  const [signer, setSigner] = useState();
  const [safeAddress, setSafeAddress] = useState();
  const { safeFactory } = useSafeSdk(signer, safeAddress);
  const [gnosisLoad, setGnosisLoad] = useState(false);

  const owners = useSelector((x) => x.dao.newSafeSetup.owners);
  const threshold = useSelector((x) => x.dao.newSafeSetup.threshold);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const address = useSelector((x) => x.auth.address);
  const jwt = useSelector((x) => x.auth.jwt);
  const accounts = useSelector((x) => x.dao.dao_list)

  const preventGoingBack = useCallback(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", () => {
      if (address && jwt) {
        
        if (accounts.length === 0) {
          window.history.pushState(null, document.title, window.location.href);
          //console.log("on back!!!", document.title, window.history);
        } else {
            window.history.pushState(null, document.title, "/dashboard");
            window.location.reload("true")
        }
      }
    });
  }, [address, jwt]);

  useEffect(() => {
    preventGoingBack();
  }, [preventGoingBack]);

  const deploySafe = useCallback(
    async (owners) => {
      //console.log("deployingggg");
      if (!safeFactory) return;
      setDeploying(true);
      const safeAccountConfig = { owners, threshold };
      let safe;
      //console.log("deployingggg");
      try {
        safe = await safeFactory.deploySafe(safeAccountConfig);
        message.success("A safe is successfully created !");
        setDeploying(false);
      } catch (error) {
        message.error(error.message);
        setDeploying(false);
        return;
      }
      const newSafeAddress = ethers.utils.getAddress(safe.getAddress());
      setSafeAddress(newSafeAddress);
      dispatch(addSafeAddress(newSafeAddress));
      setDeploying(true);
      const {dao_uuid, name} = await dispatch(registerDao());
        //console.log('owners...', owners)

        if (dao_uuid) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            await web3Provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.polygon}],})
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner()
              const {data, signature} = await registerDaoToPocp(signer,name,owners, address)
              const token = await dispatch(getAuthToken())
              const tx_hash = await relayFunction(token,0,data,signature)
              await updatePocpRegister(jwt, tx_hash, dao_uuid)
              if(tx_hash){
              const startTime = Date.now()
              const interval = setInterval(async()=>{
                if(Date.now() - startTime > 30000){
                  clearInterval(interval)
                  //console.log('failed to get confirmation')
                }
                var customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura);
                const reciept = await customHttpProvider.getTransactionReceipt(tx_hash)
                if(reciept?.status){
                  //console.log('done', reciept)
                  clearTimeout(interval)
                  //console.log('successfully registered')
                await provider.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.chainid.rinkeby}],
                })
                navigate(`/dashboard`)
                }
                //console.log('again....')
              },2000)
            }else{
              //console.log('error in fetching tx hash....')
            }
          } catch (error) {
              //console.log(error.toString())
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.chainid.rinkeby}],
              })
          }
        } else {
          navigate(`/onboard/dao`);
        }
    },
    [address, dispatch, navigate, safeFactory, threshold]
  );

  const setProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
  };

  const increaseStep = async () => {
    if (currentStep === 2) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      dispatch(addThreshold(selectedIndex + 1));
      setCurrentStep(currentStep + 1);
      if (!hasMultiSignWallet) {
        setProvider();
      }
    } else if (currentStep === 4) {
      if (hasMultiSignWallet) {
        const {dao_uuid, name, owners} = await dispatch(registerDao());
        let owner = [address]
        if(owners.length>1){
          owners.map((x,i)=>{
            if(x?.address !== address){
              owner.push(x?.address)
            }
          })
        }
        //console.log('ownersss', owner)
        if (dao_uuid) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            await web3Provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.polygon}],})
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner()
              const {data, signature} = await registerDaoToPocp(signer,name,owner, address)
              const token = await dispatch(getAuthToken())
              const tx_hash = await relayFunction(token,0,data,signature)
              await updatePocpRegister(jwt, tx_hash, dao_uuid)
              if(tx_hash){
              const startTime = Date.now()
              const interval = setInterval(async()=>{
                if(Date.now() - startTime > 30000){
                  clearInterval(interval)
                  //console.log('failed to get confirmation')
                }
                var customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura);
                const reciept = await customHttpProvider.getTransactionReceipt(tx_hash)
                if(reciept?.status){
                  //console.log('done', reciept)
                  clearTimeout(interval)
                  //console.log('successfully registered')
                await provider.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.chainid.rinkeby}],
                })
                navigate(`/dashboard`)
                }
                //console.log('again....')
              },2000)
            }else{
              //console.log('error in fetching tx hash....')
            }
          } catch (error) {
              //console.log(error.toString())
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              await provider.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.chainid.rinkeby}],
              })
          }
        } else {
          navigate(`/onboard/dao`);
        }
      } else {
        try {
          try {
            const owner = [];
            owners.map((item, index) => {
              owner.push(item.address);
            });
            await deploySafe(owner);
          } catch (error) {
            //console.log("error.... on deploying", error);
          }
        } catch (error) {
          //console.log("error.......", error);
        }
      }
    } else setCurrentStep(currentStep + 1);
  };

  const decreaseStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    if (currentStep === 4) {
      if (hasMultiSignWallet) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getComponentFromStep = (step, hasMultiSignWallet = false) => {
    switch (step) {
      case 1: {
        return (
          <GnosisSafeList
            setStep={(x) => setCurrentStep(x)}
            increaseStep={increaseStep}
            setHasMultiSignWallet={setHasMultiSignWallet}
          />
        );
      }
      case 2: {
        return (
          <AddOwners
            hasMultiSignWallet={hasMultiSignWallet}
            increaseStep={increaseStep}
            setStep={(x) => setCurrentStep(x)}
          />
        );
      }
      case 3:
        return (
          <ApproveTransaction
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        );
      case 4:
        return (
          <DaoInfo
            hasMultiSignWallet={hasMultiSignWallet}
            increaseStep={increaseStep}
            deploying={deploying}
          />
        );
      default: {
        return <ConnectWallet increaseStep={increaseStep} owners={owners} />;
      }
    }
  };
  return (
    <div>
      <Layout
        signer={signer}
        decreaseStep={decreaseStep}
        currentStep={currentStep}
      >
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}

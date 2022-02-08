import React, { useState } from "react";
import Layout from "../views/Layout";
import NamingDAO from "../components/NamingDAO";
import SelectWallet from "../components/SelectWallet";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ReviewDAO from "../components/ReviewDAO";
import ConnectWallet from "../components/ConnectWallet"
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList";
import DaoInfo from "../components/DaoInfo";

export default function Onboarding() {
  let navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  const [DAOName, setDAOName] = useState("");
  const [wallets, setWallets] = useState([
    "Multisign wallet One",
    "Multisign wallet Two",
    "Multisign wallet Three",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [owners, setOwners] = useState(
    [{
      id: uuidv4(),
      name: "Jashan",
      address: "0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8",
    },{
      id: uuidv4(),
      name: "Rohan",
      address: "0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377",
    }]
  );

  const increaseStep = () => {
    console.log(currentStep)
    if (currentStep === 4){
      navigate('/dashboard')
    }
    else setCurrentStep(currentStep + 1);
  };

  const decreaseStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else setCurrentStep(0);
  };

  const getComponentFromStep = (step, hasMultiSignWallet = false) => {
    switch (step) {
      case 0: {
        return (
        <GnosisSafeList
          setStep={(x)=>setCurrentStep(x)}
          increaseStep={increaseStep}
        />
        )
      }
      case 1: {
        return (
          <AddOwners
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          />
        )
      }
      case 2:
        return (
          <ApproveTransaction
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            numberOfOwners={owners.length}
          />
        )
      case 3:
        return (
          <DaoInfo 
            increaseStep={increaseStep}
            decreaseStep={decreaseStep} 
          />
        )
      case 4:
        return <GnosisSafeList />
      default: {
        return (
          <NamingDAO
            setHasMultiSignWallet={setHasMultiSignWallet}
            increaseStep={increaseStep}
            DAOName={DAOName}
            setDAOName={setDAOName}
          />
        );
      }
    }
  };

  return (
    <div>
      <Layout decreaseStep={decreaseStep} currentStep={1}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
          {/* <ConnectWallet
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          /> */}
          {/* */}
      </Layout>
    </div>
  );
}



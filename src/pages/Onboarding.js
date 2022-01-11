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

  const [owners, setOwners] = useState([]);

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
        
        if (hasMultiSignWallet)
          return (
            <ConnectWallet
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          />
            // <SelectWallet
            //   setHasMultiSignWallet={setHasMultiSignWallet}
            //   wallets={wallets}
            //   setWallets={setWallets}
            // />
          );
        return (
          <ConnectWallet
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          />
          // <NamingDAO
          //   setHasMultiSignWallet={setHasMultiSignWallet}
          //   increaseStep={increaseStep}
          //   DAOName={DAOName}
          //   setDAOName={setDAOName}
          // />
        );
      }
      case 1: {
        
        if (hasMultiSignWallet)
          return (
            <SelectWallet
              setHasMultiSignWallet={setHasMultiSignWallet}
              wallets={wallets}
              setWallets={setWallets}
            />
          );
        return (
          <NamingDAO
            setHasMultiSignWallet={setHasMultiSignWallet}
            increaseStep={increaseStep}
            DAOName={DAOName}
            setDAOName={setDAOName}
          />
        );
      }
      case 2:
        return (
          <AddOwners
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          />
        );
      case 3:
        return (
          <ApproveTransaction
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            numberOfOwners={owners.length}
          />
        );
      case 4:
        return (
          <ReviewDAO
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            owners={owners}
          />
        );
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
      <Layout decreaseStep={decreaseStep} currentStep={currentStep}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}



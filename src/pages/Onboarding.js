import React, { useState } from "react";
import Layout from "../views/Layout";
import NamingDAO from "../components/NamingDAO";
import SelectWallet from "../components/SelectWallet";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ReviewDAO from "../components/ReviewDAO";
import { v4 as uuidv4 } from "uuid";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);
  const [DAOName, setDAOName] = useState("");
  const [wallets, setWallets] = useState([
    "Multisign wallet One",
    "Multisign wallet Two",
    "Multisign wallet Three",
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [owners, setOwners] = useState([
    {
      id: uuidv4(),
      name: "Aviral Bohra",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
    {
      id: uuidv4(),
      name: "Aviral Bohra1",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
    {
      id: uuidv4(),
      name: "Aviral Bohra2",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
  ]);

  const increaseStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else setCurrentStep(3);
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
      case 1:
        return (
          <AddOwners
            increaseStep={increaseStep}
            owners={owners}
            setOwners={setOwners}
          />
        );
      case 2:
        return (
          <ApproveTransaction
            increaseStep={increaseStep}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            numberOfOwners={owners.length}
          />
        );
      case 3:
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
      <Layout decreaseStep={decreaseStep}>
        {getComponentFromStep(currentStep, hasMultiSignWallet)}
      </Layout>
    </div>
  );
}

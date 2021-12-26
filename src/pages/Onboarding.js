import React, { useState } from "react";
import Layout from "../views/Layout";
import NamingDAO from "../components/NamingDAO";
import SelectWallet from "../components/SelectWallet";
import AddOwners from "../components/AddOwners";
import ApproveTransaction from "../components/ApproveTransaction";
import ReviewDAO from "../components/ReviewDAO";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);

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
          return <SelectWallet setHasMultiSignWallet={setHasMultiSignWallet} />;
        return (
          <NamingDAO
            setHasMultiSignWallet={setHasMultiSignWallet}
            increaseStep={increaseStep}
          />
        );
      }
      case 1:
        return <AddOwners increaseStep={increaseStep} />;
      case 2:
        return <ApproveTransaction increaseStep={increaseStep} />;
      case 3:
        return <ReviewDAO increaseStep={increaseStep} />;
      default: {
        return (
          <NamingDAO
            setHasMultiSignWallet={setHasMultiSignWallet}
            increaseStep={increaseStep}
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

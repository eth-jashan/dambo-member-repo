import React, { useState } from "react";
import Layout from "../views/Layout";
import NamingDAO from "../components/NamingDAO";
import SelectWallet from "../components/SelectWallet";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false);

  const getComponentFromStep = (step, hasMultiSignWallet = false) => {
    switch (step) {
      case 0: {
        if (hasMultiSignWallet)
          return <SelectWallet setHasMultiSignWallet={setHasMultiSignWallet} />;
        return <NamingDAO setHasMultiSignWallet={setHasMultiSignWallet} />;
      }
      default: {
        return <NamingDAO setHasMultiSignWallet={setHasMultiSignWallet} />;
      }
    }
  };

  return (
    <div>
      <Layout>{getComponentFromStep(currentStep, hasMultiSignWallet)}</Layout>
    </div>
  );
}

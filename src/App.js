import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Onboarding from "./pages/DaoOnboarding";
import Dashboard from './pages/Dashboard/index'
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import React, { useCallback, useEffect, useState } from "react";
import { INFURA_ID, NETWORKS } from "./constants";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./App.css";
// import { Safe, SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { Account, GnosisSafe } from "./components";
// import Web3 from 'web3';
import { useUserSigner } from "./hooks";
import ContributorOnbording from "./pages/ContributorOnboarding";

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Routes>
          <Route path="/onboard/dao" element={<Onboarding />} />
          <Route path="onboard/contributor" element={<ContributorOnbording />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

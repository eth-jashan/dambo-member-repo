import React, { useCallback, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Onboarding from "./pages/DaoOnboarding";
import Dashboard from './pages/Dashboard/index'
import ContributorOnbording from "./pages/ContributorOnboarding";
import AuthWallet from "./pages/AuthWallet";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import DiscordFallback from "./pages/DiscordFallback";
import { setAdminStatus, setLoggedIn, signout } from "./store/actions/auth-action";
import { set_invite_id } from "./store/actions/contibutor-action";
import { INFURA_ID, NETWORKS } from "./constants";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
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

function App() {
  const loggedIn = useSelector(x=>x.auth.loggedIn)
  const isAdmin = useSelector(x=>x.auth.isAdmin)
  const discord = useSelector(x=>x.contributor.discord_auth)
  const navigate = useNavigate()
  const pathname = window.location.pathname
  const dispatch = useDispatch()

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    
    provider.on("chainChanged", (chainId) => {
      console.log(`CHAIN changed!`);
      if(isAdmin){
        dispatch(setLoggedIn(false))
        dispatch(signout())
        navigate('/')
      }else{
        dispatch(setLoggedIn(false))
        dispatch(signout())
        dispatch(setAdminStatus(false))
        navigate('/')
      }
    });

    provider.on("accountsChanged",async () => {
        console.log(`account changed!`);
        if(isAdmin){
          dispatch(setLoggedIn(false))
          dispatch(signout())
          navigate('/')
        }else{
          dispatch(setLoggedIn(false))
          dispatch(signout())
          dispatch(setAdminStatus(false))
          navigate('/')
        }
    });

    // Subscribe to session disconnection
    // provider.on("disconnect", (code, reason) => {
    //   console.log(code, reason);
    //   logoutOfWeb3Modal();
    // });
  }, [dispatch, navigate]);

  const checkAuth = useCallback( () => {
    const pathCheck = pathname.split('/')
    // console.log(pathCheck)
    if(!loggedIn){
      if(pathCheck[2] === "contributor"){
        dispatch(setAdminStatus(false))
        dispatch(set_invite_id(pathCheck[3]))
      }
    }
  },[dispatch, loggedIn, navigate, pathname])

  useEffect(()=>{
    loadWeb3Modal()
  },[loadWeb3Modal])

  const adminRoutes = () => (
        <Routes>
          {/* {!loggedIn &&  */}
          {/* <> */}
          <Route path='/' element={<AuthWallet />} />
          <Route path='/discord/fallback' element={<DiscordFallback />} />
          {/* </> */}
          {/* } */}
          {/* {loggedIn && */}
          {/* <> */}
          <Route path="/onboard/dao" element={<Onboarding />} />
          <Route path="onboard/contributor/:id" element={<ContributorOnbording />} />
          <Route path="dashboard/:id" element={<Dashboard />} />
          {/* </> */}
          {/* } */}
        </Routes>
  )

  const contributorRoute = () => (
    <Routes>
      {(!loggedIn && !discord) &&
      <>
      <Route path='/auth' element={<AuthWallet />} />
      <Route path='/discord/fallback' element={<DiscordFallback />} />
      </>
      }
      {(loggedIn && discord) &&
      <>
      <Route path="/onboard/dao" element={<Onboarding />} />
      <Route path="onboard/contributor/:id" element={<ContributorOnbording />} />
      <Route path="dashboard" element={<Dashboard />} />
      </>
      }
    </Routes>
)

  return (
    <div className="App">
      <div className="App-header">
        {adminRoutes()}
        {/* {isAdmin?adminRoutes():contributorRoute()} */}
      </div>
    </div>
  );
}

export default App;

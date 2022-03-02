import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    jwt: null,
    provider: null,
    web3Provider: null,
    address:null,
    signer:null,
    chainId: null,
    chain:null,
    loggedIn:false,
    role:null,
    community_roles:[],
    contributorName:'',
    isAdmin:true
  },
  reducers: {
    set_web3(state, action) {
      state.provider = action.payload.provider;
      state.web3Provider = action.payload.web3Provider;
      // state.address = action.payload.address;
      state.chainId = action.payload.chainId;
    },
    set_address(state, action){
      //console.log('signer sett', action.payload.signer)
      state.address = action.payload.address;
      //state.signer = action.payload.signer;
    },
    set_signing(state, action){
      state.jwt = action.payload.jwt
      state.loggedIn = true
    },
    set_loggedIn(state, action){
      state.loggedIn = action.payload.status
    },
    set_contri_setup(state,action){
      state.contributorName = action.payload.name;
      state.role = action.payload.role
    },
    set_community_roles(state, action){
      console.log('rolesss', action.payload.roles)
      state.community_roles = action.payload.roles
    },
    set_admin(state, action){
      console.log('set adim......', action.payload.status)
      state.isAdmin = action.payload.status
    },
    reset_web3(state, action){
      state.provider = null;
      state.web3Provider = null;
      state.address = null;
      state.chainId = null;
    },
    reset_auth(state, action){
      state.jwt= null;
      state.provider= null;
      state.web3Provider= null;
      state.address=null;
      state.chainId=null;
      state.chain= null;
      state.loggedIn= false;
      state.role= null;
      state.community_roles= [];
      state.contributorName ='';
      state.isAdmin=true
    }
}});

export const authActions = authSlice.actions;

export default authSlice;

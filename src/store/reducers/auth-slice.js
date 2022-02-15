import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    jwt: null,
    provider: null,
    web3Provider: null,
    address:null,
    chainId: null,
    chain:null,
    loggedIn:false,
    role:null,
    contributorName:'',
    community_roles:[],
    isAdmin:false
  },
  reducers: {
    set_web3(state, action) {
      state.provider = action.payload.provider;
      state.web3Provider = action.payload.web3Provider;
      // state.address = action.payload.address;
      state.chainId = action.payload.chainId;
    },
    set_address(state, action){
      state.address = action.payload.address;
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
    reset_web3(state, action){
      state.provider = null;
      state.web3Provider = null;
      state.address = null;
      state.chainId = null;
    },
}});

export const authActions = authSlice.actions;

export default authSlice;

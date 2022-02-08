import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "profile",
  initialState: {
    provider: null,
    web3Provider: null,
    address: '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8',
    chainId: null,
    chain:null
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
    reset_web3(state, action){
      state.provider = null;
      state.web3Provider = null;
      state.address = null;
      state.chainId = null;
    },
}});

export const authActions = authSlice.actions;

export default authSlice;

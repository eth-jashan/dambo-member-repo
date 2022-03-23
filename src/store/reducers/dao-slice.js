import { createSlice } from "@reduxjs/toolkit";

const daoSlice = createSlice({
  name: "dao",
  initialState: {
    dao_list:[],
    contribution_request:[],
    payout_request:[],
    payout_filter:[],
    currentDao:null,
    role:null,
    community_role:null,
    gnosis_details:null,
    balance:null,
    balanceUsd:null,
    delegates:[],
    contri_filter:'ACTIVE',
    active_nonce:0,
    contri_filter_key:1,
    initial_setup:false,
    payout_filter_key:1,
  },
  reducers: {
    set_dao_list(state, action){
        state.dao_list = action.payload.list
    },
    setActive_nonce(state, action){
      state.active_nonce = action.payload.nonce
    },
    set_current_dao(state, action){
      state.currentDao = action.payload.dao;
      state.role = action.payload.role;
      state.community_role = action.payload.community_role
    },
    set_contri_list(state, action){
      state.contribution_request = action.payload.list
      state.contri_filter_key = action.payload.number
    },
    set_payout_list(state, action){
      state.payout_request = action.payload.list
    },
    set_filter_list(state, action){
      state.payout_filter = action.payload.list
      state.payout_filter_key = action.payload.number
    },
    set_gnosis_details(state, action){
      state.gnosis_details = action.payload.details
      state.balance = action.payload.balance;
      state.balanceUsd = action.payload.usdBalance;
      state.delegates = action.payload.delegates;
    },
    set_contribution_filter(state, action){
      state.contri_filter_key = action.payload.number;
      state.contribution_request = action.payload.list
    },
    set_initial_setup(state, action){
      state.initial_setup = action.payload.status
    }
}});

export const daoAction = daoSlice.actions;

export default daoSlice;
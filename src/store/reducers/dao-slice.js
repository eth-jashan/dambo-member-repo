import { createSlice } from "@reduxjs/toolkit";

const daoSlice = createSlice({
  name: "dao",
  initialState: {
    dao_list:[],
    contribution_request:[],
    currentDao:null,
    role:null,
    community_role:null,
    gnosis_details:null,
    balance:null,
    balanceUsd:null
  },
  reducers: {
    set_dao_list(state, action){
        state.dao_list = action.payload.list
    },
    set_current_dao(state, action){
      state.currentDao = action.payload.dao;
      state.role = action.payload.role;
      state.community_role = action.payload.community_role
    },
    set_contri_list(state, action){
      state.contribution_request = action.payload.list
    },
    set_gnosis_details(state, action){
      state.gnosis_details = action.payload.details
      state.balance = action.payload.balance;
      state.balanceUsd = action.payload.usdBalance;
    }
}});

export const daoAction = daoSlice.actions;

export default daoSlice;
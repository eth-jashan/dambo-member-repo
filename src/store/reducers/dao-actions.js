import { createSlice } from "@reduxjs/toolkit";

const daoSlice = createSlice({
  name: "dao",
  initialState: {
    dao_list:[],
    currentDao:null,
    role:null,
    community_role:null
  },
  reducers: {
    set_dao_list(state, action){
        state.dao_list = action.payload.list
    },
    set_current_dao(state, action){
      state.currentDao = action.payload.dao;
      state.role = action.payload.role;
      state.community_role = action.payload.community_role
  }
}});

export const daoAction = daoSlice.actions;

export default daoSlice;
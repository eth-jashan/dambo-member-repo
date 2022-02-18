import { createSlice } from "@reduxjs/toolkit";

const daoSlice = createSlice({
  name: "dao",
  initialState: {
    dao_list:[],
    currentDao:null,
    role:null
  },
  reducers: {
    set_dao_list(state, action){
        state.dao_list = action.payload.list
    }
}});

export const daoAction = daoSlice.actions;

export default daoSlice;
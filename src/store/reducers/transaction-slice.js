import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    currentTransaction:null,
    approvedContriRequest:[]
  },
  reducers: {
    set_current_transaction(state, action){
        state.currentTransaction = action.payload.data
    },
    set_approved_request(state, action){
      // state.currentTransaction = action.payload.data
      const newRequestList = state.approvedContriRequest.concat(action.payload.item)
      state.approvedContriRequest = newRequestList
    }
}});

export const tranactionAction = transactionSlice.actions;

export default transactionSlice;
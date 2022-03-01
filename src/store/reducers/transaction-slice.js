import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    currentTransaction:null,
    approvedContriRequest:[],
    pendingTransaction:[],
    currentPayment:null
  },
  reducers: {
    set_current_transaction(state, action){
        state.currentTransaction = action.payload.data
    },
    set_current_payment(state, action){
      state.currentPayment = action.payload.data
    },
    reset_approved_request(state, action){
      state.approvedContriRequest = []
    },
    set_pendin_txs(state, action){
      state.pendingTransaction = action.payload.list
    },
    set_approved_request(state, action){
      // state.currentTransaction = action.payload.data
      const newRequestList = state.approvedContriRequest.concat(action.payload.item)
      state.approvedContriRequest = newRequestList
    }
}});

export const tranactionAction = transactionSlice.actions;

export default transactionSlice;
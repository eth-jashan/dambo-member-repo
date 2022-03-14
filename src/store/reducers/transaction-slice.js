import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    currentTransaction:null,
    approvedContriRequest:[],
    pendingTransaction:[],
    currentPayment:null,
    approved_token_total:[],
    initialETHPrice:null,
    rejectModal:false
  },
  reducers: {
    set_current_transaction(state, action){
        state.currentTransaction = action.payload.data
        state.initialETHPrice = action.payload.price
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
      const newRequestList = state.approvedContriRequest.concat(action.payload.item)
      state.approvedContriRequest = newRequestList
    },
    set_reject_request(state, action){
      const newRequestList = state.approvedContriRequest.filter(x=>x.contri_detail?.id !== action.payload.id)
      state.approvedContriRequest = newRequestList
    },
    set_current_Ethprice(state, action){
      state.initialETHPrice = action.payload.price
    },
    set_reject_modal(state, action){
      console.log(action.payload.status)
      state.rejectModal = action.payload.status
    }
}});

export const tranactionAction = transactionSlice.actions;

export default transactionSlice;
import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    payout: false,
    // signer:null
  },
  reducers: {
    show_payout_toast(state, action) {
        console.log(action.payload.status)
      state.payout = action.payload.status
    },
}});

export const toastAction = toastSlice.actions;

export default toastSlice;
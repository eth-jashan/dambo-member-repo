import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    payout: false,
    loading_state:false,
    payout_data:{
      item:0,
      value:0
    }
    // signer:null
  },
  reducers: {
    show_payout_toast(state, action) {
      state.payout = action.payload.status
      state.payout_data = action.payload.payout_data
    },

    set_loading_state(state,action){
      state.loading_state = action.payload.loading
    }

  }
});

export const toastAction = toastSlice.actions;

export default toastSlice;
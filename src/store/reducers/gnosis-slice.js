import { createSlice } from "@reduxjs/toolkit";

const gnosisSlice = createSlice({
  name: "gnosis",
  initialState: {
    allSafeList:[],
    safeAddress: '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8',
  },
  reducers: {
    set_safeAdress(state, action) {
      state.safeAddress = action.payload.safeAddress;
    },
    set_allSafe(state, action) {
        console.log('safe list ===>', action.payload.list)
        state.allSafeList = action.payload.list;
    },
}});

export const gnosisAction = gnosisSlice.actions;

export default gnosisSlice;
import { createSlice } from "@reduxjs/toolkit";

const gnosisSlice = createSlice({
  name: "gnosis",
  initialState: {
    allSafeList:[],
    newSafeSetup:{
      owners:[],
      threshold:0,
      dao_name:'',
      dao_email:''
    },
    safeAddress: '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8',
  },
  reducers: {
    set_safeAdress(state, action) {
      state.safeAddress = action.payload.safeAddress;
    },
    set_allSafe(state, action) {
        state.allSafeList = action.payload.list;
    },
    set_newSafeOwners(state, action){
        state.newSafeSetup.owners = action.payload.owners
    },
    set_newSafeThreshold(state, action){
      state.newSafeSetup.threshold = action.payload.threshold
    },
    set_dainInfo(state, action){
      console.log('name set', action.payload.name)
      state.newSafeSetup.dao_email = action.payload.email
      state.newSafeSetup.dao_name = action.payload.name
    }
}});

export const gnosisAction = gnosisSlice.actions;

export default gnosisSlice;
import { createSlice } from "@reduxjs/toolkit";

const gnosisSlice = createSlice({
  name: "gnosis",
  initialState: {
    allSafeList:[],
    newSafeSetup:{
      owners:[],
      threshold:0,
      dao_name:'',
      dao_email:'',
      dao_discord:'',
      dao_logo_url:''
    },
    safeAddress: null,
    owners:[],
    threshold:0,
    selectedDao:null,
    allMembership:[]
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
    set_membershipList(state, action){
      state.selectedDao = action.payload.dao
      state.allMembership = action.payload.list
      state.safeAddress = action.payload.safeAddress
    },
    set_dainInfo(state, action){
      console.log("redux===>", action.payload.logo, action.payload.discord)
      state.newSafeSetup.dao_email = action.payload.email
      state.newSafeSetup.dao_name = action.payload.name
      state.newSafeSetup.dao_discord = action.payload.discord
      state.newSafeSetup.dao_logo_url = action.payload.logo
    }
}});

export const gnosisAction = gnosisSlice.actions;

export default gnosisSlice;
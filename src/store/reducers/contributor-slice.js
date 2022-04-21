import { createSlice } from "@reduxjs/toolkit";

const contributorSlice = createSlice({
  name: "contributor",
  initialState: {
    invite_code:null,
    discord_auth:false,
    contributionRequests:[],
    contribution_detail:null,
    unclaimed:[],
    claimed:[],
    claim_loading:{
      status:false,
      id:null
    }
  },
  reducers: {
    set_invite_code(state, action){
      state.invite_code = action.payload.id;
    },
    set_discord(state, action){
      state.discord_auth = action.payload.status;
    },
    set_contribution_detail(state, action){
      state.contribution_detail = action.payload.item;
    },
    set_badges(state, action){
      state.unclaimed = action.payload.unclaimed
      state.claimed = action.payload.claimed
    },
    set_claim_loading(state,action){
      state.claim_loading.status = action.payload.status
      state.claim_loading.id = action.payload.id
    }
}});

export const contributorAction = contributorSlice.actions;

export default contributorSlice;
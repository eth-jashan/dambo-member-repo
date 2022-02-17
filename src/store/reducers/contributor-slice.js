import { createSlice } from "@reduxjs/toolkit";

const contributorSlice = createSlice({
  name: "contributor",
  initialState: {
    invite_code:null,
    discord_auth:false
  },
  reducers: {
    set_invite_code(state, action){
      state.invite_code = action.payload.id;
    },
    set_discord(state, action){
      state.discord_auth = action.payload.status;
    },
}});

export const contributorAction = contributorSlice.actions;

export default contributorSlice;
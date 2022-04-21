import { createSlice } from "@reduxjs/toolkit"

const web3Slice = createSlice({
    name: "auth",
    initialState: {
        chainId: null,
        signer: null,
    },
    reducers: {
        set_signer(state, action) {
            state.signer = action.payload.signer
        },
    },
})

export const web3Action = web3Slice.actions

export default web3Slice

import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        jwt: null,
        provider: null,
        web3Provider: null,
        address: null,
        signer: null,
        chainId: null,
        chain: null,
        loggedIn: false,
        role: null,
        community_roles: [],
        contributorName: "",
        isAdmin: true,
        lastSelection: [],
    },
    reducers: {
        set_web3(state, action) {
            state.provider = action.payload.provider
            state.web3Provider = action.payload.web3Provider
            // state.address = action.payload.address;
            state.chainId = action.payload.chainId
        },
        set_address(state, action) {
            state.address = action.payload.address
            // state.signer = action.payload.signer;
        },
        set_signing(state, action) {
            // console.log("jwt store", action.payload.jwt)
            state.jwt = action.payload.jwt
            state.loggedIn = true
        },
        set_loggedIn(state, action) {
            state.loggedIn = action.payload.status
        },
        set_contri_setup(state, action) {
            state.contributorName = action.payload.name
            state.role = action.payload.role
        },
        set_community_roles(state, action) {
            state.community_roles = action.payload.roles
        },
        set_admin(state, action) {
            state.isAdmin = action.payload.status
        },
        reset_auth(state) {
            console.log("signout function")
            state.jwt = null
            state.provider = null
            state.web3Provider = null
            state.address = null
            state.chainId = null
            state.chain = null
            state.loggedIn = false
            state.role = null
            state.community_roles = []
            state.contributorName = ""
            state.isAdmin = true
        },
        set_last_selection(state, action) {
            if (state.lastSelection) {
                const lastSelection = state.lastSelection
                const isInclude = lastSelection.filter(
                    (x) => x.address === action.payload.address
                )
                if (isInclude.length > 0) {
                    const newSelection = isInclude.filter(
                        (x) => x.address !== action.payload.address
                    )
                    newSelection.push({
                        address: action.payload.address,
                        dao_uuid: action.payload.dao_uuid,
                    })
                    state.lastSelection = newSelection
                } else {
                    lastSelection.push({
                        address: action.payload.address,
                        dao_uuid: action.payload.dao_uuid,
                    })
                    state.lastSelection = lastSelection
                }
            } else {
                // //console.log('initial', action.payload.address, action.payload.dao_uuid)
                state.lastSelection = [
                    {
                        address: action.payload.address,
                        dao_uuid: action.payload.dao_uuid,
                    },
                ]
            }
        },
    },
})

export const authActions = authSlice.actions

export default authSlice

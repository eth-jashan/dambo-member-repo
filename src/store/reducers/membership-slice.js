import { createSlice } from "@reduxjs/toolkit"

const membershipSlice = createSlice({
    name: "membership",
    initialState: {
        membershipBadges: [],
        membershipVoucher: null,
        membershipBadgesForAddress: [],
        membershipBadgeClaimed: null,
        claimMembershipLoading: false,
        claimTakingTime: null,
        disableClaimBtn: false,
        showMetamaskSignText: false,
        txHashFetched: false,
    },
    reducers: {
        setMembershipBadges(state, action) {
            state.membershipBadges = action.payload.membershipBadges
        },
        setMembershipVoucher(state, action) {
            state.membershipVoucher = action.payload.membershipVoucher
        },
        setMembershipBadgesForAddress(state, action) {
            state.membershipBadgesForAddress =
                action.payload.membershipBadgesForAddress
        },
        setMembershipBadgeClaimed(state, action) {
            state.membershipBadgeClaimed = action.payload.membershipBadgeClaimed
        },
        setClaimMembershipLoading(state, action) {
            state.claimMembershipLoading = action.payload.claimMembershipLoading
        },
        setClaimTakingTime(state, action) {
            state.claimTakingTime = action.payload.claimTakingTime
        },
        setDisableClaimBtn(state, action) {
            state.disableClaimBtn = action.payload.disableClaimBtn
        },
        setShowMetamaskSignText(state, action) {
            state.showMetamaskSignText = action.payload.showMetamaskSignText
        },
        setTxHashFetched(state, action) {
            state.txHashFetched = action.payload.txHashFetched
        },
    },
})

export const membershipAction = membershipSlice.actions

export default membershipSlice

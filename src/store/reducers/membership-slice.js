import { createSlice } from "@reduxjs/toolkit"

const membershipSlice = createSlice({
    name: "membership",
    initialState: {
        membershipBadges: [],
        contributorClaimedDataBackend: null,
        membershipVoucher: null,
        membershipBadgesForAddress: [],
        membershipBadgeClaimed: null,
        claimMembershipLoading: false,
        claimTakingTime: null,
        disableClaimBtn: false,
        showMetamaskSignText: false,
        txHashFetched: false,
        selectedMember: null,
        communityMembers: [],
        selectedNav: "badges",
        showMembershipChangeModal: false,
        membershipCreateLoading: false,
        showMembershipCreateModal: false,
        showMembershipMintingModal: false,
        allDaoMembers: null,
        unclaimedMembershipBadges: [],
    },
    reducers: {
        setMembershipBadges(state, action) {
            state.membershipBadges = action.payload.membershipBadges
        },
        setMembershipUnclaimed(state, action) {
            state.unclaimedMembershipBadges = action.payload.unclaimedMembership
        },
        setClaimedDataFromBE(state, action) {
            state.contributorClaimedDataBackend =
                action.payload.contributorClaimedDataBackend
        },
        setDaoMembers(state, action) {
            state.allDaoMembers = action.payload.allDaoMembers
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
        setSelectedMember(state, action) {
            state.selectedMember = action.payload.selectedMember
        },
        setCommunityMembers(state, action) {
            state.communityMembers = action.payload.communityMembers
        },
        setSelectedNav(state, action) {
            state.selectedNav = action.payload.selectedNav
        },
        setShowMembershipChangeModal(state, action) {
            state.showMembershipChangeModal =
                action.payload.showMembershipChangeModal
        },
        setMembershipCreateLoading(state, action) {
            state.membershipCreateLoading =
                action.payload.membershipCreateLoading
        },
        setShowMembershipCreateModal(state, action) {
            state.showMembershipCreateModal =
                action.payload.showMembershipCreateModal
        },
        setShowMembershipMintingModal(state, action) {
            state.showMembershipMintingModal =
                action.payload.showMembershipMintingModal
        },
    },
})

export const membershipAction = membershipSlice.actions

export default membershipSlice

import { createSlice } from "@reduxjs/toolkit"

const contributorSlice = createSlice({
    name: "contributor",
    initialState: {
        contributorSchema: [],
        contributorSchemaId: 0,
        contributorSelectionContribution: false,
        successModal: false,
        contributionBadgeModal: false,
        schemaModal: false,
        invite_code: null,
        discord_auth: false,
        contributionRequests: [],
        contribution_detail: null,
        unclaimed: [],
        claimed: [],
        contributionForContributorApproved: [],
        contributionForContributorPending: [],
        contributionForContributorPast: [],
        claim_loading: {
            status: false,
            id: null,
        },
        daoName: null,
        contribution_counts: null,
        claimLoading: false,
    },
    reducers: {
        set_invite_code(state, action) {
            state.invite_code = action.payload.id
        },
        set_success_modal(state, action) {
            state.successModal = action.payload.status
        },
        set_contribution_badge_modal(state, action) {
            state.contributionBadgeModal = action.payload.status
        },
        set_schema_modal(state, action) {
            state.schemaModal = action.payload.status
        },
        set_contributor_schema(state, action) {
            state.contributorSchema = action.payload.schema
            state.contributorSchemaId = action.payload.id
        },
        set_discord(state, action) {
            state.discord_auth = action.payload.status
        },
        set_contribution_detail(state, action) {
            state.contribution_detail = action.payload.item
        },
        set_badges(state, action) {
            state.unclaimed = action.payload.unclaimed
            state.claimed = action.payload.claimed
        },
        set_claim_loading(state, action) {
            state.claim_loading.status = action.payload.status
            state.claim_loading.id = action.payload.id
        },
        setDaoName(state, action) {
            state.daoName = action.payload.name
        },
        set_contributor_contribution_approved(state, action) {
            state.contributionForContributorApproved = action.payload.approved
        },
        set_contribution_selection(state, action) {
            state.contributorSelectionContribution = action.payload.contribution
        },
        set_contributor_contribution_pending(state, action) {
            state.contributionForContributorPending = action.payload.pending
        },
        set_contributor_contribution_past(state, action) {
            state.contributionForContributorPast = action.payload.past
        },
        set_contribution_counts(state, action) {
            state.contribution_counts = action.payload.contribution_counts
        },
        setClaimLoading(state, action) {
            state.claimLoading = action.payload.claimLoading
        },
    },
})

export const contributorAction = contributorSlice.actions

export default contributorSlice

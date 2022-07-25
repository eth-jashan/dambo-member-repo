import { createSlice } from "@reduxjs/toolkit"

const daoSlice = createSlice({
    name: "dao",
    initialState: {
        daoProxyAddress: false,
        chainId: null,
        allSafeList: [],
        dao_list: [],
        contribution_request: [],
        payout_request: [],
        payout_filter: [],
        currentDao: null,
        role: null,
        community_role: null,
        gnosis_details: null,
        balance: null,
        tokensBalanceInUsd: [],
        NFTs: [],
        delegates: [],
        contri_filter: "ACTIVE",
        active_nonce: 0,
        contri_filter_key: 1,
        initial_setup: false,
        payout_filter_key: 1,
        account_mode: null,
        account_index: 0,
        contribution_id: [],
        contributionOverview: {
            total_payout: [],
            token_info: [],
            total_amount: 0,
        },
        all_payout_request: [],
        all_claimed_badge: [],
        all_approved_badge: [],
        all_unclaimed_badges: [],
        pocp_dao_info: [],
        newSafeSetup: {
            owners: [],
            threshold: 0,
            dao_name: "",
            dao_email: "",
            dao_discord: "",
            dao_logo_url: "",
            safeAddress: null,
        },
        pocp_register: {
            dao_uuid: null,
            name: null,
            owner: null,
        },
        executePaymentLoading: false,
        active_payout_notification: false,
        communityInfo: null,
        approvedBadges: [],
        pastContributions: [],
        username: "",
        safeInfo: false,
    },
    reducers: {
        set_chainId(state, action) {
            state.chainId = action.payload.chainId
        },
        set_proxy_address(state, action) {
            state.daoProxyAddress = action.payload.contract
        },
        set_allSafe(state, action) {
            state.allSafeList = action.payload.list
        },
        set_all_payout_request(state, action) {
            state.all_payout_request = action.payload.list
        },
        set_safeAdress(state, action) {
            state.newSafeSetup.safeAddress = action.payload.safeAddress
        },
        set_dainInfo(state, action) {
            state.newSafeSetup.dao_email = action.payload.email
            state.newSafeSetup.dao_name = action.payload.name
            state.newSafeSetup.dao_discord = action.payload.discord
            state.newSafeSetup.dao_logo_url = action.payload.logo
        },
        set_newSafeOwners(state, action) {
            state.newSafeSetup.owners = action.payload.owners
        },
        set_newSafeThreshold(state, action) {
            state.newSafeSetup.threshold = action.payload.threshold
        },
        set_dao_list(state, action) {
            state.dao_list = action.payload.list
        },
        setActive_nonce(state, action) {
            state.active_nonce = action.payload.nonce
        },
        set_current_dao(state, action) {
            console.log("Daos Set", action.payload.dao)
            state.currentDao = action.payload.dao
            state.role = action.payload.role
            state.community_role = action.payload.community_role
            state.account_mode = action.payload.account_mode
            state.account_index = action.payload.index
            state.username = action.payload.username
        },
        set_contri_list(state, action) {
            state.contribution_request = action.payload.list
            state.contri_filter_key = action.payload.number
        },
        set_payout_list(state, action) {
            state.payout_request = action.payload.list
        },
        set_filter_list(state, action) {
            state.payout_filter = action.payload.list
            state.payout_filter_key = action.payload.number
        },
        set_gnosis_details(state, action) {
            state.balance = action.payload.balance
        },
        set_safe_info(state, action) {
            state.safeInfo = action.payload.details
        },
        set_contribution_filter(state, action) {
            state.contri_filter_key = action.payload.number
            state.contribution_request = action.payload.list
        },
        set_initial_setup(state, action) {
            state.initial_setup = action.payload.status
        },
        switch_account_role(state, action) {
            state.role = action.payload.role
        },
        set_contribution_id(state, action) {
            state.contribution_id = action.payload.cid
        },
        set_contribution_overview(state, action) {
            state.contributionOverview.token_info = action.payload.token_info
            state.contributionOverview.total_amount =
                action.payload.total_amount
            state.contributionOverview.total_payout =
                action.payload.all_paid_contribution
        },
        set_pocp_dao(state, action) {
            state.pocp_dao_info = action.payload.info
        },
        set_execute_payment_loading(state, action) {
            state.executePaymentLoading = action.payload.loadingInfo
        },
        set_pocp_badges(state, action) {
            state.all_claimed_badge = action.payload.claimed
            state.all_approved_badge = action.payload.allApproved
        },
        set_after_claim(state, action) {
            state.contribution_request = action.payload.list
        },
        set_pocp_info(state, action) {
            state.pocp_register = action.payload.info
        },

        set_active_payment_notification(state, action) {
            state.active_payout_notification = action.payload.status
        },

        set_after_approve(state, action) {
            state.contribution_request = action.payload.list
        },
        set_community_info(state, action) {
            state.communityInfo = action.payload.communityInfo
        },
        set_approved_badges(state, action) {
            state.all_approved_badge = action.payload.approvedTokens
        },
        set_claimed_badges(state, action) {
            state.all_claimed_badge = action.payload.claimedTokens
        },
        set_unclaimed_badges(state, action) {
            state.all_unclaimed_badges = action.payload.unclaimedToken
        },
        add_approved_badges(state, action) {
            const approve_list = state.approvedBadges
            const copyCheck = approve_list.filter(
                (x) => x.id === action.payload.contribution?.id
            )
            if (copyCheck.length === 0) {
                approve_list.push(action.payload.contribution)
                state.approvedBadges = approve_list
            }
        },
        reset_approved_badges(state) {
            state.approvedBadges = []
        },
        setTokensBalanceInUsd(state, action) {
            state.tokensBalanceInUsd = action.payload.balanceInUsd
        },
        setNFTs(state, action) {
            state.NFTs = action.payload.NFTs
        },
        setPastContributions(state, action) {
            state.pastContributions = action.payload.pastContributions
        },
    },
})

export const daoAction = daoSlice.actions

export default daoSlice

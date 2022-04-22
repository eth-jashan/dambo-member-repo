import { createSlice } from "@reduxjs/toolkit"

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        currentTransaction: null,
        approvedContriRequest: [],
        pendingTransaction: [],
        currentPayment: null,
        approved_token_total: [],
        initialETHPrice: null,
        rejectModal: false,
    },
    reducers: {
        set_current_transaction(state, action) {
            state.currentTransaction = action.payload.data
            state.initialETHPrice = action.payload.price
        },
        set_current_payment(state, action) {
            state.currentPayment = action.payload.data
        },
        reset_approved_request(state, action) {
            state.approvedContriRequest = []
        },
        set_pendin_txs(state, action) {
            state.pendingTransaction = action.payload.list
        },
        set_approved_request(state, action) {
            const approve_list = state.approvedContriRequest
            const copyCheck = approve_list.filter(
                (x) =>
                    x.contri_detail?.id ===
                    action.payload.item?.contri_detail?.id
            )
            if (copyCheck.length === 0) {
                approve_list.push(action.payload.item)
                state.approvedContriRequest = approve_list
            }
        },
        set_reject_request(state, action) {
            const newRequestList = state.approvedContriRequest.filter(
                (x) => x.contri_detail?.id !== action.payload.id
            )
            state.approvedContriRequest = newRequestList
        },
        set_current_Ethprice(state, action) {
            state.initialETHPrice = action.payload.price
        },
        set_reject_modal(state, action) {
            state.rejectModal = action.payload.status
        },
    },
})

export const tranactionAction = transactionSlice.actions

export default transactionSlice

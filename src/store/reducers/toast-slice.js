import { createSlice } from "@reduxjs/toolkit"

const toastSlice = createSlice({
    name: "toast",
    initialState: {
        payout: false,
        loading_state: true,
        payout_data: {
            item: 0,
            value: 0,
        },
        pocp_action: false,
        toastInfo: {
            toastContent: "",
            toastType: "success",
            toastDuration: 3,
        },
        showToast: false,
    },
    reducers: {
        show_payout_toast(state, action) {
            state.payout = action.payload.status
            state.payout_data = action.payload.payout_data
        },

        set_loading_state(state, action) {
            state.loading_state = action.payload.loading
        },
        set_pocp_action(state, action) {
            state.pocp_action = action.payload.status
        },
        setShowToast(state, action) {
            state.showToast = action.payload.status
        },
        setToastInfo(state, action) {
            state.toastInfo = {
                ...state.toastInfo,
                ...action.payload.toastInfo,
            }
        },
    },
})

export const toastAction = toastSlice.actions

export default toastSlice

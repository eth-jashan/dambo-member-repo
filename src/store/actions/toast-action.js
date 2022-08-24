import { toastAction } from "../reducers/toast-slice"

export const setPayoutToast = (status, payout_data) => {
    return (dispatch) => {
        dispatch(
            toastAction.show_payout_toast({
                status,
                payout_data,
            })
        )
    }
}

export const setLoadingState = (loading) => {
    return (dispatch) => {
        dispatch(toastAction.set_loading_state({ loading }))
    }
}

export const setPocpAction = (status) => {
    return (dispatch) => {
        dispatch(toastAction.set_pocp_action({ status }))
    }
}

export const setShowToast = (status) => {
    return (dispatch) => {
        dispatch(toastAction.setShowToast({ status }))
    }
}

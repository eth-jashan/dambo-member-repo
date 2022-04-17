import { toastAction } from "../reducers/toast-slice";


export const setPayoutToast = (status) => {
    return (dispatch) => {
        dispatch(
          toastAction.show_payout_toast({
            status
          })
        );
    }
};

export const setLoadingState = (loading) => {
  return dispatch => {
    dispatch(
      toastAction.set_loading_state({loading})
    )
  }
}
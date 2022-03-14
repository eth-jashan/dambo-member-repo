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
import { web3Action } from "../reducers/web3-slice";

export const setSigner = (signer) => {
    return (dispatch) => {
        dispatch(
          web3Action.set_signer({
            signer
          })
        );
      }
  };
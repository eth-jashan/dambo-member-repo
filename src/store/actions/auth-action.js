import axios from "axios";
import api from "../../constant/api";
import routes from "../../constant/routes";
import { authActions } from "../reducers/auth-slice";

export const authWithSign = (address, signer) => {
  return async (dispatch, getState) => {
    console.log('signin start')
    // const provider = getState().auth.web3Provider;
    // const signer = provider.getSigner()
    try {
      const responseNonce = await axios.get(`${api.drepute.dev.BASE_URL}${routes.auth.getNonce}?addr=${address}`)
      console.log('response =====>', responseNonce.data)
      const signature = await signer.signMessage(`Signing in to drepute.xyz with nonce ${responseNonce.data.data.nonce}`)
      console.log('address signed', signature)
      try {
        const body = {"add": address,"sig": signature}
        console.log('sign body', body)
        const responseSignature = await axios.post(`${api.drepute.dev.BASE_URL}${routes.auth.getSignature}`,body)
        console.log('sign response', responseSignature)
      } catch (error) {
        console.log('error on signing api', error)
      }
      
    } catch (error) {
      console.log('error on nonce api', error)
    }  
    }
};

export const setProvider = (provider, web3Provider, chainId) => {
  return (dispatch) => {
      dispatch(
        authActions.set_web3({
          provider,
          web3Provider,
          chainId,
        })
      );
    }
};

export const setAddress = (address) => {
  return (dispatch) => {
      dispatch(
        authActions.set_address({address})
      );
    }
};

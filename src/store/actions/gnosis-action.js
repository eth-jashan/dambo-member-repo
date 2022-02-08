import api from "../../constant/api";
import routes from "../../constant/routes";
import { authActions } from "../reducers/auth-slice";
import { gnosisAction } from "../reducers/gnosis-slice";
import SafeServiceClient from '@gnosis.pm/safe-service-client';

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const addSafeAddress = (safeAddress) => {
  return (dispatch) => {
      dispatch(
        gnosisAction.set_safeAdress({safeAddress})
      )
    }
};

export const getAllSafeFromAddress = (address) => {
  return async (dispatch) => {
    const list = await serviceClient.getSafesByOwner(address)
    console.log('list', list.safes)
      dispatch(
        gnosisAction.set_allSafe({list:list.safes})
      )
    }
};
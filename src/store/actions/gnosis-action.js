import api from "../../constant/api";
import routes from "../../constant/routes";
import { gnosisAction } from "../reducers/gnosis-slice";
import SafeServiceClient from '@gnosis.pm/safe-service-client';
// import axios from "axios";
import apiClient from '../../utils/api_client'

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const getAddressMembership = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    try {
      const res = await apiClient.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDaoMembership}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.data.length>0){
          dispatch(gnosisAction.set_membershipList({
            list:res.data.data, 
            safeAddress:res.data.data[0].dao_details.safe_public_address,
            dao: res.data.data[0]
          }))
        return res.data.data[0]
      }else{
        return 0
      }
    } catch (error) {
      return 0
    }
  }
}
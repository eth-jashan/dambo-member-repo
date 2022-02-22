import SafeServiceClient from "@gnosis.pm/safe-service-client"
import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-actions"
import { gnosisAction } from "../reducers/gnosis-slice"

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const getAllDaowithAddress = () => {
  console.log('heree....')
    return async (dispatch, getState) => {
      const jwt = getState().auth.jwt
      
      try {
        const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDaoMembership}`,{
          headers:{
            Authorization:`Bearer ${jwt}`
          }
        })
        console.log(`total daos of ${res.data.data.length}`)
        if(res.data.data.length>0){
            dispatch(daoAction.set_dao_list({
              list:res.data.data,
            }))
            dispatch(daoAction.set_current_dao({
              dao:res.data.data[0].dao_details,
              role: res.data.data[0].access_role,
              community_role: res.data.data[0].community_role
            }))
        }else{
          dispatch(daoAction.set_current_dao({
            dao:[],
            role: null,
            community_role: null
          }))
          return 0
        }
      } catch (error) {
        return 0
      }
    }
}

export const gnosisDetailsofDao = () => {
  return async (dispatch, getState) => {
    const currentDao = getState().dao.currentDao
    try {
      const safeInfo = await serviceClient.getSafeInfo(currentDao?.safe_public_address)
      const balance = await serviceClient.getBalances(currentDao?.safe_public_address)
      const usdBalance = await serviceClient.getUsdBalances(currentDao?.safe_public_address)
      console.log('safe info', balance, usdBalance) 
      dispatch(daoAction.set_gnosis_details({details:safeInfo, balance, usdBalance}))
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const set_dao = (dao) => {
  return (dispatch) => {
    dispatch(daoAction.set_current_dao({
      dao:dao.dao_details,
      role:dao.access_role,
      community_role:dao.community_role
    }))
  }
}
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-slice"
// import { gnosisAction } from "../reducers/gnosis-slice"

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
          dispatch(daoAction.set_dao_list({
            list:[],
          }))
          dispatch(daoAction.set_current_dao({
            dao:null,
            role: null,
            community_role: null
          }))
          return 0
        }
      } catch (error) {
        dispatch(daoAction.set_dao_list({
          list:[],
        }))
        dispatch(daoAction.set_current_dao({
          dao:null,
          role: null,
          community_role: null
        }))
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
      const delegates = await serviceClient.getSafeDelegates(currentDao?.safe_public_address)
      console.log('safe owner........', safeInfo) 
      const tokenType = []
      balance.map((item, index)=>{
        if(item.tokenAddress === null){
          tokenType.push({
            label:'ETH', value:item
          })
        }else{
          tokenType.push({
            label:item.token.symbol, value:item
          })
        }
      })
      dispatch(daoAction.set_gnosis_details({details:safeInfo, balance:tokenType, usdBalance, delegates:safeInfo.owners}))
    } catch (error) {
      console.log('error', error)
      dispatch(daoAction.set_gnosis_details({details:null, balance:null, usdBalance:null, delegates:[]}))
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
    gnosisDetailsofDao()
  }
}

export const getContriRequest = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}/${routes.contribution.createContri}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('Pending request.....', res.data)
        dispatch(daoAction.set_contri_list({
          list:res.data?.data?.contributions
        }))
        return 1
      }else{
        dispatch(daoAction.set_contri_list({
          list:[]
        }))
        return 0
      }
    } catch (error) {
      console.log('error...', error)
      dispatch(daoAction.set_contri_list({
        list:[]
      }))
      return 0
    }
  }
}

export const createPayout = (tranxid) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const transaction = getState().transaction.approvedContriRequest
    const address = getState().auth.address

    let contri_array = []

    transaction.map((item, index) => {
      contri_array.push(item?.contri_detail?.id)
    })
    console.log('number of approval',contri_array)
    const data = {
      initiated_by:address,
      contributions:contri_array,
      gnosis_reference_id:tranxid,
      dao_uuid:uuid
    }
    console.log('data....', data)
    // try {
      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('created payout.....', res.data)
        // dispatch(daoAction.set_contri_list({
        //   list:res.data?.data?.contributions
        // }))
        return 1
      }else{
        return 0
      }
    // } catch (error) {
    //   console.log('error...', error)
    //   return 0
    // }
  }
}
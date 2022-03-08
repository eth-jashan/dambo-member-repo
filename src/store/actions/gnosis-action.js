import api from "../../constant/api";
import routes from "../../constant/routes";
import { gnosisAction } from "../reducers/gnosis-slice";
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import axios from "axios";

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')



export const addSafeAddress = (safeAddress) => {
  return (dispatch) => {
      dispatch(
        gnosisAction.set_safeAdress({safeAddress})
      )
    }
};

export const addOwners = (owners) => {
  return (dispatch) => {
      dispatch(
        gnosisAction.set_newSafeOwners({owners})
      )
    }
};

export const addThreshold = (threshold) => {
  return (dispatch) => {
      dispatch(
        gnosisAction.set_newSafeThreshold({threshold})
      )
    }
};

export const addDaoInfo = (name, email) => {
  return (dispatch) => {
      dispatch(
        gnosisAction.set_dainInfo({email, name})
      )
    }
};

export const getDao = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDao}`,
        {
          headers:{
            Authorization:`Bearer ${jwt}`
          }
        }
      )
  } catch (error) {
    console.log('error in fetching dao.....', error)    
  }
  }
}

export const registerDao = () => {
  return async (dispatch, getState) => {
      
    const jwt = getState().auth.jwt
    const address = getState().auth.address
    const owners = getState().gnosis.newSafeSetup.owners
    const safeAddress = getState().gnosis.safeAddress
    const threshold = getState().gnosis.newSafeSetup.threshold
    const name = getState().gnosis.newSafeSetup.dao_name
    const owner = []

    owners.map((item,index)=>(
      owner.push({ public_address:item.address, name:item.name})
    ))

    const data = {
      dao_name:name,
      safe_addr:safeAddress,
      by:address,
      signers:owner,
      signs_required:threshold
    }
    
    try {
        const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.dao.registerDao}`,data,
          {
            headers:{
              Authorization:`Bearer ${jwt}`
            }
          }
        )

        if(res.data.success){
          return res.data.data.dao_uuid
        }else{
          return 0
        }
    } catch (error) {
      console.log('error in registering.....', error)    
    }
    }
};

export const getAllSafeFromAddress = (address) => {
  return async (dispatch, getState) => {
    const list = await serviceClient.getSafesByOwner(address)
    let daos = []
    for(let i = 0; i< list.safes.length; i++){
      daos.push(`safe=${list.safes[i]}`)
    }
    daos = daos.toString()
    daos = daos.replace(/,/g, '&')
    const jwt = getState().auth.jwt
    const res = await axios.get(`${api.drepute.dev.BASE_URL}/${routes.dao.getOurSafes}?${daos}`,
    {
      headers:{
        Authorization:`Bearer ${jwt}`
      }
    }
    )
    dispatch(
      gnosisAction.set_allSafe({list:res.data.data})
    )
    }
};

export const getAddressMembership = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDaoMembership}`,{
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
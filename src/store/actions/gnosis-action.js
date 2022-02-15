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

export const registerDao = () => {
  return async (dispatch, getState) => {
      
    const jwt = getState().auth.jwt
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
      by:owners[0].address,
      signers:owner,
      signs_required:threshold
    }

    console.log('safe address.....data',JSON.stringify(data))
    
    try {
        const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.dao.registerDao}`,data,
          {
            headers:{
              Authorization:`Bearer ${jwt}`
            }
          }
        )
        console.log('resss', res.data)
    } catch (error) {
      console.log('error in registering.....', error)    
    }
    }
};

export const getAllSafeFromAddress = (address) => {
  return async (dispatch, getState) => {
    const list = await serviceClient.getSafesByOwner(address)
    console.log('list', list.safes)
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
    console.log('safes....', res.data)
    dispatch(
      gnosisAction.set_allSafe({list:res.data.data})
    )
    }
};

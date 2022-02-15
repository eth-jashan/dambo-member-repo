import axios from "axios";
import api from "../../constant/api";
import routes from "../../constant/routes";
import { authActions } from "../reducers/auth-slice";

export const authWithSign = (address, signer) => {
  return async (dispatch, getState) => {
    console.log('signin start')
    try {
      const responseNonce = await axios.get(`${api.drepute.dev.BASE_URL}${routes.auth.getNonce}?addr=${address}`)
      console.log('response nounce =====>',address, responseNonce.data.data.nonce)
      const signature = await signer.signMessage(`Signing in to drepute.xyz with nonce ${responseNonce.data.data.nonce}`)
      console.log('address signed', signature)
      try {
        const data = {addr:address, sig:signature}
        console.log('sign body', data)
        const responseSignature = await axios.post(`${api.drepute.dev.BASE_URL}${routes.auth.getSignature}`,data)
        console.log('sign response', responseSignature.data)
        if(responseSignature.data.success){
          dispatch(authActions.set_signing({jwt:responseSignature.data.data.token}))
          localStorage.setItem(address, JSON.stringify({jwt:responseSignature.data.data.token, time:new Date()}))
          return 1
        }
      } catch (error) {
        console.log('error on signing api', error)
        return 0
      }
      
    } catch (error) {
      console.log('error on nonce api', error)
      return 0
    }  
    }
};

export const getJwt = (address) => {
  return(dispatch)=>{
    const jwtInfo = JSON.parse(localStorage.getItem(address))
    if(jwtInfo?.jwt){
      const currentTime = new Date()
      const createdTime = new Date(jwtInfo.time)
      console.log('datessss.....', currentTime, createdTime)
      let diffInMilliseconds = Math.abs(currentTime - createdTime);
      const hours = diffInMilliseconds/36e5
      console.log('calculated hours.........',hours);
      console.log('availabe !!!!', jwtInfo.jwt)
      if(hours<= 23){
      dispatch(authActions.set_signing({jwt:jwtInfo.jwt}))
      return 1
    }
    return 0
    }else{
      console.log('not availabe !!!!')
      dispatch(authActions.set_signing({jwt:false}))
      return 0
    }
  }
}

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
      console.log('setting new address.....', address)
      dispatch(
        authActions.set_address({address})
      );
    }
};

export const setLoggedIn = (status) => {
  return (dispatch) => {
      console.log('changing status.....', status)
      dispatch(
        authActions.set_loggedIn({status})
      );
    }
};

export const setContriInfo = (name, role) => {
  return (dispatch) => {
      console.log('changing status.....', name, role)
      dispatch(
        authActions.set_contri_setup({name, role})
      );
    }
};

export const getCommunityRole = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}/${routes.dao.getCommunityRole}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        let roles = []
        res.data.data.map((item, index)=>{
          roles.push({value: item, label: item})
        })
        console.log('community roles....', roles)
        dispatch(authActions.set_community_roles({roles}))
      }
    } catch (error) {
      
    }
  }
}

export const joinContributor = (id) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const address = getState().auth.address
    const role = getState().auth.role
    const contributorName = getState().auth.contributorName

    const data = {
      addr : address,
      name : contributorName,
      community_role : role.value
    }

    try {
      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.dao.joinContributor}/${id}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        let roles = []
        res.data.data.map((item, index)=>{
          roles.push({value: item, label: item})
        })
        console.log('community roles....', res.data)
        return 1
      }else{
        return 0
      }
    } catch (error) {
      
    }
  }
}

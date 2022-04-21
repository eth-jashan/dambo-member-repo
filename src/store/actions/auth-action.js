import axios from "axios";
import api from "../../constant/api";
import routes from "../../constant/routes";
import { authActions } from "../reducers/auth-slice";
import { contributorAction } from "../reducers/contributor-slice";
import apiClient from "../../utils/api_client";

export const getAuthToken = () => {
  return async (dispatch, getState)=>{
    const jwt = getState().auth.jwt
    const res = await axios.get('https://staging.api.drepute.xyz/auth/fetch_api_token',{
      headers: {
        Authorization:`Bearer ${jwt}`
      }
    })
    if(res.data.success){
      return res.data.data.data.token
    }
  }
}

export const authWithSign = (address, signer) => {
  return async (dispatch, getState) => {
    try {
      const responseNonce = await apiClient.get(`${api.drepute.dev.BASE_URL}${routes.auth.getNonce}?addr=${address}`)
      const signature = await signer.signMessage(`Signing in to drepute.xyz with nonce ${responseNonce.data.data.nonce}`)
      try {
        const data = {addr:address, sig:signature}
        const responseSignature = await apiClient.post(`${api.drepute.dev.BASE_URL}${routes.auth.getSignature}`,data)
        if(responseSignature.data.success){
          dispatch(authActions.set_signing({jwt:responseSignature.data.data.token}))
          localStorage.setItem(address, JSON.stringify({jwt:responseSignature.data.data.token, time:new Date()}))
          return 1
        }
      } catch (error) {
        //console.log('error on signing api', error)
        return 0
      }
      
    } catch (error) {
      //console.log('error on nonce api', error)
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
      let diffInMilliseconds = Math.abs(currentTime - createdTime);
      const hours = diffInMilliseconds/36e5
      if(hours<= 2){
        dispatch(authActions.set_signing({jwt:jwtInfo.jwt}))
        return 1
    }
    return 0
    }else{
      dispatch(authActions.set_signing({jwt:false}))
      return 0
    }
  }
}

export const retrieveAddress = () => {
  
  return (dispatch)=>{
    const address = JSON.parse(localStorage.getItem('current_address'))
    if(address){
      dispatch(
        authActions.set_address({address})
      )
    }else{
      return 0
    }
  }
}

export const setAddress = (address, signer) => {
  return (dispatch) => {
      // //console.log('setting new address.....', address)
      localStorage.setItem('current_signer',signer)
      dispatch(
        authActions.set_address({address})
      );
    }
};

export const setLoggedIn = (status) => {
  return (dispatch) => {
      //console.log('changing status.....')
      dispatch(
        authActions.set_loggedIn({status})
      );
    }
};

export const setContriInfo = (name, role) => {
  return (dispatch) => {
      dispatch(
        authActions.set_contri_setup({name, role})
      );
    }
};

export const setAdminStatus = (status) => {
  return (dispatch) => {
      // //console.log('changing status.....', name, role)
      dispatch(
        authActions.set_admin({status})
      );
    }
};

export const signout = () => {
  return(dispatch)=>{
    dispatch(
      authActions.reset_auth()
    )
  }
}

export const getCommunityRole = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    try {
      const res = await apiClient.get(`${api.drepute.dev.BASE_URL}/${routes.dao.getCommunityRole}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        let roles = []
        res.data.data.map((item, index)=>{
          roles.push({value: item, label: item})
        })
        
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
      const res = await apiClient.post(`${api.drepute.dev.BASE_URL}${routes.dao.joinContributor}/${id}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        dispatch(contributorAction.set_discord({status:false}))
        return 1
      }else{
        return 0
      }
    } catch (error) {
      return 0
    }
  }
}

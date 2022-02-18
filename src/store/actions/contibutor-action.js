import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"

export const set_invite_id = (id) => {
    return (dispatch) => {
        console.log('idddddddd', id)
        dispatch(contributorAction.set_invite_code({id}))
    }
}

export const setDiscordOAuth = (address,id, jwt) => {
    return (dispatch)=>{
        localStorage.setItem('discord', JSON.stringify({address, id, jwt}))   
    }
}

export const getRole = (uuid) => {
    return async (dispatch, getState)=>{
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const data = {
            uuid,
            wallet_addr:address
        }
        const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.dao.getRole}`,data,{
            headers:{
                Authorization:`Bearer ${jwt}`
            }
        })
        if(res.data.success){
            console.log('data.....', res.data.data)
        }
    }
}

export const getDiscordOAuth = (code) => {
    return (dispatch)=>{
    const data = JSON.parse(localStorage.getItem('discord'))
    console.log('dataaa', data)
    if(data){
        dispatch(authActions.set_address({address:data.address}))
        dispatch(authActions.set_signing({jwt:data.jwt}))
        dispatch(contributorAction.set_invite_code({id:data.id}))
        dispatch(authActions.set_admin({status:false}))
        dispatch(authActions.set_loggedIn({status:true}))
        dispatch(contributorAction.set_discord({status:code}))
        return 1
    }else{
        dispatch(authActions.set_admin({status:false}))
        return 0
    }
}
}
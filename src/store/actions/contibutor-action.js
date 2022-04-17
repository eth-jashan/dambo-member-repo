import axios from "axios"
import { ethers } from "ethers"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { web3 } from "../../constant/web3"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"
import POCPProxy from '../../smartContract/POCP_Contracts/POCP.json'
import { POCP_APPROVED_TOKEN, POCP_CLAIMED_TOKEN } from "../../utils/subgraphQuery"
import {createClient} from 'urql'

export const set_invite_id = (id) => {
    return (dispatch) => {
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
            
            if(res.data.data.role === 'NO_ROLE'){
               return false 
            }else{
                return res.data.data.role
            }
            
        }else{
            return false
        }
    }
}

export const getDiscordOAuth = (code) => {
    return (dispatch)=>{
    const data = JSON.parse(localStorage.getItem('discord'))
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

export const createContributionrequest = (title, type, link, time, comments) => {
    return  async (dispatch, getState) => {
        
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt
        
        const data = {
            dao_uuid : uuid,
            stream : type,
            title,
            description:comments,
            link,
            time_spent:time
        }
        try {
            const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}`,data,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                }
            })
            
            if(res.data.success){
                console.log('suucessfully created !')
                return 1
            }else{
                return 0
            }
        } catch (error) {
            console.log('error....', error)
        }
    }
}

export const setContributionDetail = (item) => {
    return (dispatch) => {
        dispatch(contributorAction.set_contribution_detail({item}))
    }
}

export const getAllBadges = (signer, address,communityId) => {
    return async (dispatch, getState) => {
        // let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
        const cid = getState().dao.contribution_id
        const query_claimed = POCP_CLAIMED_TOKEN
        const query_approved = POCP_APPROVED_TOKEN

        const client = createClient({
            url:api.subgraph.url
        })

        try {
            let unclaimed = []
            const resApproved = await client.query(query_approved).toPromise()
            const resClaimed = await client.query(query_claimed).toPromise()
            const claimed = resClaimed.data?.pocpTokens.filter(x=>ethers.utils.hexlify(x.claimer) === ethers.utils.hexlify(address)&&x?.community?.id === communityId)
            const allApproved = resApproved?.data?.approvedTokens.filter(x=>x?.community?.id === communityId)
            const claimed_identifier  = []
            
            //filtering out current unclaimed token
                allApproved.map((x,i)=>{
                    let isClaimed = claimed.filter(y=>y.id === x?.id)
                    if(isClaimed.length===0){
                        cid.map((y, index)=>{
                            if(y.id.toString() === x.identifier){
                                unclaimed.push(x)
                            }
                        })
                    }
                    claimed.filter((z)=>{
                        if(x.id === z.id){
                            claimed_identifier.push({...z, identifier:x?.identifier})
                        }
                    })
                }) 

                

            
            console.log('unclaimed',cid,unclaimed)
            dispatch(contributorAction.set_badges({claimed:claimed_identifier, unclaimed}))
        } catch (error) {
            console.log('error: ', error.toString())
        }
    }
    // const 
} 
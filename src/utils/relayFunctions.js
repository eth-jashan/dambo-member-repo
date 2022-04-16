import axios from "axios"
import { ethers } from "ethers"
import Web3 from "web3"
import api from "../constant/api"
import routes from "../constant/routes"
import { web3 } from "../constant/web3"

export const relayFunction = async(token, functionType, request, signature) => {

    const data = {
        function: functionType,
        request_data:request,
        signature: signature,
        callback_api:'https://staging.api.drepute.xyz/eth/callback'
    }
    console.log('relayer', token, JSON.stringify(data))
    try {
        const res = await axios.post(`https://staging.api.drepute.xyz:5001${routes.pocp.relay}`,data,{
            headers: {
                "X-Authentication": token,
            }
        })

      return res.data.data.hash
        
    } catch (error) {
        console.log('relay api error', error.toString())
    }
}

export const uplaodApproveMetaDataUpload = async(approveContri) => {
    const data = {
        contribution_meta_array:approveContri
    }
    try {
        const res = await axios.post('http://localhost:3001/upload?',data)
        console.log(res)
        if(res){
            return 1
        }
    } catch (error) {
        console.log('error on uploading', error.toString())
    }
}


export const updatePocpRegister = async(jwt,tx_hash, dao_uuid) => {

    const data = {tx_hash, dao_uuid}
      
    try {
          const res = await axios.post(`${api.drepute.dev.BASE_URL}/dao/update/pocp`,data,
            {
              headers:{
                Authorization:`Bearer ${jwt}`
              }
            }
          )
          if(res.data.success){
            console.log( res.data.data.dao_uuid)
          }else{
            return 0
          }
    } catch (error) {
        console.log('error in registering.....', error)    
    }
}

export const updatePocpClaim = async(jwt,tx_hash, dao_uuid) => {

    const data = {tx_hash, dao_uuid}
      
    try {
          const res = await axios.post(`${api.drepute.dev.BASE_URL}/update/pocp`,data,
            {
              headers:{
                Authorization:`Bearer ${jwt}`
              }
            }
          )
          if(res.data.success){
            console.log( res.data.data.dao_uuid)
          }else{
            return 0
          }
    } catch (error) {
        console.log('error in registering.....', error)    
    }
}

const buildQuery = (cid) => {
  let cid_and_array = []

  cid?.map((x,i)=>{
    cid_and_array.push((`cid=${x}`).toString())
  })
  let queryString = cid_and_array.toString()
  queryString = queryString.replace(/,/g, '&')
  console.log('query', queryString)
  return queryString
}

export const getIpfsUrl = async(jwt, dao_uuid, cid) => {
  
  try {
    const query = buildQuery(cid)
    console.log('query====', query)
    const res = await axios.get(`${api.drepute.dev.BASE_URL}/contrib/get/ipfs?${query}&dao_uuid=${dao_uuid}`,
    {
      headers:{
        Authorization:`Bearer ${jwt}`
      }
    })
    console.log('ress....', res.data.data)
    if(res.data?.data?.contributions?.length>0){
      let cid = []
      let url = []
      res.data?.data?.contributions?.map((item, index)=>{
        // cid.push(item?.)
        cid.push(Web3.utils.hexToBytes(Web3.utils.stringToHex(item?.id.toString())))
        url.push(`https://ipfs.infura.io/ipfs/${item?.ipfs_url}`)
      })
      return {cid, url}
    }else{
      return false
    }
  } catch (error) {
    console.log('error',error.toString())
    return false
  }
}

export const getMetaInfo = async(url) => {
  const res = await axios.get(url)
  if(res.status){
    console.log('resss', res.data)
    return res.data
  }
}
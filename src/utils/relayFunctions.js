import axios from "axios"
import api from "../constant/api"
import routes from "../constant/routes"

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
        const res = await axios.post('http://staging.api.drepute.xyz:3001/upload?',data)
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
          const res = await axios.post(`${api.drepute.dev.BASE_URL}dao/update/pocp`,data,
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
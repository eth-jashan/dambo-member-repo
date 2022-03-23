import SafeServiceClient from "@gnosis.pm/safe-service-client"
import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
// import { gnosisAction } from "../reducers/gnosis-slice"

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const getAllDaowithAddress = () => {
  
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

export const set_contri_filter = (filter_key, number) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      console.log('res data', res.data.success)
      if(res.data.success){
        if(filter_key === 'APPROVED'){
          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            number:2,
            list:res.data?.data?.contributions?.filter(x=>x.status === "APPROVED")
          }))
        } else if( filter_key === 'ACTIVE'){

          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            number:1,
            list:res.data?.data?.contributions?.filter(x=>x.payout_status === null && x.status!=='REJECTED'&& x.tokens.length===0)
          })) 
        }else if( filter_key === 'ALL'){
          
          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            number:0,
            list:res.data?.data?.contributions
          })) 
        }
         else {

          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            number:number,
            list:[]
          })) 
        }
        // return 1
      }else{
        // dispatch(daoAction.set_contri_list({
        //   list:[]
        // }))
        dispatch(daoAction.set_contribution_filter({
          key:filter_key,
          number:number,
          list:[]
        }))
        // return 0
      }
    } catch (error) {
      console.log('error...', error)
      dispatch(daoAction.set_contri_list({
        list:[],
        key:filter_key,
        number:number
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

export const set_active_nonce = (nonce) => {
  return (dispatch) => {
    dispatch(daoAction.setActive_nonce({
      nonce
    }))
  }
}


export const getContriRequest = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const approvedContriRequest = getState().transaction.approvedContriRequest
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      console.log('Pending Contri request.....',res.data)
      if(res.data.success){
        res.data?.data?.contributions.map((item, index)=>{
          let payout = []
          if(item?.tokens.length>0 && item.payout_status === null && item?.status !== 'REJECTED'){
            item?.tokens.map((x, index)=>{
              payout.push(
                {
                  amount:x?.amount,
                  token_type:{
                    token:x?.details
                  },
                  address:x?.addr,
                  usd_amount:x?.usd_amount
                })
            })
          }
          const include_payout = approvedContriRequest.filter(x=>x.contri_detail.id === item.id)
          if(payout.length>0 && include_payout.length===0)dispatch(tranactionAction.set_approved_request({item:{contri_detail:item, payout:payout}}))
        })
        dispatch(daoAction.set_contri_list({
          list:res.data?.data?.contributions.filter(x=>x.payout_status === null && x.status!=='REJECTED'&& x.tokens.length===0),
          number:1
        }))
        return 1
      }else{
        dispatch(daoAction.set_contri_list({
          list:[],
          number:1
        }))
        return 0
      }
    } catch (error) {
      console.log('error...', error)
      dispatch(daoAction.set_contri_list({
        list:[],
        number:1
      }))
      return 0
    }
  }
}

export const getPayoutRequest = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const safe_address = getState().dao.currentDao?.safe_public_address
    const uuid = getState().dao.currentDao?.uuid
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      
      const pendingTxs = await serviceClient.getPendingTransactions(safe_address)
      
      let list_of_tx = []
      if(res.data.success){
        //filtering out drepute pending txs from gnosis

        res.data?.data?.payouts.map((item, index)=>{
          pendingTxs.results.map((x,i)=>{
            if(item.gnosis_reference_id === x.safeTxHash){
              list_of_tx.push({gnosis:x, metaInfo:item})
            }
          })
        })

        let tx = []
        let nonce_inserted = []
        //checking rejected tx and updated tx
        list_of_tx.map((item, i)=>{
          pendingTxs.results.map((x)=>{
            if(item.gnosis.nonce === x.nonce){
              if(x.data === null && x.value === '0'){
                if(!nonce_inserted.includes(x.nonce)){
                  tx.push({gnosis:x, metaInfo:item.metaInfo,status:'REJECTED'})
                  nonce_inserted.push(x.nonce)
                }else{
                  let same_nonce = tx.filter(y=>y.gnosis.nonce === x.nonce)
                  console.log(x.safeTxHash, same_nonce)
                  if(same_nonce[0].status === "APPROVED"){
                    tx.map((item, index) => {
                      if(item.gnosis.nonce === x.nonce){
                        tx[index] = {gnosis:x, metaInfo:item.metaInfo,status:'REJECTED'}
                      }
                    })
                  }
                }
              }else{
                if(!nonce_inserted.includes(x.nonce)){
                  tx.push({gnosis:x, metaInfo:item.metaInfo,status:'APPROVED'})
                  nonce_inserted.push(x.nonce)
                } 
              }
            }
          })
        })
        
        const updateTx = []
        tx.map((item, index)=>{
          updateTx.push({
            payout_id:item?.metaInfo?.id,
            gnosis_reference_id:item?.gnosis?.safeTxHash,
            is_executed:false,
            status:item?.status
          })
        })
        dispatch(daoAction.set_payout_list({
          list:tx
        }))
        if(updateTx.length>0){
          const data = {
            dao_uuid:uuid,
            data:updateTx
          }
  
          try {
            await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.updatePayout}`,data,{
              headers:{
                Authorization:`Bearer ${jwt}`
              }
            })
            console.log('DB synced with all pending payments')
          } catch (error) {
            console.log('error while updating gnosis', error)
          }
        }
      }
      else{
        // dispatch(daoAction.set_contri_list({
        //   list:[]
        // }))
        return 0
      }
    } catch (error) {
      console.log('error...', error)
      // dispatch(daoAction.set_contri_list({
      //   list:[]
      // }))
      return 0
    }
  }
}

export const set_payout_filter = (filter_key, number) => {

  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const safe_address = getState().dao.currentDao?.safe_public_address
    const uuid = getState().dao.currentDao?.uuid
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      
      const pendingTxs = await serviceClient.getMultisigTransactions(safe_address)
      
      let list_of_tx = []
      if(res.data.success){
        //filtering out drepute txs from gnosis
        res.data?.data?.payouts.map((item, index)=>{
          pendingTxs.results.map((x,i)=>{
            if(item.gnosis_reference_id === x.safeTxHash && item.is_executed){
              list_of_tx.push({gnosis:x, metaInfo:item, status:item.request_type})
            }
          })
        })
        const pending_txs = getState().dao.payout_request
        
        if(filter_key === 'PENDING'){
          
          dispatch(daoAction.set_filter_list({
            key:filter_key,
            number:number,
            list:pending_txs
          }))
        }else if(filter_key === 'ALL'){
          const all_payout = pending_txs.concat(list_of_tx)
          
          dispatch(daoAction.set_filter_list({
            key:filter_key,
            number:number,
            list:all_payout
          }))
        }else if(filter_key === 'APPROVED'){
          const pending = pending_txs.filter(x=>x.status === filter_key)
          
          dispatch(daoAction.set_filter_list({
            key:filter_key,
            number:number,
            list:pending
          }))
        }else if(filter_key === 'REJECTED'){
          const pending = pending_txs.filter(x=>x.status === filter_key)
          
          dispatch(daoAction.set_filter_list({
            key:filter_key,
            number:number,
            list:pending
          }))
        }else if(filter_key === 'PAID'){
          
          dispatch(daoAction.set_filter_list({
            key:filter_key,
            number:number,
            list:list_of_tx
          }))
        }
      }
      else{
        dispatch(daoAction.set_filter_list({
          list:[],
          key:filter_key,
          number:number,
        }))
        return 0
      }
    } catch (error) {
      console.log('error...', error)
      dispatch(daoAction.set_filter_list({
        list:[],
        key:filter_key,
        number:number,
      }))
      return 0
    }
  }

}

export const syncTxDataWithGnosis = () => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const safe_address = getState().dao.currentDao?.safe_public_address
    const uuid = getState().dao.currentDao?.uuid
    try {
      const payouts = await axios.get(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })


      const allTx = await serviceClient.getMultisigTransactions(safe_address)
      const updatedTX = []
      
      let nonce_inserted = []

      allTx.results.map((item, index)=>{
        
          payouts.data.data.payouts.map((x, i)=>{
            if(x.nonce === item.nonce && (x.request_type === "APPROVED"||x.request_type === 'REJECTED') && !x.is_executed){
              if(item.isExecuted){
                if(item.data === null && item.value === '0'){
                  //Rejected with isExecuted
                  if(!nonce_inserted.includes(item.nonce)){
                  nonce_inserted.push(item.nonce)
                  updatedTX.push({
                    payout_id:x.id,
                    gnosis_reference_id:item.safeTxHash,
                    is_executed:true,
                    status:'REJECTED'
                  })
                }
                }else{
                  //Approved with isExecuted
                  if(!nonce_inserted.includes(item.nonce)){
                    nonce_inserted.push(item.nonce)
                    updatedTX.push({
                      payout_id:x.id,
                      gnosis_reference_id:item.safeTxHash,
                      is_executed:true,
                      status:'APPROVED'
                    })
                  }
                }
              }
            }
          })
        })
      // console.log('updated array.....',updatedTX)
      if(updatedTX.length>0){

        const data = {
          dao_uuid:uuid,
          data:updatedTX
        }

        try {
          await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.updatePayout}`,data,{
            headers:{
              Authorization:`Bearer ${jwt}`
            }
          })
          console.log('DB synced with all executed payments')
        } catch (error) {
          console.log('error while updating gnosis', error)
        }
      }

      
    } catch (error) {
      console.log('error...', error)
      // dispatch(daoAction.set_contri_list({
      //   list:[]
      // }))
      return 0
    }
  }
}

export const getNonceForCreation = async(safe_address) => {
    try {
      const pendingTxs = await serviceClient.getPendingTransactions(safe_address)
      console.log('nonce for creation', pendingTxs)
      return pendingTxs.countUniqueNonce
    } catch (error) {
      
    }
}


export const createPayout = (tranxid, nonce, isExternal= false) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const transaction = getState().transaction.approvedContriRequest
    

    let contri_array = []

    transaction.map((item, index) => {
      contri_array.push(item?.contri_detail?.id)
    })
    
    const data = {
      contributions:contri_array,
      gnosis_reference_id:tranxid,
      dao_uuid:uuid,
      nonce:nonce
    }
    const data_external = {
      gnosis_reference_id:tranxid,
      dao_uuid:uuid,
      nonce:nonce
    }
    console.log('data....', JSON.stringify(isExternal?data_external:data))

      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}`,isExternal?data_external:data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('created payout.....', res.data)
        return 1
      }else{
        return 0
      }
  }
}

export const createExternalPayment = (tranxid, nonce, payout, description) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const transaction = getState().transaction.approvedContriRequest

    let newPayout = []

    payout.map((item, index)=>{
      if(!item?.token_type){
          newPayout.push({
              amount: item.amount,
              usd_amount: item?.usd_amount,
              address: item?.address,
              details: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: "18",
                  logo_url: "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png",
                  address:''
              }
          })
      }else{
          newPayout.push({
              amount: item.amount,
              usd_amount: item?.usd_amount,
              address: item?.address,
              details: {
                  name: item?.token_type?.token?.name,
                  symbol: item?.token_type?.token?.symbol,
                  decimals: item?.token_type?.token?.decimals,
                  logo_url: item?.token_type?.token?.logoUri,
                  address:item?.token_type?.token?.tokenAddress
              }
          })
      }
  })
    
    
    const data = {
      gnosis_reference_id:tranxid,
      dao_uuid:uuid,
      nonce:nonce,
      tokens:newPayout,
      description:description
    }
    console.log('data....', JSON.stringify(data))

      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.externalPayout}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('created payout.....', res.data)
        return 1
      }else{
        return 0
      }
  }
}

export const set_initial_setup = (status) => {
  return (dispatch) => {
    dispatch(daoAction.set_initial_setup({status}))
  }
}

// export const signingPayout = (payId) => {
//   return async (dispatch, getState) => {
//     const jwt = getState().auth.jwt
//     const uuid = getState().dao.currentDao?.uuid

//     const data = {
//       dao_uuid:uuid,
//       payout_id:payId
//     }
//     console.log('data....', JSON.stringify(data))

//       // const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.signPayout}`,data,{
//       //   headers:{
//       //     Authorization:`Bearer ${jwt}`
//       //   }
//       // })
//       // if(res.data.success){
//       //   console.log('signed payout.....', res.data)
//       //   return 1
//       // }else{
//       //   return 0
//       // }
//   }
// }

// export const executePayout = (payId) => {
//   return async (dispatch, getState) => {
//     const jwt = getState().auth.jwt
//     const uuid = getState().dao.currentDao?.uuid

//     const data = {
//       dao_uuid:uuid,
//       payout_id:payId
//     }
//     console.log('data....', JSON.stringify(data))

//       const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.execute}`,data,{
//         headers:{
//           Authorization:`Bearer ${jwt}`
//         }
//       })
//       if(res.data.success){
//         console.log('signed payout.....', res.data)
//         return 1
//       }else{
//         return 0
//       }
//   }
// }

// export const rejectPayout = (hash,payId) => {
//   return async (dispatch, getState) => {
//     const jwt = getState().auth.jwt
//     const uuid = getState().dao.currentDao?.uuid

//     const data = {
//       dao_uuid:uuid,
//       payout_id:payId,
//       gnosis_reference_id:hash
//     }


//       const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.reject}`,data,{
//         headers:{
//           Authorization:`Bearer ${jwt}`
//         }
//       })
//       if(res.data.success){
//         console.log('signed reject payout.....', res.data)
//         return 1
//       }else{
//         return 0
//       }
//   }
// }
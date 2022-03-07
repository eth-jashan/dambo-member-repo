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

export const set_contri_filter = (filter_key) => {
  return async (dispatch, getState) => {
    console.log('filterrr', filter_key === 'ALL')
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
            list:res.data?.data?.contributions?.filter(x=>x.status === "APPROVED")
          }))
        } else if( filter_key === 'ACTIVE'){

          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            list:res.data?.data?.contributions?.filter(x=>x.status !== "APPROVED")
          })) 
        }else if( filter_key === 'ALL'){
          console.log('all request', res.data?.data?.contributions)
          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            list:res.data?.data?.contributions
          })) 
        }
         else {

          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
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
          list:[]
        }))
        // return 0
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

export const gnosisDetailsofDao = () => {
  return async (dispatch, getState) => {
    const currentDao = getState().dao.currentDao
    try {
      const safeInfo = await serviceClient.getSafeInfo(currentDao?.safe_public_address)
      const balance = await serviceClient.getBalances(currentDao?.safe_public_address)
      const usdBalance = await serviceClient.getUsdBalances(currentDao?.safe_public_address)
      
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
    try {
      const res = await axios.get(`${api.drepute.dev.BASE_URL}/${routes.contribution.createContri}?dao_uuid=${uuid}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      console.log('Pending request.....',res.data)
      if(res.data.success){
        dispatch(daoAction.set_contri_list({
          list:res.data?.data?.contributions.filter(x=>x.payout_status === null)
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
      console.log('Pending request.....',res.data)
      const pendingTxs = await serviceClient.getPendingTransactions(safe_address)
      console.log('pending tx...', pendingTxs, pendingTxs.results)
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
        console.log('all updated tx for drepute',tx.length, tx )
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

export const set_payout_filter = (filter_key) => {

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
      console.log('Pending request.....',res.data)
      const pendingTxs = await serviceClient.getMultisigTransactions(safe_address)
      //console.log('pending tx...', pendingTxs, pendingTxs.results)
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
        // console.log('all executed transaction', list_of_tx.length, list_of_tx, pending_txs.length)
        if(filter_key === 'PENDING'){
          console.log(pending_txs.length)
          dispatch(daoAction.set_filter_list({
            list:pending_txs
          }))
        }else if(filter_key === 'ALL'){
          const all_payout = pending_txs.concat(list_of_tx)
          console.log('all', all_payout.length)
          dispatch(daoAction.set_filter_list({
            list:all_payout
          }))
        }else if(filter_key === 'APPROVED'){
          const pending = pending_txs.filter(x=>x.status === filter_key)
          console.log(pending.length)
          dispatch(daoAction.set_filter_list({
            list:pending
          }))
        }else if(filter_key === 'REJECTED'){
          const pending = pending_txs.filter(x=>x.status === filter_key)
          console.log(pending.length)
          dispatch(daoAction.set_filter_list({
            list:pending
          }))
        }else if(filter_key === 'PAID'){
          console.log(list_of_tx.length)
          dispatch(daoAction.set_filter_list({
            list:list_of_tx
          }))
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
      console.log('Pending request.....',payouts.data)

      const allTx = await serviceClient.getMultisigTransactions(safe_address)
      const updatedTX = []
      console.log('All tx...', allTx, payouts)
      
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
      dispatch(daoAction.set_contri_list({
        list:[]
      }))
      return 0
    }
  }
}

export const getNonceForCreation = async(safe_address) => {
  console.log('address', safe_address)
    try {
      const pendingTxs = await serviceClient.getPendingTransactions(safe_address)
      console.log('nonce for creation', pendingTxs)
      return pendingTxs.countUniqueNonce
    } catch (error) {
      
    }
}


export const createPayout = (tranxid, nonce) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const transaction = getState().transaction.approvedContriRequest
    

    let contri_array = []

    transaction.map((item, index) => {
      contri_array.push(item?.contri_detail?.id)
    })
    
    const data = {
      //initiated_by:address,
      contributions:contri_array,
      gnosis_reference_id:tranxid,
      dao_uuid:uuid,
      nonce:nonce
    }
    console.log('data....', JSON.stringify(data))

      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.payout}`,data,{
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

export const signingPayout = (payId) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid

    const data = {
      dao_uuid:uuid,
      payout_id:payId
    }
    console.log('data....', JSON.stringify(data))

      // const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.signPayout}`,data,{
      //   headers:{
      //     Authorization:`Bearer ${jwt}`
      //   }
      // })
      // if(res.data.success){
      //   console.log('signed payout.....', res.data)
      //   return 1
      // }else{
      //   return 0
      // }
  }
}

export const executePayout = (payId) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid

    const data = {
      dao_uuid:uuid,
      payout_id:payId
    }
    console.log('data....', JSON.stringify(data))

      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.execute}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('signed payout.....', res.data)
        return 1
      }else{
        return 0
      }
  }
}

export const rejectPayout = (hash,payId) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid

    const data = {
      dao_uuid:uuid,
      payout_id:payId,
      gnosis_reference_id:hash
    }


      const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.reject}`,data,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      if(res.data.success){
        console.log('signed reject payout.....', res.data)
        return 1
      }else{
        return 0
      }
  }
}
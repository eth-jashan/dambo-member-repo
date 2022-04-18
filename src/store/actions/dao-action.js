import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { createClient } from "@urql/core"
import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { POCP_COMMUNTIES_TX_HASH } from "../../utils/subgraphQuery"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
// import { gnosisAction } from "../reducers/gnosis-slice"

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const addSafeAddress = (safeAddress) => {
  return (dispatch) => {
      dispatch(
        daoAction.set_safeAdress({safeAddress})
      )
    }
};

export const addOwners = (owners) => {
  return (dispatch) => {
      dispatch(
        daoAction.set_newSafeOwners({owners})
      )
    }
};

export const addThreshold = (threshold) => {
  return (dispatch) => {
      dispatch(
        daoAction.set_newSafeThreshold({threshold})
      )
    }
};

export const addDaoInfo = (name, email, discord, logo) => {
  return (dispatch) => {
      dispatch(
        daoAction.set_dainInfo({email, name, discord, logo})
      )
    }
};

export const registerDao = () => {
  return async (dispatch, getState) => {
      
    const jwt = getState().auth.jwt
    const address = getState().auth.address
    const owners = getState().dao.newSafeSetup.owners
    const safeAddress = getState().dao.newSafeSetup.safeAddress
    const threshold = getState().dao.newSafeSetup.threshold
    const name = getState().dao.newSafeSetup.dao_name
    const logo = getState().dao.newSafeSetup.dao_logo_url
    const discord = getState().dao.newSafeSetup.dao_discord

    const owner = []

    owners.map((item,index)=>(
      owner.push({ public_address:item.address, name:item.name})
    ))

    const data = {
      dao_name:name,
      safe_addr:safeAddress,
      by:address,
      signers:owner,
      signs_required:threshold,
      logo_url:logo,
      discord_link:discord
    }
    console.log('data.....', data)
    
    try {
        const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.dao.registerDao}`,data,
          {
            headers:{
              Authorization:`Bearer ${jwt}`
            }
          }
        )

        if(res.data.success){
          return {dao_uuid:res.data.data.dao_uuid, name, owners}
        }else{
          return 0
        }
    } catch (error) {
      console.log('error in registering.....', error)    
    }
  }
};

export const getAllDaowithAddress = () => {
  
    return async (dispatch, getState) => {
      const jwt = getState().auth.jwt
      
      try {
        const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDaoMembership}`,{
          headers:{
            Authorization:`Bearer ${jwt}`
          }
        })
        console.log(`total daos of`, res.data.data)
        if(res.data.data.length>0){
            dispatch(daoAction.set_dao_list({
              list:res.data.data,
            }))
            dispatch(daoAction.set_current_dao({
              dao:res.data.data[0].dao_details,
              role: res.data.data[0].access_role,
              community_role: res.data.data[0].community_role,
              account_mode:res.data.data[0].access_role,
              index:0
            }))
        }else{
          dispatch(daoAction.set_dao_list({
            list:[],
          }))
          dispatch(daoAction.set_current_dao({
            dao:null,
            role: null,
            community_role: null,
            account_mode:null,
            index:0
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
          community_role: null,
          account_mode:null,
          index:0
        }))
        return 0
      }
    }
}

export const set_contri_filter = (filter_key, number) => {
  return async (dispatch, getState) => {
    const jwt = getState().auth.jwt
    const uuid = getState().dao.currentDao?.uuid
    const url = getState().dao.role === 'ADMIN'?`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`:`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}&contributor=1`
    console.log('role', getState().dao.role)
    try {
      const res = await axios.get(url,{
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
            list:res.data?.data?.contributions?.filter(x=>x.status === "APPROVED" && x.payout_status==='REQUESTED')
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
        }else if(filter_key === 'PAID'){
          dispatch(daoAction.set_contribution_filter({
            key:filter_key,
            number:2,
            list:res.data?.data?.contributions?.filter(x=>x.status === "APPROVED" && x.payout_status==='PAID')
          }))
        }else {
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

export const set_dao = (dao, index) => {
  return async(dispatch) => {
    dispatch(daoAction.set_current_dao({
      dao:dao.dao_details,
      role:dao.access_role,
      community_role:dao.community_role,
      account_mode:dao.access_role,
      index:index
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
    dispatch(tranactionAction.reset_approved_request())
    const url = getState().dao.role === 'ADMIN'?`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`:`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}?dao_uuid=${uuid}&contributor=1`
    try {
      const res = await axios.get(url,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      })
      console.log('Pending Contri request.....',res.data.data)
      if(res.data.success){
        //Approved Request without gnosis
        let cid = []
        res?.data?.data?.contributions?.map((item, index) => {
          let payout = []
          cid.push(item)
          if(item?.tokens?.length>0 && item?.payout_status === null && item?.status === 'APPROVED' && item?.gnosis_reference_id === ''){
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
            if(payout?.length > 0){
              dispatch(tranactionAction.set_approved_request({item:{contri_detail:item, payout:payout}}))
            }else{
              console.log('Its A coppy....')
            }
          }
        })

        dispatch(daoAction.set_contribution_id({cid}))
        
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
    console.log('uuid', uuid)
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

//create a voucher

export const createVoucher = (voucher, types, domain,signature) => {
  return async (dispatch, getState) => {
    const res = await axios.post(api.pocp_service.BASE_URL,{
      data:{...voucher, signature},
      types,
      signingDomain:domain
    })
    console.log('voucher created', res)
  }
}

export const filterRequests = (time, verticals, isContribution) => {
  return (dispatch, getState) => {
    
    const contribution_request = getState().dao.contribution_request
    // const payout_request = getState().dao.payout_request
    const contri_filter_key = getState().dao.contri_filter_key
    let new_array_contrib_time = []
    if(isContribution){
      if(time === '1hr'){
        new_array_contrib_time =  contribution_request.filter(x=>x.time_spent<1)
      }else if(time === '1hr4'){
        new_array_contrib_time =  contribution_request.filter(x=>x.time_spent>1 && x.time_spent<4)
      }else if(time === '4hr12'){
        new_array_contrib_time =  contribution_request.filter(x=>x.time_spent>4 && x.time_spent<12)
      }else if(time === '12hr30'){
        new_array_contrib_time =  contribution_request.filter(x=>x.time_spent>12 && x.time_spent<30)
      }else if(time === '30hr'){
        new_array_contrib_time =  contribution_request.filter(x=>x.time_spent>30)
      }else{
        new_array_contrib_time = contribution_request
      }
    }
    let new_array_contrib_veritcal = []
    if(verticals.length>0){
      verticals.map((x,i)=>{
        new_array_contrib_time.map((y,i)=>{
          if(x.toUpperCase() === y.stream){
            console.log(x.toUpperCase()===y.stream)
            new_array_contrib_veritcal.push(y)
          }
        })
      })
    }
    dispatch(daoAction.set_contri_list({
      list:verticals.length>0?new_array_contrib_veritcal:new_array_contrib_time,
      number:contri_filter_key
    }))
    
    // verticals.map
  }
}

export const switchRole = (role) => {
  return (dispatch, getState) => {
    dispatch(daoAction.switch_account_role({role}))
  }
}

export const getContributorOverview = () => {
  return (dispatch, getState) => {
    const all_contribution = getState().dao.contribution_id
    
    let all_paid_contribution = []
    let type_of_token = []
    let token_info = []
    let totalAmount = 0

    all_contribution.map((item, index)=>{
      if(item?.status === 'APPROVED'&&item?.payout_status === 'PAID'){
        all_paid_contribution.push(item.id)
        item?.tokens?.map((y, i)=>{
          if(type_of_token?.includes(y?.details?.symbol)){
            let token = token_info.filter(x=>x.symbol === y?.details?.symbol)
            token[0].value = token[0].value + y?.amount*y?.usd_amount
            token[0].amount = token[0].amount+y?.amount
            let new_token_list = token_info.filter(x=>x.symbol !== y?.details?.symbol)
            new_token_list.push(token[0])
            token_info = new_token_list
            totalAmount = totalAmount + y?.amount*y?.usd_amount
          }else{
            type_of_token.push(y?.details?.symbol)
            totalAmount = totalAmount + y?.amount*y?.usd_amount
            token_info.push({symbol:y?.details?.symbol, value:y?.amount*y?.usd_amount, amount:y?.amount})
          }
        })
      }
    })
    dispatch(daoAction.set_contribution_overview({token_info, all_paid_contribution, total_amount:totalAmount}))
  }
}

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
      daoAction.set_allSafe({list:res.data.data})
    )
    }
};

export const getDaoHash = () => {
  return async (dispatch, getState) => {
      const query_communtiy = POCP_COMMUNTIES_TX_HASH
      const client = createClient({
          url:api.subgraph.url
      })

      try {
          const resCommunity = await client.query(query_communtiy).toPromise()   
          const communities = resCommunity.data.communities      
          dispatch(daoAction.set_pocp_dao({info:communities}))
      } catch (error) {
          console.log('error: ', error.toString())
      }
  }
  // const 
}

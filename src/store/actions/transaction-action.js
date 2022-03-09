import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { notification } from "antd"
import axios from "axios"
import { ethers } from "ethers"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { convertTokentoUsd } from "../../utils/conversion"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
// import { gnosisAction } from "../reducers/gnosis-slice"

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const setTransaction = (item, ethPrice) => {
    return (dispatch) => {
        dispatch(tranactionAction.set_current_transaction({data:item, price:ethPrice}))
    }
}

export const setPayment = (item) => {
    return (dispatch) => {
        setTransaction(null)
        dispatch(tranactionAction.set_current_payment({data:item}))
    }
}

export const resetApprovedRequest = () => {
    return async (dispatch) => {
        dispatch(tranactionAction.reset_approved_request())
    }
}

export const getPendingTransaction = () => {
    return async (dispatch, getState) => {
        const currentDao = getState().dao.currentDao
        const pendingTxs = await serviceClient.getPendingTransactions(currentDao?.safe_public_address)
        if(pendingTxs.count> 0){
            dispatch(tranactionAction.set_pendin_txs({list:pendingTxs.results}))
        }else{
            dispatch(tranactionAction.set_pendin_txs({list:[]}))
        }
    }
}

export const approveContriRequest =  (payout) => {
    return  async (dispatch, getState) => {
        
        // const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt
        const currentTransaction = getState().transaction.currentTransaction
        
        let newPayout = []

        dispatch(tranactionAction.set_approved_request({item:{contri_detail:currentTransaction, payout}}))
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
                        logo_url: "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png"
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
                        logo_url: item?.token_type?.token?.logoUri
                    }
                })
            }
        })

        const data = {
          status:"APPROVED",
          tokens:newPayout

        }
        console.log("Contribution appproval api body", JSON.stringify(data))
        try {
            const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}/update/${currentTransaction.id}`,data,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                }
            })
            if(res.data.success){
                let contri_request = getState().dao.contribution_request.filter(x=>x.id !== currentTransaction.id)
                dispatch(daoAction.set_contri_list({
                    list:contri_request
                }))
                return 1
            }else{
                return 0
            }
        } catch (error) {
            console.log('error....', error)
        }
    }
}

export const rejectContriRequest =  (id) => {
    return  async (dispatch, getState) => {
        
        const jwt = getState().auth.jwt
        
        const data = {
          status:"REJECTED",
          tokens:[]
        }
        try {
            const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}/update/${id}`,data,{
                headers:{
                    Authorization:`Bearer ${jwt}`
                }
            })
            if(res.data.success){
                dispatch(tranactionAction.set_reject_request({id}))
                return 1
            }else{
                return 0
            }
        } catch (error) {
            console.log('error....', error)
        }
    }
}

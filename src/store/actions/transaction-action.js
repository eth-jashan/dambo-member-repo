import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { notification } from "antd"
import axios from "axios"
import { ethers } from "ethers"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
// import { gnosisAction } from "../reducers/gnosis-slice"

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export const setTransaction = (item) => {
    return (dispatch) => {
        dispatch(tranactionAction.set_current_transaction({data:item}))
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
        console.log('current dao uuid ....', currentDao?.safe_public_address)
        const pendingTxs = await serviceClient.getPendingTransactions(currentDao?.safe_public_address)
        console.log('pending tx...', pendingTxs)
        if(pendingTxs.count> 0){
            dispatch(tranactionAction.set_pendin_txs({list:pendingTxs.results}))
        }else{
            dispatch(tranactionAction.set_pendin_txs({list:[]}))
        }
    }
}

export const approveContriRequest = (payout) => {
    return  async (dispatch, getState) => {
        
        // const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt
        const currentTransaction = getState().transaction.currentTransaction
        console.log('transaction.....', currentTransaction.id)
        const data = {
          status:"APPROVED"
        }
        // console.log('current....', data)
        // try {
        //     const res = await axios.post(`${api.drepute.dev.BASE_URL}${routes.contribution.createContri}/update/${currentTransaction.id}`,data,{
        //         headers:{
        //             Authorization:`Bearer ${jwt}`
        //         }
        //     })
        //     // console.log('resss', res)
        //     if(res.data.success){
                console.log('suucessfully created !')
                dispatch(tranactionAction.set_approved_request({item:{contri_detail:currentTransaction, payout}}))
        //         return 1
        //     }else{
        //         return 0
        //     }
        // } catch (error) {
        //     console.log('error....', error)
        // }
    }
}

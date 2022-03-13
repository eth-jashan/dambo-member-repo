import React, { useCallback, useState } from 'react'
import edit_active from "../../assets/Icons/edit_active.svg";

import edit_inactive from "../../assets/Icons/edit_inactive.svg";
import edit_hover from "../../assets/Icons/edit_hover.svg";
import three_dots from "../../assets/Icons/three_dots.svg";
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { setPayment, setTransaction } from '../../store/actions/transaction-action';
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { useSafeSdk } from "../../hooks";
import { message } from 'antd';
import { EthSignSignature } from '../../utils/EthSignSignature';
import { executePayout, getPayoutRequest, set_active_nonce, set_payout_filter, signingPayout, syncTxDataWithGnosis } from '../../store/actions/dao-action';
import moment from 'moment';
import { setPayoutToast } from '../../store/actions/toast-action';
// import { isRejected } from '@reduxjs/toolkit';

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export default function PaymentCard({item, signer}) {

    const address = useSelector(x=>x.auth.address)
    const [onHover, setOnHover] = useState(false)
    const delegates = useSelector(x=>x.dao.delegates)
    const nonce = useSelector(x=>x.dao.active_nonce)
    const currentDao = useSelector(x=>x.dao.currentDao)
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const isReject = item?.status === 'REJECTED'
    

    const checkApproval = () => {
        let confirm = []
        item.gnosis?.confirmations.map((item, index)=>{
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }
    
    
    
    const singlePayout = (item, index) => (
        <div key={index} className={styles.singleItem}>
            <div style={{flexDirection:'row', display:'flex', width:'60%'}}>
                <div className={styles.priceContainer}>
                    <div className={`${textStyles.m_16} ${styles.greyedText}`}>{item?.contributions?.length>1?'1600$':null}</div>
                </div>

                <div className={styles.contriTitle}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>{item?.contributions?.length>1?item?.title:'Single payment'}</div>
                </div>

                <div className={styles.tokenContainer}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>0.25 ETH + 4 SOL & 2 others</div>
                </div>
            </div>

            <div className={styles.addressContainer}>
            <div className={`${textStyles.m_16} ${styles.greyedText}`}>{item?.requested_by?.metadata?.name?.split(' ')[0]}  •   {item?.requested_by?.public_address?.slice(0,5)+'...'+item?.requested_by?.public_address?.slice(-3)}</div>
            </div>
        </div>
    )
    
    const bundleTitle = () => (
        <div className={styles.singleItem}>
            <div style={{flexDirection:'row', display:'flex', width:'60%', alignItems:'center'}}>

                <div className={styles.priceContainer}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>2900$</div>
                </div>

                <div className={styles.contriTitle}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{item?.metaInfo.contributions?.length>1?`Bundled Payments  •  ${item?.metaInfo.contributions?.length}`:item?.metaInfo.contributions[0]?.title}</div>
                </div>

                <div className={styles.tokenContainer}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>USDC, DAI & 2 others</div>
                </div>
            </div>
            <div className={styles.addressContainer}>
                <div className={styles.bundleInfo}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{moment(item?.gnosis?.submissionDate).startOf('hour').fromNow()}</div>
                        
                    <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                        <div style={{background: onHover && '#5C5C5C'}} className={styles.signerInfo}>
                            <img alt='edit' src={onHover?edit_hover:edit_active} className={styles.editIcon} />
                            <div style={{color: onHover&&'#ECFFB8'}} className={`${textStyles.m_16} ${styles.whiterText}`}>{item?.gnosis.confirmations?.length}/{delegates.length}</div>
                        </div>
                        
                        <img className={styles.menuIcon} alt='menu' src={three_dots} />
                            
                    </div>
                </div>
            </div>
        </div>
    )

    const payout = item.metaInfo?.contributions

    const dispatch = useDispatch()
    
    const onPaymentPress = () => {
        dispatch(setTransaction(null))
        dispatch(setPayment(item))
    }

    const confirmTransaction = async () => {
        if (!safeSdk || !serviceClient) return
        const hash = item?.gnosis?.safeTxHash
        let signature
        try {
          signature = await safeSdk.signTransactionHash(hash)
          try {
            await serviceClient.confirmTransaction(hash, signature.data)   
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter('PENDING',1))
            dispatch(setPayment(null))
            dispatch(setPayoutToast('SIGNED'))
            // await dispatch(set_payout_filter('PENDING'))
          } catch (error) {
            console.error(error)
            message.error('Error on confirming sign')
          }
        } catch (error) {
          console.error(error)
          message.error('Error on signing payment')
          return
        }
    }

    const executeSafeTransaction = async () => {
        
        const hash = item?.gnosis?.safeTxHash
        const transaction = await serviceClient.getTransaction(hash)
        const safeTransactionData = {
            to: transaction.to,
            safeTxHash: transaction.safeTxHash,
            value: transaction.value,
            data: transaction.data || '0x',
            operation: transaction.operation,
            safeTxGas: transaction.safeTxGas,
            baseGas: transaction.baseGas,
            gasPrice: transaction.gasPrice,
            gasToken: transaction.gasToken,
            refundReceiver: transaction.refundReceiver,
            nonce: transaction.nonce
        }
        if (!safeSdk) return
        
        
        const safeTransaction = await safeSdk.createTransaction(safeTransactionData)
        
        transaction.confirmations.forEach(confirmation => {
          const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
          safeTransaction.addSignature(signature)
        })
        let executeTxResponse
        try {
          executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          console.log('done transaction.......')
        } catch(error) {
          console.error(error)
          return
        }
        const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        // if(receipt){
            dispatch(setPayoutToast('EXECUTED'))
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter('PENDING',1))
            if(safeSdk){
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }
            dispatch(setPayment(null))
        // }
    }
//333333
    const getButtonProperty = () => {
        if(checkApproval() && delegates.length === item?.gnosis?.confirmations?.length && !isReject ){
            return {title:'Execute Payment', color:'black', background:'white'}
        }else if(checkApproval() && delegates.length !== item?.gnosis?.confirmations?.length && !isReject){
            return {title:'Payment Signed', color:'#ECFFB8', background:'#464740'}
        }else if(!checkApproval() && !isReject && !onHover){
            return {title:'Sign Payment', color:'white', background:'#333333'}
        }else if(!checkApproval() && !isReject && onHover){
            return {title:'Sign Payment', color:'black', background:'white'}
        }else if(isReject && delegates.length === item?.gnosis?.confirmations?.length){
            return {title:'Reject Payment', color:'white', background:'#FF6262'}
        }
        else if(isReject && checkApproval()){
            return {title:'Payment Rejected', color:'#FF6262', background:'#331414'}
        }
    }


    const buttonFunc = async(tranx) => {
        if(delegates.length === item?.gnosis?.confirmations?.length){
            await executeSafeTransaction()
        }else if (checkApproval()){
            console.log('Already Signed !!!')
        }else if (!checkApproval() && onHover){
            await confirmTransaction(tranx)
        }
    }
    

    return(
        <div onClick={()=>onPaymentPress()} style={{background:onHover&&'#333333', border:onHover&&0, borderRadius:onHover&&'0.75rem'}} onMouseLeave={()=>setOnHover(false)} onMouseEnter={()=>setOnHover(true)} className={styles.container}>
            {bundleTitle()}
            {(checkApproval() && nonce===item?.gnosis?.nonce)|| (!checkApproval()) ?
            payout.map((item,index)=>(
                singlePayout(item, index)
            )):null}
            {(checkApproval() && nonce===item?.gnosis?.nonce)|| (!checkApproval()) ? 
            <div style={{flexDirection:'row', justifyContent:'space-between', width:'100%', display:'flex'}}>
                <div style={{flexDirection:'row', display:'flex', width:'60%'}}>
                    <div style={{marginRight:0}} className={styles.priceContainer}/>
                    <div onClick={async ()=>{await buttonFunc(item?.gnosis?.safeTxHash)}} style={{background:getButtonProperty()?.background}} className={styles.btnContainer}>
                        <div style={{color:getButtonProperty()?.color}} className={textStyles.ub_14}>{getButtonProperty()?.title}</div>
                    </div>
                </div>
            </div>:null}
        </div>
    )
    
}
import React, { useState } from 'react'
import styles from './styles.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import { message } from 'antd'
import { useSafeSdk } from '../../../hooks'
import { ethers } from 'ethers'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { useDispatch, useSelector } from 'react-redux'
import { resetApprovedRequest } from '../../../store/actions/transaction-action'
import ERC20_ABI from '../../../smartContract/erc20.json'
import Web3 from 'web3'
import { createPayout, getNonceForCreation } from '../../../store/actions/dao-action'
import { setPayoutToast } from '../../../store/actions/toast-action'
import chevron_down from '../../../assets/Icons/expand_more_black.svg'
import { web3 } from '../../../constant/web3'
import RequestItem from './RequestItem'

const serviceClient = new SafeServiceClient(web3.gnosis.rinkeby)


const PaymentCheckoutModal = ({onClose, signer}) => {


    const currentDao = useSelector(x=>x.dao.currentDao)
    const approved_request = useSelector(x=>x.transaction.approvedContriRequest)
    const dispatch  = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [loading, setLoading] = useState(false)

    const proposeSafeTransaction = async () => {
        console.log('started...')
        let transaction_obj = []

        if(approved_request.length>0){
            approved_request.map((item, index)=>{
                item?.payout?.map((item,index)=>{
                    
                    if(item?.token_type === null || !item?.token_type || item?.token_type?.token?.symbol === 'ETH' ){
                        transaction_obj.push(
                            {
                                to: ethers.utils.getAddress(item?.address),
                                data:'0x',
                                value: ethers.utils.parseEther(`${item.amount}`).toString(),
                                operation:0
                            }
                        )
                    }else if(item?.token_type?.token?.symbol !== 'ETH'){
                        console.log('token', item?.token_type?.tokenAddress||item?.token_type?.token?.address)
                        var web3Client = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/25f28dcc7e6b4c85b74ddfb3eeda03e5"));
                        const coin = new web3Client.eth.Contract(ERC20_ABI, item?.token_type?.tokenAddress||item?.token_type?.token?.address)
                        const amount = parseFloat(item?.amount) * 1000000000000000000
                        console.log('here', parseFloat(amount))
                        transaction_obj.push(
                            {
                                to: item?.token_type?.tokenAddress||item?.token_type?.token?.address,
                                data:coin.methods.transfer(ethers.utils.getAddress(item?.address), amount.toString()).encodeABI(),
                                value: '0',
                                operation: 0
                            }
                        )
                    }
                })
            })
            
        }
        
        if (!safeSdk || !serviceClient) return
        let safeTransaction
        let nonce
          try {
            const activeNounce = await safeSdk.getNonce()
            const nextNonce = await getNonceForCreation(currentDao?.safe_public_address)
            nonce = nextNonce?nextNonce:activeNounce
            console.log('nexxxxt payment nonce',nextNonce?nextNonce:activeNounce)
            safeTransaction = await safeSdk.createTransaction(
                transaction_obj
            ,{
                nonce:nonce
            }
            )
            
          } catch (error) {
            console.error('errorrrr',error)
            // setLoading(false)
            message.error('Error on creating Transaction')
            return
          }
        
        
        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
        let safeSignature
        try {
            safeSignature = await safeSdk.signTransactionHash(
                safeTxHash
            )
        } catch (error) {
            // setLoading(false)
        }
        
        try {
        await serviceClient.proposeTransaction(
            currentDao?.safe_public_address,
            safeTransaction.data,
            safeTxHash,
            safeSignature
        )
        console.log(currentDao, safeTxHash)
        dispatch(createPayout(safeTxHash, nonce))
        dispatch(resetApprovedRequest())
        dispatch(setPayoutToast('ACCEPTED_CONTRI'))
        // setLoading(false)
        onClose()
        } catch (error) {
          console.log('error.........', error)
        //   setLoading(false)
          onClose()
        }
    }

    

    const modalHeader = () => (
        <div className={styles.header}>
            <div className={textStyles.ub_23}>Approved Requests • {approved_request.length}</div>
            <img alt='chevron_down' src={chevron_down} onClick={onClose} className={styles.chevron} color='black' />
        </div>
    )

    const tokenItem =  (item) => {
        return(
        <div style={{}} className={styles.tokenDiv}>
            <div className={`${textStyles.m_16} ${styles.usdText}`}>
            {(item?.usd_amount * parseFloat(item?.amount)).toFixed(2)}$ •
            </div>
            <div style={{}} className={textStyles.m_16}>
            {item?.amount} {item?.token_type?.token?item?.token_type?.token?.symbol:'ETH'}
            </div>
        </div>)
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        approved_request.map((item, index)=>{
            item.payout.map((x, i) => {
                usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
            })
        })

        const amount_total = usd_amount_all?.reduce((a,b)=>a+b)
        return parseFloat(amount_total)?.toFixed(2)
        
    }
    
    return(
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {modalHeader()}
                <div style={{marginBottom:'5rem'}}>
                {approved_request.map((item, index)=>(
                    <RequestItem item={item} tokenItem={tokenItem} approved_request={approved_request} />
                ))}
                </div>
                {approved_request.length>0&&<div onClick={async()=> !loading && await proposeSafeTransaction()} className={styles.btnCnt}>
                    <div className={styles.payBtn}>
                        {getTotalAmount()}$  •  Sign and Pay
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default PaymentCheckoutModal
import React, { useCallback, useState } from 'react'

import { GoChevronDown } from 'react-icons/all'
import styles from './styles.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import { Typography } from 'antd'
import { useSafeSdk } from '../../../hooks'
import { ethers } from 'ethers'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { useDispatch, useSelector } from 'react-redux'
import { resetApprovedRequest } from '../../../store/actions/transaction-action'
import ERC20_ABI from '../../../smartContract/erc20.json'
import Web3 from 'web3'
import { createPayout } from '../../../store/actions/dao-action'
import cross from '../../../assets/Icons/cross.svg'
import { convertTokentoUsd } from '../../../utils/conversion'

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')


const PaymentCheckoutModal = ({onClose, signer}) => {


    const currentDao = useSelector(x=>x.dao.currentDao)
    const approved_request = useSelector(x=>x.transaction.approvedContriRequest)
    const dispatch  = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)

    const proposeSafeTransaction = useCallback(async () => {

        let transaction_obj = []

        if(approved_request.length>0){
            approved_request.map((item, index)=>{
                item?.payout?.map((item,index)=>{
        
                    if(item?.token_type === null || !item?.token_type ){
                        transaction_obj.push(
                            {
                                to: ethers.utils.getAddress(item?.address),
                                data:'0x',
                                value: ethers.utils.parseEther(`${item.amount}`).toString(),
                                operation:0
                            }
                        )
                    }else if(item?.token_type?.token?.symbol){
                        var web3Client = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/25f28dcc7e6b4c85b74ddfb3eeda03e5"));
                        const coin = new web3Client.eth.Contract(ERC20_ABI, item?.token_type?.tokenAddress)
                        const amount = parseFloat(item?.amount) * 1e18
                        
                        transaction_obj.push(
                            {
                                to: item?.token_type?.tokenAddress,
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
          try {
            const nextNonce = await safeSdk.getNonce()
            
            safeTransaction = await safeSdk.createTransaction(
                transaction_obj
            ,{
                nonce:nextNonce
            }
            )
            
          } catch (error) {
            console.error('errorrrr',error)
            return
          }
        
        
        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
        
        const safeSignature = await safeSdk.signTransactionHash(
            safeTxHash
        )
        try {
        await serviceClient.proposeTransaction(
            currentDao?.safe_public_address,
            safeTransaction.data,
            safeTxHash,
            safeSignature
        )
        dispatch(createPayout(safeTxHash))
        dispatch(resetApprovedRequest())
        } catch (error) {
          console.log('error.........', error)
        }
    }, [approved_request, currentDao?.safe_public_address, dispatch, safeSdk])

    const startPayout = async() => {
        // setProvider()
        await proposeSafeTransaction()
    }

    const modalHeader = () => (
        <div className={styles.header}>
            <div className={textStyles.ub_23}>Approved Requests • {approved_request.length}</div>
            <GoChevronDown onClick={onClose} size={'1rem'} color='black' />
        </div>
    )

    const tokenItem =  (item) => {
        console.log('conversion', item)
        return(
        <div className={styles.tokenDiv}>
            <div className={`${textStyles.m_16} ${styles.usdText}`}>
            {(item?.usdAmount * parseFloat(item?.amount)).toFixed(2)}$ •
            </div>
            <div style={{marginLeft:'0.75rem'}} className={textStyles.m_16}>
            {item?.amount} {item?.token_type?.token?item?.token_type?.token?.symbol:'ETH'}
            </div>
        </div>)
    }

    const [onCancelHover, setCancelHover] = useState(false)

    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.map((item, index)=>{
            usd_amount.push(((item?.usdAmount) * parseFloat(item?.amount)).toFixed(2))
        })
        const amount_total = usd_amount.reduce((a,b)=>a+b)
        return amount_total
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        approved_request.map((item, index)=>{
            item.payout.map((x, i) => {
                usd_amount_all.push(((x?.usdAmount) * parseFloat(x?.amount)))
            })
        })

        const amount_total = usd_amount_all.reduce((a,b)=>a+b)
        console.log('total amount', amount_total)
        return parseFloat(amount_total).toFixed(2)
        
    }

    const requestItem = (item) => (
        <div className={styles.requestItem}>
        <div style={{width:'100%', display:'flex', flexDirection:'row'}}>
            <div style={{width:'5.2%'}}>
                <div onMouseLeave={()=>setCancelHover(false)} onMouseEnter={()=>setCancelHover(true)} className={styles.cancel}>
                    <img src={cross} alt='cancel' className={styles.cross}/>
                    {onCancelHover&&<div className={textStyles.m_14}>Cancel Approval</div>}
                </div>
            </div>
            <Typography.Paragraph style={{marginLeft:'0.75rem'}} ellipsis={{rows:1}} className={`${textStyles.ub_19} ${styles.alignText}`}>
                {item?.contri_detail?.title}
            </Typography.Paragraph>
        </div>
            <div className={styles.infoContainer}>
                <div style={{width:'60%',marginLeft:'0.75rem'}}>
                    <div className={`${textStyles.m_16} ${styles.alignText}`}>
                        {item?.contri_detail?.stream?.toLowerCase()}  •  {item?.contri_detail?.time_spent} hrs
                    </div>
                    <div className={`${textStyles.m_16} ${styles.alignText}`}>
                        {item?.contri_detail?.requested_by?.metadata?.name}  •  aviralsb.eth
                    </div>
                    <Typography.Paragraph ellipsis={{rows:2}} className={`${textStyles.m_16} ${styles.greyedText}`}>
                        Jashan has been doing the phenominal boi, keep it up GG.
                    </Typography.Paragraph>
                </div>
                <div>
                    {item?.payout.map((item, index)=>{
                        return tokenItem(item)
                    })}
                    <div style={{textAlign:'end'}} className={`${textStyles.m_16} ${styles.usdText}`}>
                        {getPayoutTotal(item?.payout)}$
                    </div>
                </div>
            </div>
        </div>
    )

    
    
    return(
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {modalHeader()}
                <div style={{marginBottom:'5rem'}}>
                {approved_request.map((item, index)=>(
                    requestItem(item)
                ))}
                </div>
                <div onClick={async()=>await startPayout()} className={styles.btnCnt}>
                    <div className={styles.payBtn}>
                        {getTotalAmount()}$  •  Pay Now
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentCheckoutModal
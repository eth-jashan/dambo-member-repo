import React from 'react'
import cross from '../../assets/Icons/cross_white.svg'
import styles from './style.module.css'
import textStyle  from "../../commonStyles/textType/styles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import moment from 'moment'
import { executePayout, getPayoutRequest, rejectPayout, set_payout_filter, signingPayout, syncTxDataWithGnosis } from '../../store/actions/dao-action';
import { EthSignSignature } from '../../utils/EthSignSignature';
import { message } from 'antd';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { useSafeSdk } from "../../hooks";
import { setPayment } from '../../store/actions/transaction-action';

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

const PaymentSlideCard = ({signer}) =>{

    const token_coin = ['0.002 ETH', '4 SOL']
    const currentPayment = useSelector(x=>x.transaction.currentPayment)
    const currentDao = useSelector(x=>x.dao.currentDao)
    const address = useSelector(x=>x.auth.address)
    const delegates = useSelector(x=>x.dao.delegates)
    const isReject = currentPayment?.status === 'REJECTED'
    
    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)

    const confirmTransaction = async (hash) => {
        if (!safeSdk || !serviceClient) return
        let signature
        try {
          signature = await safeSdk.signTransactionHash(hash)
          try {
            await serviceClient.confirmTransaction(hash, signature.data) 
            // await dispatch(signingPayout(currentPayment?.id))  
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter('PENDING'))
            dispatch(setPayment(null))
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

    const rejectTransaction = async (hash) => {
        // console.log('started.......', JSON.stringify(hash))
        const transaction = await serviceClient.getTransaction(hash)
        
        if (!safeSdk) return

        const rejectionTransaction = await safeSdk.createRejectionTransaction(transaction.nonce)
        const safeTxHash = await safeSdk.getTransactionHash(rejectionTransaction)
        
        const safeSignature = await safeSdk.signTransactionHash(
            safeTxHash
        )
        try {
        await serviceClient.proposeTransaction(
            currentDao?.safe_public_address,
            rejectionTransaction.data,
            safeTxHash,
            safeSignature
        )
        await dispatch(getPayoutRequest())
        await dispatch(syncTxDataWithGnosis())
        await dispatch(set_payout_filter('PENDING'))
        dispatch(setPayment(null))
        // dispatch(rejectPayout(safeTxHash, currentPayment?.id))
        } catch (error) {
          console.log('error.........', error)
        }
    }



    const executeSafeTransaction = async (hash) => {
        
        // console.log('started.......', JSON.stringify(hash))
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
        // console.log( transaction)
        
        const safeTransaction = await safeSdk.createTransaction(safeTransactionData)
        
        transaction.confirmations.forEach(confirmation => {
          const signature = new EthSignSignature
          (confirmation.owner, confirmation.signature)
          safeTransaction.addSignature(signature)
        })
        console.log('transaction', safeTransaction)
        let executeTxResponse
        try {
          executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          console.log('done transaction.......')
        } catch(error) {
          console.error(error)
          return
        }
        const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        
        console.log('executeee', receipt)
        // if(receipt){
            await dispatch(getPayoutRequest())
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter('PENDING'))
            dispatch(setPayment(null))
        // }
    }
    
    const renderContribution = (item) => (
        <div className={styles.contribContainer}>
            <div className={styles.leftContent}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    1600$
                </div>

                {token_coin.map((item, index)=>(
                    <div className={`${textStyle.m_16} ${styles.darkerGrey}`}>{item}</div>
                ))}

            </div>
            <div className={styles.rightContainer}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {item?.title}
                </div>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {item?.requested_by?.metadata?.name?.split(' ')[0]}  •  {`${item?.requested_by?.public_address.slice(0,5)}...${item?.requested_by?.public_address.slice(-3)}`}
                </div>
            </div>
        </div>
    )

    const checkApproval = () => {
        let confirm = []
        currentPayment.gnosis?.confirmations?.map((item, index)=>{
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }

    const approve = currentPayment?.gnosis.confirmations
    const renderSigners = () => (
        <div style={{marginBottom:'2.5rem'}} className={styles.signerContainer}>
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    
                    <div className={styles.connectorContainer}>
                        <div style={{height:'6px', width:'6px', background:getButtonTitle()?.title==='Sign Payment'||getButtonTitle()?.title==='Payment Signed'?'#ECFFB8':'white', borderRadius:'6px'}} />
                    </div>

                    
                    <div className={styles.headerTimeline_created}>
                        <div style={{color:'white'}} className={textStyle.m_16}>Created</div>
                        <div style={{color:'gray'}} className={textStyle.m_16}>{moment(currentPayment?.gnosis?.submissionDate).startOf('hour').fromNow()}</div>
                    </div>

                </div>

                <div  className={styles.singleHeaderContainer_signer}>
                    <div style={{height:'1.5rem'}} className={styles.childrenTimeline_signer}/>

                </div>
                
            </div>
            
            {/* signing container */}
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    
                    <div className={styles.connectorContainer}>
                        <div style={{height:'6px', width:'6px', background:getButtonTitle()?.title==='Sign Payment'||getButtonTitle()?.title==='Payment Signed'?'#ECFFB8':'white', borderRadius:'6px'}} />
                    </div>

                    
                    <div className={styles.headerTimeline_signer}>
                        <div style={{color:getButtonTitle()?.title==='Sign Payment'||getButtonTitle()?.title==='Payment Signed'?'#ECFFB8':'white'}} className={textStyle.m_16}>{isReject?'Signing Cancel':'Signing'}</div>
                        <div style={{color:getButtonTitle()?.title==='Sign Payment'||getButtonTitle()?.title==='Payment Signed'?'#ECFFB8':'white', marginLeft:'0.5rem'}} className={textStyle.m_16}>{currentPayment?.gnosis?.confirmations?.length} of {delegates.length}</div>
                    </div>

                </div>

                <div  className={styles.singleHeaderContainer_signer}>
                    
                    {delegates.length!==currentPayment?.gnosis?.confirmations.length?
                    <div className={styles.childrenTimeline_signer}>
                        {approve.map((item, index)=>(
                            <div className={styles.singleAddress} key={index}>
                                <div style={{color:isReject?'red':'#ECFFB8'}} className={`${textStyle.m_16}`}>
                                {/* {item?.metadata?.name?.split(' ')[0]}  •   */}
                                    somesh  •   
                                </div>
                                <div style={{color:'white'}} className={`${textStyle.m_16}`}>
                                  {`${item?.owner.slice(0,5)}...${item?.owner.slice(-3)}`}
                                </div>
                            </div>
                        ))}
                    </div>:
                    <div style={{height:'1.5rem'}} className={styles.childrenTimeline_signer}/>
                }

                </div>
                
            </div>

            {/* execution container */}

            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    
                    <div className={styles.connectorContainer}>
                        <div style={{height:'6px', width:'6px', background:getButtonTitle()?.title!=='Execute Payment'?'white':'#ECFFB8', borderRadius:'6px'}} />
                    </div>

                    
                    <div className={styles.headerTimeline_signer}>
                        <div style={{color:getButtonTitle()?.title!=='Execute Payment'?'white':'#ECFFB8'}} className={textStyle.m_16}>Execution</div>
                    </div>

                </div>

                <div  className={styles.singleHeaderContainer_signer}>
                    
                    <div style={{border:0}} className={styles.childrenTimeline_signer}>
                        <div style={{color:'gray', textAlign:'start'}} className={`${textStyle.m_16}`}>
                            {getButtonTitle()?.title!=='Execute Payment'?'Can be executed once the required signs are done ':null}
                        </div>
                    </div>

                </div>
                
            </div>

            
        </div>
    )

    const getButtonTitle = () => {
        if(checkApproval() && delegates.length === currentPayment?.gnosis?.confirmations?.length && !isReject ){
            return {title:'Execute Payment', color:'white', background:'#6852FF'}
        }else if(checkApproval() && delegates.length !== currentPayment?.gnosis?.confirmations?.length && !isReject){
            return {title:'Payment Signed', color:'#ECFFB8', background:'#23261C'}
        }else if(!checkApproval() && !isReject){
            return {title:'Sign Payment', color:'#6852FF', background:'white'}
        }else if(isReject && delegates.length === currentPayment?.gnosis?.confirmations?.length){
            return {title:'Reject Payment', color:'white', background:'#FF6262'}
        }
        else if(isReject && checkApproval()){
            return {title:'Payment Rejected', color:'#FF6262', background:'#331414'}
        }
    }

    const getRejectButton = () => {
        if(checkApproval() && delegates.length === currentPayment?.gnosis?.confirmations?.length){
            return {title:'Reject Payment', color:'white', background:'#FF6262'}
        }else if(checkApproval() && delegates.length !== currentPayment?.gnosis?.confirmations?.length){
            return {title:'Payment Rejected', color:'#FF6262', background:'#331414'}
        }else if(!checkApproval()){
            return {title:'Reject Payment', color:'white', background:'#FF6262'}
        }
    }

    const buttonFunction = async(hash) => {
        if(checkApproval() && delegates.length === currentPayment?.gnosis?.confirmations?.length){
            await executeSafeTransaction(hash)
        }else if(checkApproval() && delegates.length !== currentPayment?.gnosis?.confirmations?.length){
            console.log("Payment Already Signed")
        }else if(!checkApproval()){
           await  confirmTransaction(hash)
        }
    }
    
    return(
        <div className={styles.container}>
            <img onClick={()=>console.log('on cross press')} src={cross} alt='cross' className={styles.cross} />

            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                2900$
            </div>
            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                Bundled Payments • {currentPayment?.contributions?.length}
            </div>
            <div style={{marginBottom:'2.5rem'}} className={`${textStyle.m_23} ${styles.greyishText}`}>
                {moment(currentPayment?.gnosis?.submissionDate).format("h:mm a , Do MMM['] YY")}
                {/* 11:32 am, 20 feb’ 22   */}
            </div>
            {currentPayment?.metaInfo?.contributions?.map((item, index)=>(
                renderContribution(item)
            ))}
            {renderSigners()}
            <div style={{width:'20%', height:'80px', position:'absolute', bottom:0, background:'black', display:'flex', alignSelf:'center', alignItems:'center', justifyContent:isReject?'center':'space-between'}}>
                {!isReject&&<div onClick={async()=>await rejectTransaction(currentPayment?.gnosis?.safeTxHash)} className={styles.rejectBtn}>

                </div>}
                {isReject?
                <div onClick={async()=>await buttonFunction(currentPayment?.gnosis?.safeTxHash)} style={{background:getRejectButton()?.background}} className={styles.actionBtnCnt}>
                <div style={{color:getRejectButton()?.color}} className={textStyle.ub_16}>{getRejectButton()?.title}</div>
                </div>:
                <div onClick={async()=>await buttonFunction(currentPayment?.gnosis?.safeTxHash)} style={{background:getButtonTitle()?.background}} className={styles.actionBtnCnt}>
                    <div style={{color:getButtonTitle()?.color}} className={textStyle.ub_16}>{getButtonTitle()?.title}</div>
                </div>
                }
            </div>
        </div>
    )

}

export default PaymentSlideCard
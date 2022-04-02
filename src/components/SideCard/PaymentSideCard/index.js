import React from 'react'
import cross from '../../../assets/Icons/cross_white.svg'
import styles from './style.module.css'
import textStyle  from "../../../commonStyles/textType/styles.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import moment from 'moment'
import { executePayout, getPayoutRequest, rejectPayout, set_payout_filter, signingPayout, syncTxDataWithGnosis } from '../../../store/actions/dao-action';
import { EthSignSignature } from '../../../utils/EthSignSignature';
import { message } from 'antd';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { useSafeSdk } from "../../../hooks";
import { setPayment, setRejectModal } from '../../../store/actions/transaction-action';
import crossSvg from '../../../assets/Icons/cross_white.svg'
import { setPayoutToast } from '../../../store/actions/toast-action';


const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

const PaymentSlideCard = ({signer}) =>{

    const currentPayment = useSelector(x=>x.transaction.currentPayment)
    const currentDao = useSelector(x=>x.dao.currentDao)
    const address = useSelector(x=>x.auth.address)
    const delegates = useSelector(x=>x.dao.delegates)
    const isReject = currentPayment?.status === 'REJECTED'
    const nonce = useSelector(x=>x.dao.active_nonce)

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
            await dispatch(set_payout_filter('PENDING',1))
            dispatch(setPayment(null))
            dispatch(setPayoutToast('SIGNED'))
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

    const rejectTransaction =  () => {
        dispatch(setRejectModal(true))
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
        
        let executeTxResponse
        try {
          executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          console.log('done transaction.......')
        } catch(error) {
          console.error(error)
          return
        }
        const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        
        console.log('executeeed succefully')
        dispatch(setPayoutToast('EXECUTED'))
        // if(receipt){
            await dispatch(getPayoutRequest())
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter('PENDING',1))
            dispatch(setPayment(null))
        // }
    }
    
    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.map((item, index)=>{
            usd_amount.push(((item?.usd_amount) * parseFloat(item?.amount)))
        })
        let amount_total
        usd_amount.length ===0?amount_total=0: amount_total = usd_amount.reduce((a,b)=>a+b)
        return amount_total
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        currentPayment?.metaInfo?.contributions.map((item, index)=>{
            item.tokens.map((x, i) => {
                usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
            })
        })

        const amount_total = usd_amount_all?.reduce((a,b)=>a+b)
        return parseFloat(amount_total)?.toFixed(2)
        
    }

    const renderContribution = (item) => (
        <div className={styles.contribContainer}>
            <div className={styles.leftContent}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    {getPayoutTotal(item?.tokens)}$
                </div>
                {item?.tokens?.map((x, i)=>(
                    <div key={i} className={`${textStyle.m_16} ${styles.darkerGrey}`}>{x?.amount} {x?.details?.symbol}</div>
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

    const getExecutionMessage = () => {
        if(((isReject && currentPayment.gnosis.confirmations.length !== delegates.length && checkApproval() )|| (isReject && checkApproval()) || (isReject && !checkApproval()) )&& !nonce !== currentPayment?.gnosis?.nonce ){
            return 'Payment will be cancelled only after required signs are done  '
        }else if((currentPayment.gnosis.confirmations.length !== delegates.length && checkApproval() ) || ( !checkApproval() || !nonce !== currentPayment?.gnosis?.nonce) ){
            return 'Can be executed once the required signs are done '
        }else if(nonce !== currentPayment?.gnosis?.nonce && currentPayment.gnosis.confirmations.length === delegates.length ){
            return 'Can be executed only after previous payments are executed'
        }
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

                {!(currentPayment.gnosis.confirmations.length === delegates.length && nonce===currentPayment?.gnosis?.nonce)&&
                    <div  className={styles.singleHeaderContainer_signer}>
                        
                        <div style={{border:0}} className={styles.childrenTimeline_signer}>
                            <div style={{color:'gray', textAlign:'start'}} className={`${textStyle.m_16}`}>
                                {getExecutionMessage()}
                            </div>
                        </div>

                    </div>
                }
                
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
            if(checkApproval() && delegates.length === currentPayment?.gnosis?.confirmations?.length && nonce === currentPayment?.gnosis?.nonce){
                await executeSafeTransaction(hash)
            }else if(checkApproval() && delegates.length !== currentPayment?.gnosis?.confirmations?.length){
                console.log("Payment Already Signed")
            }else if(!checkApproval()){
            await  confirmTransaction(hash)
            }
    }

    console.log(currentPayment)
    
    return(
        <div className={styles.container}>
            <img onClick={()=>console.log('on cross press')} src={cross} alt='cross' className={styles.cross} />

            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                {getTotalAmount()}$
            </div>
            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                Bundled Payments • {currentPayment?.metaInfo?.contributions?.length}
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
                {!isReject&&<div onClick={()=> rejectTransaction()} className={styles.rejectBtn}>
                <img  src={crossSvg} alt='cross' className={styles.crossIcon} />
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
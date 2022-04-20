import React, { useCallback, useState } from 'react'

import styles from './styles.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import { Input, message } from 'antd'
import { useSafeSdk } from '../../../hooks'
import { ethers } from 'ethers'
import SafeServiceClient from '@gnosis.pm/safe-service-client'
import { useDispatch, useSelector } from 'react-redux'
import { approveContriRequest, resetApprovedRequest } from '../../../store/actions/transaction-action'
import ERC20_ABI from '../../../smartContract/erc20.json'
import Web3 from 'web3'
import { createExternalPayment, createPayout, getNonceForCreation } from '../../../store/actions/dao-action'
import cross from '../../../assets/Icons/cross.svg'
import { setPayoutToast } from '../../../store/actions/toast-action'
import { convertTokentoUsd } from '../../../utils/conversion'
import { TokenInput } from '../../InputComponent/TokenInput'

import {AiOutlineMinus} from 'react-icons/all'

import plus from '../../../assets/Icons/plus_black.svg'

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')


const UniversalPaymentModal = ({onClose, signer}) => {


    const currentDao = useSelector(x=>x.dao.currentDao)
    const approved_request = useSelector(x=>x.transaction.approvedContriRequest)
    const dispatch  = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState('')
    const [onFocus, setOnFocus] = useState(false)
    const [showFeedBack, setShowFeedBack] = useState(false)
    const token_available = useSelector(x=>x.dao.balance)

    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    );

    const ETHprice = useSelector(x=>x.transaction.initialETHPrice)
    const [feedBackShow, setFeedBackSow] = useState(false)
    const [payDetail, setPayDetail] = useState([{
        amount:'',
        token_type:null,
        address:address,
        usd_amount:ETHprice
    }])

  const addToken = async() => {
    
    const usdCoversion = await convertTokentoUsd('ETH')
      if(usdCoversion){
        const newDetail = {
          amount:'',
          token_type:null,
          usd_amount:usdCoversion,
          address:address
        }
      setPayDetail([...payDetail, newDetail]);
    }
  }

    const updatedPayDetail = async(e, index) => {
        payDetail[index].amount = e.target.value
        setPayDetail(payDetail);
    };

    const updateTokenType = async(value, index) => {
        const usdCoversion = await convertTokentoUsd(value.label)
        if(usdCoversion){
          payDetail[index].token_type = value.value
          payDetail[index].usd_amount = usdCoversion
          setPayDetail(payDetail);
        }
  
    };

    const proposeSafeTransaction = async () => {

        let transaction_obj = []
        //console.log('pay detail', payDetail)
        setLoading(true)

        if(payDetail.length>0){
                payDetail?.map((item,index)=>{
        
                    if(item?.token_type === null || !item?.token_type ){
                        transaction_obj.push(
                            {
                                to: ethers.utils.getAddress(address),
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
                                data:coin.methods.transfer(ethers.utils.getAddress(address), amount.toString()).encodeABI(),
                                value: '0',
                                operation: 0
                            }
                        )
                    }
                })
            
        }

        //console.log(transaction_obj)
        
        if (!safeSdk || !serviceClient) return
        let safeTransaction
        let nonce
          try {
            const activeNounce = await safeSdk.getNonce()
            const nextNonce = await getNonceForCreation(currentDao?.safe_public_address)
            nonce = nextNonce?nextNonce:activeNounce
            safeTransaction = await safeSdk.createTransaction(
                transaction_obj
            ,{
                nonce:nonce
            }
            )
            
          } catch (error) {
            console.error('errorrrr',error)
            setLoading(false)
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
            setLoading(false)
        }
        
        try {
        await serviceClient.proposeTransaction(
            currentDao?.safe_public_address,
            safeTransaction.data,
            safeTxHash,
            safeSignature
        )
        //console.log(currentDao, safeTxHash)
        dispatch(createExternalPayment(safeTxHash, nonce, payDetail))
        dispatch(resetApprovedRequest())
        // dispatch(setPayoutToast('ACCEPTED_CONTRI',{
        //     // item:0,
        //     value:
        //   }))
        setLoading(false)
        } catch (error) {
          //console.log('error.........', error)
          setLoading(false)
        }
    }

    

    const modalHeader = () => (
        <div className={styles.header}>
            <img onClick={()=>onClose()} src={cross} alt='cancel' className={styles.cross}/>
            <div style={{textAlign:'start', marginBottom:'1.5rem'}} className={textStyles.ub_28}>New Payment</div>
        </div>
    )

    const renderForm = () => (
        <div style={{marginBottom:''}}>
            <div style={{width:'100%', marginBottom:'1rem'}}>
            <div style={{border:onFocus?'1px #6852FF solid ':'1px solid #EEEEF0'}} className={styles.inputContainer}>
                
                <span className={`${textStyles.m_16}`}>
                    To
                </span>
                <input 
                    onFocus={()=>setOnFocus(true)} 
                    onBlur={()=>setOnFocus(false)}
                    placeholder='Wallet address' 
                    className={styles.amountInput}
                    onChange={(e)=>setAddress(e.target.value)}
                />
            </div>
            </div>
            {payDetail?.map((item, index) => (
              <TokenInput
                updateTokenType={(x) => updateTokenType(x, index)}
                value={item.amount}
                onChange={(e) => updatedPayDetail(e, index)}
              />
            ))}

            <div onClick={token_available.length>1?() => addToken():()=>{}} style={{marginTop:'1.5rem'}} className={styles.addToken}>
                <div style={{color:'#808080'}} className={`${textStyles.m_16}`}>
                    Add another token
                </div>
                <img src={plus} alt='plus' className={styles.plus} />
            </div>

            <div onClick={()=>setFeedBackSow(!feedBackShow)} className={styles.addToken}>
                <div style={{color:'#808080'}} className={`${textStyles.m_16}`}>
                    Add Feedback
                </div>
                {feedBackShow?<AiOutlineMinus size={'14px'}/>:<img src={plus} alt='plus' className={styles.plus} />}
            </div>

        </div>

    )

   
    
    
    return(
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {modalHeader()}
                {renderForm()}
                {feedBackShow&&<div style={{height:'4.5rem'}}>
                    <Input.TextArea
                        placeholder='Write your feedback here'
                        className={styles.textArea}
                    />
                </div>}
                {/* <div style={{ width:'100%', background:'white', left:0, height:'5rem', bottom:0, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center', alignSelf:'flex-end'}}> */}
                <div onClick={async()=>await proposeSafeTransaction()} className={styles.buttonContainer}>
                    <div style={{color:'white'}} className={textStyles.ub_16}>
                        Sign Payment
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default UniversalPaymentModal
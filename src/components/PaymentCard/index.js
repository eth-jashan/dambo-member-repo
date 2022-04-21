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
import { getPayoutRequest, set_active_nonce, set_payout_filter, syncExecuteData, syncTxDataWithGnosis,setLoading } from '../../store/actions/dao-action';
import moment from 'moment';
import { setPayoutToast } from '../../store/actions/toast-action';
import { getIpfsUrl, relayFunction, updatePocpApproval, updatePocpRegister, uplaodApproveMetaDataUpload } from '../../utils/relayFunctions';
import { approvePOCPBadge } from '../../utils/POCPutils';
import { getAuthToken } from '../../store/actions/auth-action';
import { web3 } from '../../constant/web3';
// import { isRejected } from '@reduxjs/toolkit';
import POCPProxy from '../../smartContract/POCP_Contracts/POCP.json'

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export default function PaymentCard({item, signer}) {

    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt);
    const [onHover, setOnHover] = useState(false)
    const delegates = useSelector(x=>x.dao.delegates)
    const nonce = useSelector(x=>x.dao.active_nonce)
    // const [loading, setLoading] = useState(false)
    const currentDao = useSelector(x=>x.dao.currentDao)
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const isReject = item?.status === 'REJECTED'
    const pocp_dao_info = useSelector(x=>x.dao.pocp_dao_info)
    const community_id = pocp_dao_info.filter(x=>x.txhash === currentDao?.tx_hash)
    const executePaymentLoading = useSelector((x) => x.dao.executePaymentLoading);
    // console.log('communit id', community_id, pocp_dao_info, currentDao)

    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.map((item, index)=>{
            usd_amount.push(((item?.usd_amount) * parseFloat(item?.amount)))
        })
        let amount_total
        usd_amount.length ===0?amount_total=0: amount_total = usd_amount.reduce((a,b)=>a+b)
        return amount_total.toFixed(2)
    }

    const getTotalAmount = () => {
        const usd_amount_all = []

        item?.metaInfo?.contributions.map((item, index)=>{
            item.tokens.map((x, i) => {
                usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
            })
        })

        const amount_total = usd_amount_all?.reduce((a,b)=>a+b)
        return parseFloat(amount_total)?.toFixed(2)
        
    }
    
    const checkApproval = () => {
        let confirm = []
        item.gnosis?.confirmations.map((item, index)=>{
            confirm.push(ethers.utils.getAddress(item.owner))
        })

        return confirm.includes(address)
    }
    
    const singlePayout = (x, index) => {
        let tokens = []
        x.tokens.map((x, i)=>{
            tokens.push(`${x?.amount} ${x?.details?.symbol}`)
        })
        // console.log(tokens)
        tokens = tokens.slice(0,2)?.toString()

        return(
        <div key={index} className={styles.singleItem}>
            <div style={{flexDirection:'row', display:'flex', width:'60%'}}>
                <div className={styles.priceContainer}>
                    <div className={`${textStyles.m_16} ${styles.greyedText}`}>{item?.metaInfo?.contributions?.length>1?`${getPayoutTotal(x.tokens)}$`:null}</div>
                </div>

                <div className={styles.contriTitle}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>{item?.metaInfo?.contributions?.length>1?x?.title:'Single payment'}</div>
                </div>

                <div className={styles.tokenContainer}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>{x?.tokens.length<3?tokens.replace(/,/g, '+'):`${tokens.replace(/,/g, '+')} & ${x.tokens?.length - 3} others`}</div>
                </div>
            </div>

            <div className={styles.addressContainer}>
            <div className={`${textStyles.m_16} ${styles.greyedText}`}>{x?.requested_by?.metadata?.name?.split(' ')[0]}  •   {x?.requested_by?.public_address?.slice(0,5)+'...'+x?.requested_by?.public_address?.slice(-3)}</div>
            </div>
        </div>
        )
    }
    
    const bundleTitle = () => {

        let tokenSymbol = []

        item?.metaInfo?.contributions?.map((item, index)=>{
            item.tokens?.map((y, index)=>{
                if(!tokenSymbol.includes(y?.details?.symbol)){
                    tokenSymbol.push(y?.details?.symbol)
                }
            })
        })

        return(
        
        <div className={styles.singleItem}>
            <div style={{flexDirection:'row', display:'flex', width:'60%', alignItems:'center'}}>

                <div className={styles.priceContainer}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{getTotalAmount()}$</div>
                </div>

                <div className={styles.contriTitle}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{item?.metaInfo.contributions?.length>1?`Bundled Payments  •  ${item?.metaInfo.contributions?.length}`:item?.metaInfo.contributions[0]?.title}</div>
                </div>

                <div className={styles.tokenContainer}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{tokenSymbol.length>3?`${tokenSymbol.slice(0,2)?.toString()?.replace(/,/g, '+')} & ${tokenSymbol?.length - 3} others`:`${tokenSymbol.slice(0,2)?.toString()?.replace(/,/g, '+')}`}</div>
                </div>
            </div>
            <div className={styles.addressContainer}>
                <div className={styles.bundleInfo}>
                    <div className={`${textStyles.m_16} ${styles.whiterText}`}>{moment(item?.gnosis?.submissionDate).fromNow()}</div>
                        
                    <div style={{flexDirection:'row', display:'flex', alignItems:'center'}}>
                        <div style={{background: onHover && '#5C5C5C'}} className={styles.signerInfo}>
                            <img alt='edit' src={onHover?edit_hover:edit_active} className={styles.editIcon} />
                            <div style={{color: onHover&&'#ECFFB8'}} className={`${textStyles.m_16} ${styles.whiterText}`}>{item?.gnosis.confirmations?.length}/{delegates.length}</div>
                        </div>
                        
                        {/* <img className={styles.menuIcon} alt='menu' src={three_dots} /> */}
                            
                    </div>
                </div>
            </div>
        </div>
    )}

    const payout = item.metaInfo?.contributions

    const dispatch = useDispatch()
    
    const onPaymentPress = () => {
        dispatch(setTransaction(null))
        dispatch(setPayment(item))
    }

    const confirmTransaction = async () => {
      dispatch(setLoading(true))
        if (!safeSdk || !serviceClient) {
            dispatch(setLoading(false))
            return
        }
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
            dispatch(setPayoutToast('SIGNED',{
                item:0,
                value:getTotalAmount()
              }))
            // await dispatch(set_payout_filter('PENDING'))
          } catch (error) {
            console.error(error)
            message.error('Error on confirming sign')
            dispatch(setLoading(false))
          }
        } catch (error) {
          console.error(error)
          message.error('Error on signing payment')
          dispatch(setLoading(false))
          return
        }
        dispatch(setLoading(false))
    }

    const [approveTitle, setApproveTitle] = useState(false)

    const executeSafeTransaction = async (c_id, to) => {
      dispatch(setLoading(true))
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
          const signature = new EthSignSignature
          (confirmation.owner, confirmation.signature)
          safeTransaction.addSignature(signature)
        })
        
        let executeTxResponse
        try {
          executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          //console.log('done transaction.......')
        } catch(error) {
          console.error(error)
          return
        }
        executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        dispatch(setPayoutToast('EXECUTED',{
            item:0,
            value:getTotalAmount()
          }))
          await syncExecuteData(item?.metaInfo?.id,hash,'APPROVED',jwt, currentDao?.uuid)
            setApproveTitle('Approving Badge...')
            const {cid, url, status} = await getIpfsUrl(jwt,currentDao?.uuid,c_id)
            // console.log('ipfs...', url, cid, status)
                if(!status){
                    const startTime = Date.now()
                    const interval = setInterval(async()=>{
                        if(Date.now() - startTime > 10000){
                        clearInterval(interval)
                        // console.log('failed to get ipfs url')
                        }
                        const {cid, url, status} = await getIpfsUrl(jwt,currentDao?.uuid,c_id)
                        // console.log('status', status)
                        // console.log('ipfs', url, cid, status)
                        if(status){
                            //console.log('ipfs', url, cid, status)
                        clearTimeout(interval)
                        //console.log('successfully registered')
                        if(cid?.length>0){
                            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                            try {
                                await web3Provider.provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: web3.chainid.polygon}]
                                })
                                const provider = new ethers.providers.Web3Provider(window.ethereum);
                                const signer = provider.getSigner()
                                const {data, signature} = await approvePOCPBadge(signer,parseInt(community_id[0].id), address,to,cid,url)
                                setApproveTitle('Signing Badge...')
                                const token = await dispatch(getAuthToken())
                                const tx_hash = await relayFunction(token,5,data,signature)
                                if(tx_hash){
                                await updatePocpApproval(jwt,tx_hash,cid)
                                const startTime = Date.now()
                                const interval = setInterval(async()=>{
                                    if(Date.now() - startTime > 10000){
                                    clearInterval(interval)
                                    //console.log('failed to get confirmation')
                                    await updatePocpApproval(jwt,tx_hash,cid)
                                    }
                                    var customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura);
                                    const reciept = await customHttpProvider.getTransactionReceipt(tx_hash)
                                    
                                    if(reciept?.status){
                                        setPayoutToast('APPROVED_BADGE')
                                        setApproveTitle('Confirmed Badge...')
                                        clearTimeout(interval)
                                          await provider.provider.request({
                                            method: 'wallet_switchEthereumChain',
                                            params: [{ chainId: web3.chainid.rinkeby}],
                                          })
                                        // }
                                    }
                                },2000)
                                }else{
                                    await provider.provider.request({
                                        method: 'wallet_switchEthereumChain',
                                        params: [{ chainId: web3.chainid.rinkeby}],
                                    })
                                }
                            } catch (error) {
                                //console.log(error.toString())
                                const provider = new ethers.providers.Web3Provider(window.ethereum);
                                await provider.provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: web3.chainid.rinkeby}],
                                })
                            }
                        }
                        }
                        //console.log('again....')
                    },3000)

                }else{
            
                    if(cid?.length>0){
                        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                        try {
                            await web3Provider.provider.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: web3.chainid.polygon}]
                            })
                            const provider = new ethers.providers.Web3Provider(window.ethereum);
                            const signer = provider.getSigner()
                            const {data, signature} = await approvePOCPBadge(signer,parseInt(community_id[0].id), address,to,cid,url)
                            const token = await dispatch(getAuthToken())
                            const tx_hash = await relayFunction(token,5,data,signature)
                            if(tx_hash){
                            await updatePocpApproval(jwt,tx_hash,cid)
                            const startTime = Date.now()
                            const interval = setInterval(async()=>{
                                if(Date.now() - startTime > 10000){
                                clearInterval(interval)
                                //console.log('failed to get confirmation')
                                }
                                //console.log('tx_hash', tx_hash)
                                var customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura);
                                const reciept = await customHttpProvider.getTransactionReceipt(tx_hash)
                                
                                if(reciept?.status){
                                    clearTimeout(interval)
                                    setPayoutToast('APPROVED_BADGE')
                                    await updatePocpApproval(jwt,tx_hash,cid)
                                    //console.log('successfully registered')
                                    await provider.provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: web3.chainid.rinkeby}],
                                    })
                                }

                                //console.log('again....')
                            },2000)
                            }else{
                            //console.log('error in fetching tx hash....')
                                await provider.provider.request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [{ chainId: web3.chainid.rinkeby}],
                                })
                            }
                        } catch (error) {
                            //console.log(error.toString())
                            const provider = new ethers.providers.Web3Provider(window.ethereum);
                            await provider.provider.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: web3.chainid.rinkeby}],
                            })
                        }
                    }
                }
                await dispatch(getPayoutRequest())
                await dispatch(set_payout_filter('PENDING',1))
                setApproveTitle(false)
                dispatch(setPayment(null))
            }
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
            return {title:'Execute Reject', color:'white', background:'#FF6262'}
        }
        else if(isReject && !checkApproval()){
            return {title:'Reject Payment', color:'#FF6262', background:'#331414'}
        }
        else if(isReject && checkApproval()){
            return {title:'Payment Rejected', color:'#FF6262', background:'#331414'}
        }
    }

    const uploadApproveMetatoIpfs = async() => {
        let metaInfo = []
        let cid = []
        let to = []
        item?.metaInfo?.contributions.map((x,index)=>{
            
            metaInfo.push({   
                dao_name:currentDao?.name, 
                contri_title:x?.title, 
                signer:address, 
                claimer:x?.requested_by?.public_address,
                date_of_approve:moment().format('D MMM YYYY'), 
                id:x?.id, 
                dao_logo_url:currentDao?.logo_url||"https://idreamleaguesoccerkits.com/wp-content/uploads/2017/12/barcelona-logo-300x300.png" ,
                work_type:x?.stream.toString()
            });
            cid.push(x?.id)
            to.push(x?.requested_by?.public_address)
        })
        const response = await uplaodApproveMetaDataUpload(metaInfo)
        if(response){
            return {status:true, cid, to}
        }else{
            return {status:false, cid:[], to:[]}
        }
    }

    const executeFunction = async() => {
        try {
            const res =  await uploadApproveMetatoIpfs()
            if(res.status){
                await executeSafeTransaction(res?.cid, res?.to)
                // console.log('success')
            }
            // console.log('success')            
        } catch (error) {
            // console.log('error', error.toString())
        }
    }

    const buttonFunc = async(tranx) => {
        if(!executePaymentLoading){
          dispatch(setLoading(true))
            if(delegates.length === item?.gnosis?.confirmations?.length){
                await executeFunction()
            }else if (checkApproval()){
                // console.log('Already Signed !!!')
            }else if (!checkApproval() && onHover){
                await confirmTransaction(tranx)
            }
        }
        dispatch(setLoading(false))
    }
    

    return(
        <div style={{background:onHover&&'#333333', border:onHover&&0, borderRadius:onHover&&'0.75rem'}} onMouseLeave={()=>setOnHover(false)} onMouseEnter={()=>setOnHover(true)} className={styles.container}>
            <div style={{cursor:'pointer'}} onClick={()=>onPaymentPress()}>
                {bundleTitle()}
                {(checkApproval() && nonce===item?.gnosis?.nonce)|| (!checkApproval()) ?
                payout.map((item,index)=>(
                    singlePayout(item, index)
                )):null}
            </div>
            {(checkApproval() && nonce===item?.gnosis?.nonce)|| (!checkApproval())? 
            <div style={{flexDirection:'row', justifyContent:'space-between', width:'100%', display:'flex', cursor:'pointer'}}>
                <div style={{flexDirection:'row', display:'flex', width:'60%'}}>
                    <div style={{marginRight:0}} className={styles.priceContainer}/>
                    {!item?.gnosis?.isExecuted && 
                    <div onClick={async ()=>{await buttonFunc(item?.gnosis?.safeTxHash)}} style={{background:getButtonProperty()?.background}} className={styles.btnContainer}>
                        <div style={{color:getButtonProperty()?.color}} className={textStyles.ub_14}>{approveTitle?approveTitle:(!executePaymentLoading?getButtonProperty()?.title:'Processing...')}</div>
                    </div>}
                </div>
            </div>:null}
        </div>
    )
    
}
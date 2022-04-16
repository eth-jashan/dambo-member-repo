import { message, List } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getAuthToken, getJwt, signout } from '../../store/actions/auth-action';
import { IoMdAdd, AiOutlineCaretDown } from 'react-icons/all'
import { createVoucher, getAllDaowithAddress, getContriRequest, getPayoutRequest, gnosisDetailsofDao, set_active_nonce, set_initial_setup, set_payout_filter, syncTxDataWithGnosis } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css';
import { links } from '../../constant/links';
import ContributionRequestModal from '../../components/Modal/ContributionRequest';
import { ethers, providers } from 'ethers';
import DashboardSearchTab from '../../components/DashboardSearchTab';
import ContributionCard from '../../components/ContributionCard';
import { useSafeSdk } from '../../hooks';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import PaymentCheckoutModal from '../../components/Modal/PaymentCheckoutModal';
import PaymentCard from '../../components/PaymentCard';
import { getPendingTransaction, setEthPrice, setPayment, setRejectModal, setTransaction } from '../../store/actions/transaction-action';
import { setPayoutToast } from '../../store/actions/toast-action';
import UniversalPaymentModal from '../../components/Modal/UniversalPaymentModal';
import plus_black from '../../assets/Icons/plus_black.svg'
import plus_gray from '../../assets/Icons/plus_gray.svg'
import { convertTokentoUsd } from '../../utils/conversion';
import RejectPayment from '../../components/Modal/RejectPayment';
import { approvePOCPBadge, claimPOCPBadges, createMetaTransactionSigning, createVoucherSigning,registerDaoToPocp } from '../../utils/POCPutils';
import POCPBadge from '../../components/POCPBadge';
import axios from 'axios';
import GnosisExternalPayment from '../../components/Alert/GnosisExternalPayment/index';
import BadgeItem from '../../components/BadgeItem';
import HtmlBadge from '../../components/HtmlBadge';
import { relayFunction } from '../../utils/relayFunctions';
import { web3 } from '../../constant/web3';
import POCPProxy from '../../smartContract/POCP_Contracts/POCP.json'
import { getAllBadges } from '../../store/actions/contibutor-action';
const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    const [uniPayHover, setUniPayHover] = useState(false)
    
    const payout_toast = useSelector(x=>x.toast.payout)
    const initial_setup = useSelector(x=>x.dao.initial_setup)
    const account_mode = useSelector(x=>x.dao.account_mode)
    const account_index = useSelector(x=>x.dao.account_index)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    

    useEffect(() => {
        const interval = setInterval(() => {
            if (payout_toast) {
                dispatch(setPayoutToast(false))
            }
        }, 3000);
        return () => {
            clearInterval(interval);
        }
    }, [dispatch, payout_toast]);

    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)

    const role = useSelector(x=>x.dao.role)
    const approve_contri = useSelector(x=>x.transaction.approvedContriRequest)
    const pending_txs = useSelector(x=>x.transaction.pendingTransaction)
    const curreentDao = useSelector(x=>x.dao.currentDao)
    const [modalContri, setModalContri] = useState(false)
    const [modalPayment, setModalPayment] = useState(false)
    const [modalUniPayment, setModalUniPayment] = useState(false)
    const rejectModal = useSelector(x=>x.transaction.rejectModal)
    console.log('payout toast', rejectModal)
    //gnosis setup
    const [signer, setSigner] = useState()
    const { safeSdk } = useSafeSdk(signer, curreentDao?.safe_public_address)
    const setProvider = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer)
    }

    useEffect(()=>{
        setProvider()
    },[])

    const asyncTask = async (hash) => {
        setTimeout(async () => {
        //   try {
        //     const _mobileNumber = await SmsRetriever.requestPhoneNumber();
        //     setMobileNumber(_mobileNumber.substring(3));
        //   } catch (e) {
        //     console.log(e);
        //   }
        console.log('ran once after 3sec')
        }, 30000);
      };

    async function copyTextToClipboard() {
        // if ('clipboard' in navigator) {
        //     message.success('invite link copied succesfully!')
        //   return await navigator.clipboard.writeText(`${links.contributor_invite.dev}${curreentDao?.uuid}`);
        // } else {
        //   return document.execCommand('copy', true, `${links.contributor_invite.dev}${curreentDao?.uuid}`);
        // }
        await dispatch(getAllBadges(signer))
        // const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        //   try {
        //     await web3Provider.provider.request({
        //       method: 'wallet_switchEthereumChain',
        //       params: [{ chainId: web3.chainid.polygon}],})
        //       const provider = new ethers.providers.Web3Provider(window.ethereum);
        //       const signer = provider.getSigner()
        //       const {data, signature} = await approvePOCPBadge(signer,10,address,['0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'],[3])
        //       const token = await dispatch(getAuthToken())
        //       const tx_hash = await relayFunction(token,5,data,signature)
        //       console.log('tx_hash', tx_hash)
        //       // update api call for claim

        //       if(tx_hash){
        //       const startTime = Date.now()
        //       const interval = setInterval(async()=>{
        //         if(Date.now() - startTime > 30000){
        //           clearInterval(interval)
        //           console.log('failed to get confirmation')
        //         }
        //         const reciept = await web3Provider.getTransactionReceipt(tx_hash)
        //         if(reciept?.status){
        //           console.log('done', reciept)
        //           clearTimeout(interval)
        //           console.log('successfully registered')
        //         await provider.provider.request({
        //           method: 'wallet_switchEthereumChain',
        //           params: [{ chainId: web3.chainid.rinkeby}],
        //         })
        //         navigate(`/dashboard`)
        //         }
        //         console.log('again....')
        //       },2000)
        //     }else{
        //       console.log('error in fetching tx hash....')
        //     }
        //   } catch (error) {
        //       console.log(error.toString())
        //       const provider = new ethers.providers.Web3Provider(window.ethereum);
        //       await provider.provider.request({
        //         method: 'wallet_switchEthereumChain',
        //         params: [{ chainId: web3.chainid.rinkeby}],
        //     })
        // }
    }
    
    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener("popstate", () => {
            if(address && jwt){
                console.log('on back!!!')
                window.history.pushState(null, document.title, window.location.href);
            }
          });
    },[address, jwt])

    async function onInit() {
        await window.ethereum.enable();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        return account
    }

    const initialload = useCallback( async() => {
        const account = await onInit()
        if(address === ethers.utils.getAddress(account) ){
                const jwtIfo = await dispatch(getJwt(address))
                if(jwtIfo){
                   await dispatch(getAllDaowithAddress())
                   await dispatch(gnosisDetailsofDao())
                    if(role === 'ADMIN'){
                        await  dispatch(getContriRequest())
                        await dispatch(getPayoutRequest())
                        await dispatch(getPendingTransaction())
                        dispatch(setPayment(null))
                        dispatch(setTransaction(null))
                        await dispatch(syncTxDataWithGnosis())
                        // get active nonce
                        if(safeSdk){
                            const nonce = await safeSdk.getNonce()
                            dispatch(set_active_nonce(nonce))
                        }
                    }else{
                        console.log('fetch when contributor....')
                        await  dispatch(getContriRequest())
                    }
                }else{
                    message.info('Token expired')
                    navigate('/')
                }
                
        }else{
            signout()
        }
    // }
    },[address, dispatch, navigate, role, safeSdk])

    const accountSwitch = useCallback( async() => {
        if(role === 'ADMIN'){
            await  dispatch(getContriRequest())
            await dispatch(getPayoutRequest())
            await dispatch(getPendingTransaction())
            dispatch(setPayment(null))
            dispatch(setTransaction(null))
            await dispatch(syncTxDataWithGnosis())
            if(safeSdk){
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }        
        }else{
            console.log('fetch when contributor....Contributo')
            await  dispatch(getContriRequest())
        }
    },[dispatch, role, safeSdk])

    useEffect(()=>{
        console.log('start..... initial load',account_mode, account_index)
        if(role === account_mode && account_index===0 ){
            initialload()
        }else{
            accountSwitch()
        }
        
    },[accountSwitch, account_index, account_mode, initialload, role])

    useEffect(()=>{
        preventGoingBack()
    },[preventGoingBack])

    const onRouteChange = async(route) =>{
        setTab(route)
        if(role === 'ADMIN'){
            if(safeSdk){
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }
            await dispatch(getPayoutRequest())
            if(route === 'payments'){
                await dispatch(syncTxDataWithGnosis())
            }
            await dispatch(set_payout_filter('PENDING',1))
            await dispatch(getContriRequest())
        }else{
            await dispatch(getContriRequest())
        }
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
    }

    const onUniModalOpen = async() => {
        const ethPrice = await convertTokentoUsd('ETH')
        if(ethPrice){
            dispatch(setEthPrice(ethPrice))
            setModalUniPayment(true)
        }
    }

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <div className={styles.routeContainer}>
                <div onClick={async()=>await onRouteChange('contributions')} className={tab==='contributions'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
                Contributions
                </div>
                <div onClick={async()=>await onRouteChange('payments')} style={{marginLeft:'2rem'}} className={tab==='payments'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
                {role==='ADMIN'?'Payments':'Badges'}
                </div>
            </div>
            <div>
                <div onMouseEnter={()=>setUniPayHover(true)} onMouseLeave={()=>setUniPayHover(false)} style={{background:modalUniPayment?'white':null}} onClick={role==='ADMIN'?async()=>await onUniModalOpen():()=>setModalContri(true)} className={styles.addPaymentContainer}>
                    <img src={(uniPayHover|| modalUniPayment)?plus_black:plus_gray} alt='plus' />
                </div>
                {modalUniPayment&&<UniversalPaymentModal signer={signer} onClose={()=>setModalUniPayment(false)}/>}
            </div>

        </div>
    )

    const renderEmptyScreen = () => (
        <div className={styles.emptyDiv}>
            <div className={styles.heading}>
                No contribution requests
            </div>
            {role !== 'ADMIN'?<div className={`${styles.heading} ${styles.greyedHeading}`}>
                Initiate a contributrion<br/> request to get paid
            </div>:
            <div className={`${styles.heading} ${styles.greyedHeading}`}>
                Share link to onboard<br/> contributors
            </div>}

            <button onClick={role==='ADMIN'?()=>copyTextToClipboard():()=>setModalContri(true)} className={styles.button}>
                <div>
                    {role !== 'ADMIN'?'Create Contribution Request':'Copy Invite Link'}
                </div>
            </button>
        </div>
    )

    const onPaymentModal = () => {
        setProvider()
        setModalPayment(true)
    }

    const approvedContriRequest = useSelector(x=>x.transaction.approvedContriRequest)

    const getTotalAmount = () => {
        const usd_amount_all = []

        approvedContriRequest.map((item, index)=>{
            item.payout.map((x, i) => {
                usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
            })
        })

        const amount_total = usd_amount_all.reduce((a,b)=>a+b)
        return parseFloat(amount_total).toFixed(2)
        
    }

    const checkoutButton = () => (
        <div className={styles.payBtnCnt}>
            <div onClick={()=>onPaymentModal()} className={styles.payBtnChild}>
                <div className={`${styles.whiteText} ${textStyles.ub_16}`}>
                    {approve_contri?.length} Request approved
                </div>
                <AiOutlineCaretDown size={18} color='white' />
            </div>
            <div className={`${styles.payBtnLeft} ${styles.border}`}>
                <div className={`${styles.whiteText} ${textStyles.m_16}`}>
                    {getTotalAmount()}$
                </div>

                <div onClick={()=>{}} className={styles.payNow}>
                    Pay Now
                </div>
            </div>
        </div>
    )
    
    const payoutToastInfo = () => {
        if(payout_toast === 'EXECUTED'){
            return {title:`Payment Executed  •  ${2900}$`, background:'#1D7F60'}
        }else if(payout_toast === 'SIGNED'){
            return  {title:`Payment Signed  •  ${2900}$`, background:'#4D4D4D'}
        }else if(payout_toast === 'ACCEPTED_CONTRI'){
            return  {title:`2 Request approved  •  ${2900}$`, background:'#4D4D4D'}
        }else if(payout_toast === 'REJECTED'){
            return  {title:`Payment rejected  •  ${600}$`, background:'#4D4D4D'}
        }
    }

    const transactionToast = () => (
        <div style={{background:payoutToastInfo().background}} className={styles.toastContainer}>
            <div  className={styles.toastLeft}>
                <div style={{color:'white'}} className={textStyles.m_16}>
                    {payoutToastInfo().title}
                </div>
            </div>
            <div className={styles.toastRight}>
                <div style={{color:'white'}} className={textStyles.ub_16}>
                    Details
                </div>
            </div>
        </div>
    )

    const contribution_request = useSelector(x=>x.dao.contribution_request)
    const payout_request = useSelector(x=>x.dao.payout_filter)

    const renderContribution = () => (
        contribution_request.length > 0 ?
        <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
            <div style={{width:'100%',  marginBottom:'100px'}}>
                {contribution_request.map((item, index)=>(
                    <ContributionCard item={item} />
                ))}
            </div>
        </div>:
        renderEmptyScreen()
    )

    const renderContributorContribution = () => (
        contribution_request.length > 0 ?
        <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
            <div style={{width:'100%',  marginBottom:'100px'}}>
                {contribution_request.map((item, index)=>(
                    <ContributionCard item={item} />
                ))}
            </div>
        </div>
        :renderEmptyScreen()
    )
    const dataSource= ['1', '2', '3']
    const renderBadges = () => (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: 0,overflowY:'scroll',marginBottom:'2rem'}}>
            {dataSource.map((x,i)=>(
                <BadgeItem/>
            ))}
        </div>
    )

    const renderPayment = () => (
        payout_request.length > 0 ?
        <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
            <div style={{width:'100%',  marginBottom:'100px'}}>
                <GnosisExternalPayment />
                {payout_request.map((item, index)=>(
                    <PaymentCard gnosis={pending_txs}  signer={signer} item={item} />
                ))}
            </div>
        </div>:
        renderEmptyScreen()
    )

    const adminScreen = () => (
        tab === 'contributions'?renderContribution():renderPayment()
    )

    const contributorScreen = () => (
        tab === 'contributions'?renderContributorContribution():renderBadges()
    )

    
    return (
        <DashboardLayout signer={signer} route={tab}>
            <div className={styles.dashView}>
                {(modalContri||modalPayment || modalUniPayment)&&<div style={{position:'absolute', background:'#7A7A7A',opacity:0.2, bottom:0, right:0, top:0, left:0}}/>}
                {renderTab()}
                {<DashboardSearchTab route={tab} />}
                {role === 'ADMIN'? adminScreen():contributorScreen()}
                {rejectModal&&<RejectPayment signer={signer} onClose={()=>dispatch(setRejectModal(false))} />}
                {approve_contri.length>0 && tab==='contributions' && role === 'ADMIN' && checkoutButton()}
                {payout_toast && transactionToast()}
                {modalContri&&<ContributionRequestModal setVisibility={setModalContri} />}
                {(modalPayment&&approve_contri.length>0)&&<PaymentCheckoutModal signer={signer} onClose={()=>setModalPayment(false)} />}
                {/* {renderEmptyScreen()} */}
            </div>
        </DashboardLayout>
    );
  }
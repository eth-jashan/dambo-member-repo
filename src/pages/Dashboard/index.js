import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getJwt, signout } from '../../store/actions/auth-action';
import { IoMdAdd, AiOutlineCaretDown } from 'react-icons/all'
import { getAllDaowithAddress, getContriRequest, getPayoutRequest, gnosisDetailsofDao, set_active_nonce, set_payout_filter, syncTxDataWithGnosis } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css';
import { links } from '../../constant/links';
import ContributionRequestModal from '../../components/Modal/ContributionRequest';
import { ethers } from 'ethers';
import DashboardSearchTab from '../../components/DashboardSearchTab';
import ContributionCard from '../../components/ContributionCard';
import { useSafeSdk } from '../../hooks';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import PaymentCheckoutModal from '../../components/Modal/PaymentCheckoutModal';
import PaymentCard from '../../components/PaymentCard';
import { getPendingTransaction, setPayment, setTransaction } from '../../store/actions/transaction-action';


const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    const {id}  = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const role = useSelector(x=>x.dao.role)
    const approve_contri = useSelector(x=>x.transaction.approvedContriRequest)
    const pending_txs = useSelector(x=>x.transaction.pendingTransaction)
    const curreentDao = useSelector(x=>x.dao.currentDao)
    const [modalContri, setModalContri] = useState(false)
    const [modalPayment, setModalPayment] = useState(false)
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

    async function copyTextToClipboard() {
        if ('clipboard' in navigator) {
            message.success('invite link copied succesfully!')
          return await navigator.clipboard.writeText(`${links.contributor_invite.dev}${curreentDao?.uuid}`);
        } else {
          return document.execCommand('copy', true, `${links.contributor_invite.dev}${curreentDao?.uuid}`);
        }
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
        // if(id !== address){
        //     signout()
        //     navigate('/')
        // }else{
        const account = await onInit()
        if(address === ethers.utils.getAddress(account) ){
                const jwtIfo = await dispatch(getJwt(address))
                console.log('jwt expiry check....',jwtIfo)
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
                        if(safeSdk){
                            const nonce = await safeSdk.getNonce()
                            dispatch(set_active_nonce(nonce))
                        }
                    }else{
                        console.log('fetch when contributor....')
                    }
                }else{
                    message.info('Token expired')
                    navigate('/')
                }
                
        }else{
            signout()
        }
    // }
    },[address, dispatch, navigate, role])

    useEffect(()=>{
        console.log('start..... initial load')
        initialload()
    },[initialload])

    useEffect(()=>{
        preventGoingBack()
    },[preventGoingBack])

    const onRouteChange = async(route) =>{
        setTab(route)
        if(safeSdk){
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
        await dispatch(getPayoutRequest())
        if(route === 'payments'){
            await dispatch(syncTxDataWithGnosis())
        }
        await dispatch(set_payout_filter('PENDING'))
        await dispatch(getContriRequest())
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
    }

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <div onClick={async()=>await onRouteChange('contributions')} className={tab==='contributions'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
            Contributions
            </div>
            <div onClick={async()=>await onRouteChange('payments')} style={{marginLeft:'2rem'}} className={tab==='payments'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
            Payments
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

            <button onClick={role==='ADMIN'?()=>copyTextToClipboard():()=>{setModalContri(true)}} className={styles.button}>
                <div>
                    {role !== 'ADMIN'?'Create Contribution Request':'Copy Invite Link'}
                </div>
            </button>
            {/* {role === 'ADMIN' && paymetButton()} */}
        </div>
    )

    const paymetButton = () => (
        <button className={styles.paymentButton}>
            <div>
            Initiate new Payment
            </div>
            <IoMdAdd color='#6852FF' />
        </button>
    )

    const onPaymentModal = () => {
        setProvider()
        setModalPayment(true)
    }

    const approvedContriRequest = useSelector(x=>x.transaction.approvedContriRequest)

    console.log('APPROVED ', approvedContriRequest)

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

    const renderPayment = () => (
        payout_request.length > 0 ?
        <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
            <div style={{width:'100%',  marginBottom:'100px'}}>
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

    
    return (
        <DashboardLayout signer={signer} route={tab}>
            <div className={styles.dashView}>
                {renderTab()}
                {<DashboardSearchTab route={tab} />}
                {role === 'ADMIN'? adminScreen():renderEmptyScreen()}
                {approve_contri.length>0 && tab==='contributions' && checkoutButton()}
                {modalContri&&<ContributionRequestModal setVisibility={setModalContri} />}
                {(modalPayment&&approve_contri.length>0)&&<PaymentCheckoutModal signer={signer} onClose={()=>setModalPayment(false)} />}
            </div>
        </DashboardLayout>
    );
  }
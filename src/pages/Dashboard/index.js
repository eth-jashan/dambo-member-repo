import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getJwt, signout } from '../../store/actions/auth-action';
import { IoMdAdd, AiOutlineCaretDown } from 'react-icons/all'
import { getAllDaowithAddress, getContriRequest, gnosisDetailsofDao } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css';
import { links } from '../../constant/links';
import ContributionRequestModal from '../../components/Modal/ContributionRequest';
import { ethers } from 'ethers';
import DashboardSearchTab from '../../components/DashboardSearchTab';
import ContributionCard from '../../components/ContributionCard';
import DeployGnosisButton from '../../components/GnosisSafe/DeployGnosis';
import Paybutton from '../../components/PayButton';

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    const {id}  = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const role = useSelector(x=>x.dao.role)
    const approve_contri = useSelector(x=>x.transaction.approvedContriRequest)
    const curreentDao = useSelector(x=>x.dao.currentDao)
    const [modalContri, setModalContri] = useState(false)
    
    async function copyTextToClipboard() {
        if ('clipboard' in navigator) {
            message.success('invite link copied succesfully!')
          return await navigator.clipboard.writeText(`${links.contributor_invite.local}${curreentDao?.uuid}`);
        } else {
          return document.execCommand('copy', true, `${links.contributor_invite.local}${curreentDao?.uuid}`);
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
        console.log(account)
        return account
    }

    const initialload = useCallback( async() => {
        if(id !== address){
            signout()
            navigate('/')
        }else{
        const account = await onInit()
        console.log('address',address, ethers.utils.getAddress(account), typeof(account))
        if(address === ethers.utils.getAddress(account) ){
                const jwtIfo = await dispatch(getJwt(address))
                console.log('jwt expiry check....',jwtIfo)
                if(jwtIfo){
                   await dispatch(getAllDaowithAddress())
                   //await dispatch(gnosisDetailsofDao())
                    if(role === 'ADMIN'){
                      await  dispatch(getContriRequest())
                    }
                }else{
                    message.info('Token expired')
                    navigate('/')
                }
                
        }else{
            signout()
        }
    }
    },[address, dispatch, id, navigate, role])

    useEffect(()=>{
        console.log('start.....')
        initialload()
    },[initialload])

    useEffect(()=>{
        preventGoingBack()
    },[preventGoingBack])

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <div onClick={()=>setTab('contributions')} className={tab==='contributions'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
            Contributions
            </div>
            <div onClick={()=>setTab('payments')} style={{marginLeft:'2.15%'}} className={tab==='payments'?`${styles.selected} ${textStyles.ub_23}`:`${styles.selectionTab} ${textStyles.ub_23}`}>
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
            {role === 'ADMIN' && paymetButton()}
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

    const checkoutButton = () => (
        <div className={styles.payBtnCnt}>
            <div className={styles.payBtnChild}>
                <div className={`${styles.whiteText} ${textStyles.ub_16}`}>
                    {approve_contri?.length} Request approved
                </div>
                <AiOutlineCaretDown size={18} color='white' />
            </div>
            <div className={`${styles.payBtnLeft} ${styles.border}`}>
                <div className={`${styles.whiteText} ${textStyles.m_16}`}>
                    2,500$
                </div>

                <div className={styles.payNow}>
                    Pay Now
                </div>
            </div>
        </div>
    )

    const contribution_request = useSelector(x=>x.dao.contribution_request)
    console.log('approved request.....',approve_contri)
    return (
        <DashboardLayout>
            <div className={styles.dashView}>
                {renderTab()}
                <DashboardSearchTab />
                {/* {renderEmptyScreen()} */}
                <div style={{width:'100%', height:'100%', overflowY:'scroll'}}>
                {contribution_request.map((item, index)=>(
                    <ContributionCard item={item} />
                ))}
                </div>
                {approve_contri.length>0 && checkoutButton()}
                {modalContri&&<ContributionRequestModal setVisibility={setModalContri} />}
                {/* <DeployGnosisButton /> */}
            </div>
        </DashboardLayout>
    );
  }
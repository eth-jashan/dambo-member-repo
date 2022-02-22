import { message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { getJwt, signout } from '../../store/actions/auth-action';
import { IoMdAdd } from 'react-icons/io'
import { getAllDaowithAddress, gnosisDetailsofDao } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";
import { links } from '../../constant/links';
import ContributionRequestModal from '../../components/Modal/ContributionRequest';

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    const {id}  = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const role = useSelector(x=>x.dao.role)
    const curreentDao = useSelector(x=>x.dao.currentDao)
    const [modalContri, setModalContri] = useState(false)
    
    console.log('current dao', curreentDao)
    
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
         window.ethereum.on('accountsChanged', function (accounts) {
            // Time to reload your interface with accounts[0]!
            console.log(accounts[0])
            return accounts[0]
           });
    }

    const initialload = useCallback( async() => {
        if(id !== address){
            signout()
            navigate('/')
        }else{
        const account = await onInit()
        if(address === account ){
                const jwtIfo = await dispatch(getJwt(address))
                console.log('jwt expiry check....',jwtIfo)
                if(jwtIfo){
                   await dispatch(getAllDaowithAddress())
                   await dispatch(gnosisDetailsofDao())
                }else{
                    message.info('Token expired')
                    navigate('/')
                }
                
        }else{
            signout()
        }
    }
    },[address, dispatch, id, navigate])

    useEffect(()=>{
        console.log('start.....')
        initialload()
    },[initialload])

    useEffect(()=>{
        preventGoingBack()
    },[preventGoingBack])

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <div onClick={()=>setTab('contributions')} className={tab==='contributions'?`${styles.selected}`:`${styles.selectionTab}`}>
            Contributions
            </div>
            <div onClick={()=>setTab('payments')} style={{marginLeft:'1.66%'}} className={tab==='payments'?`${styles.selected}`:`${styles.selectionTab}`}>
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
    
    return (
        <DashboardLayout>
            <div className={styles.dashView}>
                {renderTab()}
                {renderEmptyScreen()}
                {modalContri&&<ContributionRequestModal setVisibility={setModalContri} />}
            </div>
        </DashboardLayout>
    );
  }
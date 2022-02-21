import { List, Col, Row, Typography, Button, message } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ContributionCard from '../../components/ContributionCard';
import PaymentCard from '../../components/PaymentCard';
import { getJwt } from '../../store/actions/auth-action';
import { IoMdAdd } from 'react-icons/io'
import { getRole } from '../../store/actions/contibutor-action';
import { getAllDaowithAddress } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";
import { links } from '../../constant/links';

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    // const {id}  = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const role = useSelector(x=>x.dao.role)
    const curreentDao = useSelector(x=>x.dao.currentDao)

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

    const initialload = useCallback( async() => {
        if(address){
                const jwtIfo = await dispatch(getJwt(address))
                console.log('jwt expiry check....',jwtIfo)
                if(jwtIfo){
                   await dispatch(getAllDaowithAddress())
                }else{
                    message.info('Token expired')
                    navigate('/')
                }
                
        }
    },[address, dispatch, navigate])

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

            <button onClick={role==='ADMIN'?()=>copyTextToClipboard():()=>{}} className={styles.button}>
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
            </div>
        </DashboardLayout>
    );
  }
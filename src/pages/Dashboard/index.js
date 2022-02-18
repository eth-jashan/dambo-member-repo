import { List, Col, Row, Typography, Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ContributionCard from '../../components/ContributionCard';
import PaymentCard from '../../components/PaymentCard';
import { getJwt } from '../../store/actions/auth-action';
import { getRole } from '../../store/actions/contibutor-action';
import { getAllDaowithAddress } from '../../store/actions/dao-action';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')
    
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    const {id}  = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    // const history = useHisto
    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener("popstate", () => {
            // navigate.to(1);
            if(address && jwt){
                console.log('on back!!!')
                window.history.pushState(null, document.title, window.location.href);
            }
          });
    },[address, jwt])

    const initialload = useCallback( async() => {
        if(address){
            const res = await dispatch(getJwt(address))
            if(res){
                const jwtIfo = await dispatch(getJwt(address))
                if(jwtIfo){
                    dispatch(getRole(id))
                    dispatch(getAllDaowithAddress())
                }else{
                    navigate('/')
                }
                
            }
        }
    },[address, dispatch, id, navigate])
    useEffect(()=>{
        initialload()
    },[initialload])

    useEffect(()=>{
        preventGoingBack()
    },[preventGoingBack])

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <Row>
                <Col onClick={()=>setTab('contributions')} className={styles.tabCol} style={{borderBottom:tab ==='contributions'?'4px solid #21212A':null}}>
                    <span className={tab==='contributions'?styles.tabHeadingFocus:styles.tabHeading}>Contributions</span>
                </Col>

                <Col onClick={()=>setTab('payments')} className={styles.tabCol} style={{borderBottom:tab ==='payments'?'4px solid #21212A':null, marginLeft:'32px'}}>
                    <span className={tab==='payments'?styles.tabHeadingFocus:styles.tabHeading}>Payments</span>
                </Col>
            </Row>
        </div>
    )

    const renderScene = () => (
        <>
        <div className={styles.tabSceneContainer}>
        <span className={styles.requestText}>24 Contribution requests</span>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
                }}
                style={{alignSelf:'center', width:'100%'}}
                dataSource={['1']}
                renderItem={item => (
                    tab ==='contributions'? <ContributionCard />:<PaymentCard />
                )}
            />
        </div>
        </>
    )
    
    return (
        <DashboardLayout>
            <>
            <div className={styles.dashView}>
                {renderTab()}
                {renderScene()}
            </div>
            </>
        </DashboardLayout>
    );
  }
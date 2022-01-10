import { List, Col, Row, Typography } from 'antd';
import React, { useState } from 'react'
import ContributionCard from '../../components/ContributionCard';
import PaymentCard from '../../components/PaymentCard';
import DashboardLayout from '../../views/DashboardLayout';
import styles from "./style.module.css";

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')

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
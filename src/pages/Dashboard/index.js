import { List, Col, Row, Typography } from 'antd';
import React, { useState } from 'react'
import ContributionCard from '../../components/ContributionCard';
import DashboardLayout from '../../views/DashboardLayout';

export default function Dashboard() {

    const [tab, setTab] = useState('contributions')

    const renderTab = () => (
        <Row style={{border:'1px solid #21212B', width:'100%', paddingLeft:'32px', paddingTop:'20px', borderTopRightRadius:'12px', borderTopLeftRadius:'12px'}}>
            <Col onClick={()=>setTab('contributions')} style={{paddingBottom:'20px', borderBottom:tab ==='contributions'?'4px solid #21212A':null}}>
                <Typography.Text style={{fontSize:'22px', color:'white', fontFamily:'monospace', opacity:tab==='contributions'?1:0.6}}>Contributions</Typography.Text>
            </Col>

            <Col onClick={()=>setTab('payments')} style={{paddingBottom:'20px', borderBottom:tab ==='payments'?'4px solid #21212A':null, marginLeft:'32px'}}>
                <Typography.Text style={{fontSize:'22px', color:'white', fontFamily:'monospace',  opacity:tab==='payments'?1:0.6}}>Payments</Typography.Text>
            </Col>
        </Row>
    )

    const renderScene = () => (
        <>
        <div style={{ width:'100%',border:'1px solid #21212B', paddingLeft:'32px', display:'flex', flexDirection:'column'}}>
        <Typography.Text style={{color:'#FFFFFF', fontSize:'12px', opacity:0.5, fontFamily:'monospace', alignSelf:'flex-start',marginTop:'16px', marginBottom:'24px'}}>24 Contribution requests</Typography.Text>
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
                    <ContributionCard />
                )}
            />
        </div>
        </>
    )
    
    return (
        <DashboardLayout>
            <>
            <div style={{padding:'16px', width:'100%'}}>
                {renderTab()}
                {renderScene()}
            </div>
            </>
        </DashboardLayout>
    );
  }
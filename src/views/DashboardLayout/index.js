import React from "react";
import { Layout, Typography,  Row, Col, Card } from "antd";
import {FaDiscord} from 'react-icons/fa'
import {CgWebsite} from 'react-icons/cg'
import 'antd/dist/antd.css'
import HeaderComponent from "../../components/Header";
import DashboardStats from "../../components/DashboradStats";
const { Content } = Layout;


export default function DashboardLayout({ children }) {
    
  return (
      <Layout style={{width:'100%'}}>
          <HeaderComponent />

        <Content>
          <Row style={{width:'100%'}}>
            <Col span={16} style={{ width:'100%',  background:'black'}}>

              <div style={{background:'black', padding:'16px', border:'1px solid #21212B', color:'white', fontFamily:'monospace', fontSize:'12px'}}>
                Treasure is empty
              </div>

              {children}

            </Col>
            <Col span={8} style={{background:'black', width:'100%', border:'1px solid #21212B', display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%'}}>
              <DashboardStats />
            </Col>
          </Row>
        </Content>

      </Layout>
  );
}
import React from "react";
import { Layout, Typography,  Row, Col, Card } from "antd";
import 'antd/dist/antd.css'
import styles from "./style.module.css";
import HeaderComponent from "../../components/Header";
import DashboardStats from "../../components/DashboradStats";
const { Content } = Layout;


export default function DashboardLayout({ children }) {
    
  return (
      <Layout style={{}}>
          <HeaderComponent />

        <Content>
          <Row style={{}}>
            <Col span={16} style={{ width:'100%',  background:'black'}}>

              <div className={styles.treasureContainer}>
                Treasure is empty
              </div>

              {children}

            </Col>
            <Col span={8} style={{background:'black',  border:'1px solid #21212B'}}>
            <div className={styles.dashboardContainer}>
              <DashboardStats />
            </div>
            </Col>
          </Row>
        </Content>

      </Layout>
  );
}
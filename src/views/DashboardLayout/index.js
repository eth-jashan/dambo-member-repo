import React from "react";
import { Layout, Typography,  Row, Col, Card } from "antd";
import 'antd/dist/antd.css'
import styles from "./style.module.css";
import HeaderComponent from "../../components/Header";
import DashboardStats from "../../components/DashboradStats";
import { useSelector } from "react-redux";
const { Content } = Layout;


export default function DashboardLayout({ children }) {
  const safeAddress = useSelector(x=>x.gnosis.safeAddress)
  return (
      <Layout style={{background:'black', height:'100%'}}>
          {/* <HeaderComponent /> */}

        <Content style={{height:'100%'}}>
          <Row style={{}}>
            <Col span={16} style={{ width:'100%',  background:'black'}}>

              <div className={styles.treasureContainer}>
                {safeAddress}
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
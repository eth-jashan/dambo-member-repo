import React from "react";
import {  Typography,  Row, Col, Card } from "antd";
import {FaDiscord} from 'react-icons/fa'
import {CgWebsite} from 'react-icons/cg'
import 'antd/dist/antd.css'
import Meta from "antd/lib/card/Meta";
import {
  LinkOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import styles from "./style.module.css";


export default function DashboardStats() {
    
  return (
            <>
                <>
                  <div className={styles.analyticContainer}>
                    <span className={styles.heading}>Analytics</span>
                    <span className={styles.helperText}>Edit</span>
                  </div>
    
                  <Row>
                    <Col span={12} style={{background:'black'}}>
                      <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                        <div className={styles.CardCompContainer}>
                          <span className={styles.heading}>Twitter</span>
                          <Meta 
                            title={<span className={styles.cardTitle}>12,940</span>} 
                            description={<span className={styles.cardDesc}>129 new this week</span>}
                          />
                          </div>
                      </Card>
                    </Col>
                    <Col span={12} style={{background:'black'}}>
                      <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                          <div className={styles.CardCompContainer}>
                            <span className={styles.heading}>Discord</span>
                            <Meta 
                              title={<span className={styles.cardTitle}>2,8470</span>} 
                              description={<span className={styles.cardDesc}>28 new this week</span>}
                            />
                            </div>
                        </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div className={styles.CardCompContainer}>
                        <span className={styles.heading}>TVL</span>
                        <Meta 
                          title={<span className={styles.cardTitle}>-</span>} 
                          description={<span className={styles.cardDesc}>129 new this week</span>}
                        />
                        </div>
                    </Card>
                    </Col>

                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div className={styles.CardCompContainer}>
                        <span className={styles.heading}>Active Contributor</span>
                        <Meta 
                          title={<span className={styles.cardTitle}>-</span>} 
                          description={<span className={styles.cardDesc}>People</span>}
                        />
                        </div>
                    </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div className={styles.CardCompContainer}>
                        <span className={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Payout last month</span>
                        <Meta 
                          title={<span className={styles.cardTitle}>-</span>} 
                          description={<span className={{ color: '#FF9C9C', fontFamily:'monospace', fontSize:'12px' }}>129% more </span>}
                        />
                        </div>
                    </Card>
                    </Col>
                  </Row>
                </>
                <>
                <br/>
                  <div className={styles.socialContainer}>
                    <TwitterOutlined  style={{color:'white', fontSize:'14px'}} />
                    <span className={styles.socialText}>add twitter link</span>
                  </div>

                  <div className={styles.socialContainer}>
                    <FaDiscord  style={{color:'white', fontSize:'14px'}} />
                    <span className={styles.socialText}>add discord link</span>
                  </div>

                  <div className={styles.socialContainer}>
                    <CgWebsite  style={{color:'white', fontSize:'14px'}} />
                    <span className={styles.socialText}>add website link</span>
                  </div>

                  <div  className={styles.socialContainer}>
                    <LinkOutlined style={{color:'white', fontSize:'14px'}} />
                    <span className={styles.socialText}>copy invite link</span>
                  </div>
                </>
            </>
  );
}
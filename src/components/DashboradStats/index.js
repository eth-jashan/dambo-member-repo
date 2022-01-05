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


export default function DashboardStats() {
    
  return (
            <>
                <>
                  <div style={{width:'100%', padding:'20px', justifyContent:'space-between', display:'flex'}}>
                    <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Analytics</Typography.Text>
                    <Typography.Link style={{fontFamily:'monospace', marginLeft:'12px', color:'#FFFFFF', alignSelf:'center', fontSize:'12px',opacity:0.64, textDecorationLine:'underline'}}>Edit</Typography.Link>
                  </div>
    
                  <Row>
                    <Col span={12} style={{background:'black'}}>
                      <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                        <div style={{display:'flex', flexDirection:'column'}}>
                          <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Twitter</Typography.Text>
                          <Meta 
                            title={<Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'28px', textAlign:'center' }}>12,940</Typography.Text>} 
                            description={<Typography.Text style={{ color: '#9FFFBA', fontFamily:'monospace', fontSize:'12px' }}>129 new this week</Typography.Text>}
                          />
                          </div>
                      </Card>
                    </Col>
                    <Col span={12} style={{background:'black'}}>
                      <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                          <div style={{display:'flex', flexDirection:'column'}}>
                            <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Discord</Typography.Text>
                            <Meta 
                              title={<Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'28px', textAlign:'center' }}>2,8470</Typography.Text>} 
                              description={<Typography.Text style={{ color: '#9FFFBA', fontFamily:'monospace', fontSize:'12px' }}>28 new this week</Typography.Text>}
                            />
                            </div>
                        </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>TVL</Typography.Text>
                        <Meta 
                          title={<Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'28px', textAlign:'center' }}>-</Typography.Text>} 
                          description={<Typography.Text style={{ color: '#9FFFBA', fontFamily:'monospace', fontSize:'12px' }}>129 new this week</Typography.Text>}
                        />
                        </div>
                    </Card>
                    </Col>

                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Active Contributor</Typography.Text>
                        <Meta 
                          title={<Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'28px', textAlign:'center' }}>-</Typography.Text>} 
                          description={<Typography.Text style={{ color: '#9FFFBA', fontFamily:'monospace', fontSize:'12px' }}>People</Typography.Text>}
                        />
                        </div>
                    </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12} style={{background:'black'}}>
                    <Card  hoverable style={{ background:'black', border:'1px solid #21212B', height:'100%'}}>
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <Typography.Text style={{fontFamily:'monospace', color:'white', alignSelf:'center', fontSize:'14px'}}>Payout last month</Typography.Text>
                        <Meta 
                          title={<Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'28px', textAlign:'center' }}>-</Typography.Text>} 
                          description={<Typography.Text style={{ color: '#FF9C9C', fontFamily:'monospace', fontSize:'12px' }}>129% more </Typography.Text>}
                        />
                        </div>
                    </Card>
                    </Col>
                  </Row>
                </>
                <>
                <br/>
                  <div style={{padding:'10px', display:'flex', justifyContent:'flex-start', border:'1px solid #21212B'}}>
                    <TwitterOutlined  style={{color:'white', fontSize:'14px'}} />
                    <Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'12px', marginLeft:'12px', alignSelf:'center' }}>add twitter link</Typography.Text>
                  </div>

                  <div style={{padding:'10px', display:'flex', justifyContent:'flex-start', border:'1px solid #21212B'}}>
                    <FaDiscord  style={{color:'white', fontSize:'14px'}} />
                    <Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'12px', marginLeft:'12px', alignSelf:'center' }}>add discord link</Typography.Text>
                  </div>

                  <div style={{padding:'10px', display:'flex', justifyContent:'flex-start', border:'1px solid #21212B'}}>
                    <CgWebsite  style={{color:'white', fontSize:'14px'}} />
                    <Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'12px', marginLeft:'12px', alignSelf:'center' }}>add website link</Typography.Text>
                  </div>

                  <div style={{padding:'10px', display:'flex', justifyContent:'flex-start', border:'1px solid #21212B'}}>
                    <LinkOutlined style={{color:'white', fontSize:'14px'}} />
                    <Typography.Text style={{ color: 'white', fontFamily:'monospace',fontSize:'12px', marginLeft:'12px', alignSelf:'center' }}>copy invite link</Typography.Text>
                  </div>
                </>
            </>
  );
}
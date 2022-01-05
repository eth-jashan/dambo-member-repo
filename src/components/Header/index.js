import React, { useState } from "react";
import { Menu, Typography,  Row, Col,  message, Dropdown } from "antd";
import logoTest from '../../assets/logo-test.png'
import 'antd/dist/antd.css'

export default function HeaderComponent() {

    const [current, setCurrent] = useState('home')

    const renderLogo = () => (
        <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
            <img alt={logoTest}  style={{height:'16px', width:'24px', alignSelf:'center'}} src={logoTest} />
            <Typography.Text style={{fontFamily:'monospace', marginLeft:'12px', color:'white', alignSelf:'center', fontSize:'14px'}}>PolygonDAO</Typography.Text>
        </div>
    )

    const handleClick = e => {
        console.log('click ', e);
        setCurrent(e.key)
      };

    const renderMenu = () => (
     <div style={{display:'flex', flexDirection:'row'}}>
         <div style={{color:'white', fontFamily:'monospace', fontSize:'14px'}}>
            Home
         </div>
         <div style={{color:'white', fontFamily:'monospace', marginLeft:'40px', fontSize:'14px'}}>
            Treasury
         </div>
         <div style={{color:'white', fontFamily:'monospace', marginLeft:'40px', fontSize:'14px'}}>
            Contribution
         </div>
         <div style={{color:'white', fontFamily:'monospace', marginLeft:'40px', fontSize:'14px'}} >
            Growth
         </div>
         <div style={{color:'white', fontFamily:'monospace', marginLeft:'40px', fontSize:'14px'}}>
            Settings
         </div>
     </div>   
    )

    const onClick = ({ key }) => {
        message.info(`Click on item ${key}`);
      };

   

    const walletMenu = (
        <Menu onClick={onClick}>
          <Menu.Item key="1">1st menu item</Menu.Item>
          <Menu.Item key="2">2nd menu item</Menu.Item>
          <Menu.Item key="3">3rd menu item</Menu.Item>
        </Menu>
      );

    const renderWalletPicker = () => (
        <Dropdown onClick={e => e.preventDefault()} overlay={walletMenu}>
            <div style={{alignSelf:'center',paddingRight:'8px', paddingLeft:'8px',display:'flex',justifyContent:'center', background:'#121219'}}>
                <Typography.Text ellipsis={true} style={{fontFamily:'monospace', color:'white',  fontSize:'16px'}}>ETH . 0x9D7B838fF3F3A5E576da461920B633c80F040</Typography.Text>
            </div>
        </Dropdown>
    )
    
  return (
    <Row style={{width:'100%' ,border:'1px solid #21212B', padding:'16px',background:'black', justifyContent:'space-between', alignItems:'center'}}>
            <Col>
            {renderLogo()}
            </Col>
            <Col style={{ alignSelf:'center'}}>
            {renderMenu()}
            </Col>
            <Col style={{width:'20%', alignSelf:'center'}}>
            {renderWalletPicker()}
            </Col>
    </Row>
  );
}
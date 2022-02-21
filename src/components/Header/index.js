import React, { useState } from "react";
import styles from "./style.module.css";
import { Menu, Typography, Row, Col, message, Dropdown } from "antd";
import logoTest from "../../assets/logo-test.png";
import "antd/dist/antd.css";
import WalletPicker from "../../components/WalletPicker";

export default function HeaderComponent() {

    const [current, setCurrent] = useState('home')

    const renderLogo = () => (
        <div className={styles.logoContainer}>
            <img alt={logoTest}  className={styles.img} src={logoTest} />
            <div className={styles.logoHeading}>PolygonDAO</div>
        </div>
    )
    
    const renderMenu = () => (
     <div style={{display:'flex', flexDirection:'row'}}>
         <div className={styles.menuText}>
            Home
         </div>
         <div className={styles.menuTextMiddle}>
            Treasury
         </div>
         <div className={styles.menuTextMiddle}>
            Contribution
         </div>
         <div className={styles.menuTextMiddle} >
            Growth
         </div>
         <div lassName={styles.menuTextMiddle} >
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

    // const renderWalletPicker = () => (
    //     <Dropdown onClick={e => e.preventDefault()} overlay={walletMenu}>
    //         <div className={styles.walletContainer}>
    //             <Typography.Text ellipsis={true} style={{fontFamily:'monospace', color:'white',  fontSize:'16px'}}>ETH . 0x9D7B838fF3F3A5E576da461920B633c80F040</Typography.Text>
    //         </div>
    //     </Dropdown>
    // )
    
  return (
    <Row className={styles.rowContainer}>
      <div style={{width:'70vw'}}>
      <Col>
        {renderLogo()}
      </Col>
      <Col style={{ alignSelf:'center'}}>
        {renderMenu()}
      </Col>
      <Col className={styles.walletCol}>
        <WalletPicker />
      </Col>
      </div>
    </Row>
  );
}


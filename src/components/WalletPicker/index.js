import React from "react";
import { Menu, Typography, message, Dropdown } from "antd";
import { useSelector, useDispatch } from 'react-redux'

export default function  WalletPicker() {
  const address = useSelector(x=>x.auth.address);
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

    return (
        <Dropdown onClick={e => e.preventDefault()} overlay={walletMenu}>
            <div style={{alignSelf:'center',paddingRight:'8px', paddingLeft:'8px',display:'flex',justifyContent:'center', background:'#121219'}}>
                <Typography.Text ellipsis={true} style={{fontFamily:'monospace', color:'white',  fontSize:'16px'}}>ETH . {address}</Typography.Text>
            </div>
        </Dropdown>
    )
}
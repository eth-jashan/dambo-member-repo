import React from "react";
import { Menu, Typography, message, Dropdown, Divider } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import Paragraph from "antd/lib/skeleton/Paragraph";
import { signout } from "../../store/actions/auth-action";
import { useNavigate } from "react-router";

export default function  WalletPicker() {
  const address = useSelector(x=>x.auth.address);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand('copy', true, address);
    }
  }
    const onClick = ({ key }) => {
        console.log('keysss', key === '1')
        if(key === '1'){
          message.info(`address copied on clicpboard`);
          copyTextToClipboard()
        }else if(key === '2'){
          dispatch(signout())
          navigate('/')
        }
    };

    const walletMenu = (
        <Menu style={{borderRadius:'8px'}} onClick={onClick}>
          <Menu.Item key="1">
          <a copyable={{tooltips:false, icon:false, text:address}}  style={{color:'black', textDecorationLine:'underline', fontFamily:'TelegrafMedium', fontWeight:'500'}}>Copy wallet address</a>  
          </Menu.Item>
          <div style={{width:'100%', height:0, border: "0.5px solid #EEEEF0"}} />
          <Menu.Item key="2">
            <a style={{color:'#FF0000', textDecorationLine:'underline', fontFamily:'TelegrafMedium', fontWeight:'500'}}>Disconnect</a>
          </Menu.Item>
          {/* <Menu.Item key="3">3rd menu item</Menu.Item> */}
        </Menu>
      );

    return (
        <Dropdown onClick={e => e.preventDefault()} overlay={walletMenu}>
            <div style={{alignSelf:'center',paddingRight:'8px', paddingLeft:'8px',display:'flex',justifyContent:'center'}}>
              <Typography.Text ellipsis={true} style={{fontFamily:'Inter', color:'white',  fontSize:'12px'}}>ETH . {address?.slice(0,5)+'.....'+ address?.slice(-3)}</Typography.Text>
            </div>
        </Dropdown>
    )
}
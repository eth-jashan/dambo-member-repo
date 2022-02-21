import React, { useState } from "react";
import { Layout, Typography,  Row, Col, Card, Tooltip, message } from "antd";
import 'antd/dist/antd.css'
import styles from "./style.module.css";
import { IoMdAdd } from 'react-icons/io'
import { MdLink } from 'react-icons/md'
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { set_dao } from "../../store/actions/dao-action";
import { links } from "../../constant/links";
import logo from '../../assets/drepute_logo.svg'

export default function DashboardLayout({ children }) {

  const accounts = useSelector(x=>x.dao.dao_list)
  const currentDao = useSelector(x=>x.dao.currentDao) 
  const role = useSelector(x=>x.dao.role)
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {id} = useParams()
  console.log('current', role)

  const changeAccount = (item) => {
    dispatch(set_dao(item))
  }

  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      message.success('invite link copied succesfully!')
      return await navigator.clipboard.writeText(`${links.contributor_invite.local}${id}`);
    } else {
      return document.execCommand('copy', true, `${links.contributor_invite.local}${id}`);
    }
  }

  const headerComponet = () => (
    <div className={styles.header}>
      <div className={styles.headerText}>
        {currentDao?.name}
      </div>
    </div>
  )

  const renderAdminStats = () => (
    <div onClick={()=>copyTextToClipboard()} className={styles.copyLink}>
      <MdLink size={16} color='white' />
      <span className={styles.copyLinkdiv}>
      copy invite link
      </span>
    </div>
  )
  const text = (item) => <span>{item}</span>;
  return (
      <div className={styles.layout}>

        <div className={styles.accountsLayout}>
        
        <div className={styles.logoContainer}>
          <img src={logo} alt='logo' style={{height:'2.25rem',width:'2.25rem'}}/>
        </div>

        {accounts.map((item, index)=>(
          <div className={styles.accountContainer}>
            <Tooltip placement="right" title={()=>text(item?.dao_details?.name)}>
            <div onClick={()=>changeAccount(item)} style={{height:'2.25rem',borderRadius:'2.25rem', width:'2.25rem', background:'#FF0186'}}/>
            </Tooltip>
          </div>
        ))}
        <div className={styles.addContainer}>
          <div className={styles.addButton} onClick={()=>navigate('/onboard/dao')}>
            <IoMdAdd color='white' />
          </div>
        </div>
        </div>
        
        <div className={styles.childrenLayout}>
        {headerComponet()}
        <div style={{display:'flex', flexDirection:'row', width:'100%', height:'100%'}}>
            <div className={styles.children}>
            {children}
            </div>
            {role === 'ADMIN' &&
            <div className={styles.adminStats}>
              <div/>
              {renderAdminStats()}
            </div>}
        </div>
        </div>

      </div>
  );
}
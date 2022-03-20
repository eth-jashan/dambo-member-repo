import React, { useState } from "react";
import { Tooltip, message } from "antd";
import 'antd/dist/antd.css'
import styles from "./style.module.css";
import { IoMdAdd } from 'react-icons/io'
import { MdLink } from 'react-icons/md'
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getContriRequest, getPayoutRequest, gnosisDetailsofDao, setPayoutFilter, set_active_nonce, set_dao, set_payout_filter, signingPayout, syncTxDataWithGnosis } from "../../store/actions/dao-action";
import { links } from "../../constant/links";
import logo from '../../assets/drepute_logo.svg'
import add_white from '../../assets/Icons/add_white.svg'
import TransactionCard from "../../components/TransactionCard";
import PaymentSlideCard from "../../components/PaymentSideCard";
import { setPayment, setTransaction } from "../../store/actions/transaction-action";
import { useSafeSdk } from "../../hooks";
import textStyles from '../../commonStyles/textType/styles.module.css'
// import { getPendingTransaction } from "../../store/actions/transaction-action";

export default function DashboardLayout({ children, route, signer }) {

  const accounts = useSelector(x=>x.dao.dao_list)
  console.log('accounts...', accounts)
  const currentDao = useSelector(x=>x.dao.currentDao) 
  const currentTransaction = useSelector(x=>x.transaction.currentTransaction)
  const currentPayment = useSelector(x=>x.transaction.currentPayment)
  const role = useSelector(x=>x.dao.role)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)

  const changeAccount = async(item) => {
    dispatch(set_dao(item))
    await dispatch(gnosisDetailsofDao())
    await  dispatch(getContriRequest())
    await dispatch(getPayoutRequest())
    await dispatch(syncTxDataWithGnosis())
    dispatch(setPayment(null))
    dispatch(setTransaction(null))
    if(safeSdk){
      const nonce = await safeSdk.getNonce()
      dispatch(set_active_nonce(nonce))
  }
    await dispatch(set_payout_filter('PENDING',1))
  }

  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      message.success('invite link copied succesfully!')
      return await navigator.clipboard.writeText(`${links.contributor_invite.dev}${currentDao?.uuid}`);
    } else {
      return document.execCommand('copy', true, `${links.contributor_invite.dev}${currentDao?.uuid}`);
    }
  }

  const headerComponet = () => (
    <div className={styles.header}>
      <div style={{color:'white', textAlign:'start'}} className={textStyles.ub_14}>
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

  const renderSideBarComp = () => {
    if(route==='contributions' && currentTransaction){
      return <TransactionCard signer={signer} />
    }else if (route==='payments' && currentPayment){
      return <PaymentSlideCard signer={signer}/>
    }else{
      return renderAdminStats()
    }
  }

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
            <div onClick={()=>changeAccount(item)} style={{height:'2.25rem',borderRadius:'2.25rem', width:'2.25rem', background:'#FF0186', display:'flex', justifyContent:'center', alignItems:'center'}}>
              {item?.dao_details?.logo_url?<img src={item?.dao_details?.logo_url} alt='logo'height='100%' width='100%' style={{borderRadius:'2.25rem'}} />:null}
            </div>
            </Tooltip>
          </div>
        ))}
        <div className={styles.addContainer}>
          <div className={styles.addButton} onClick={()=>navigate('/onboard/dao')}>
            <img alt='add' className={styles.addIcon} src={add_white}/>
          </div>
        </div>
        </div>
        
        <div className={styles.childrenLayout}>
        {headerComponet()}
        <div className={styles.layoutContainer}>
            <div className={styles.children}>
            {children}
            </div>
            {role === 'ADMIN' &&
            <div className={styles.adminStats}>
              {renderSideBarComp()}
            </div>}
        </div>
        </div>

      </div>
  );
}
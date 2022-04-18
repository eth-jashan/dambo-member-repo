import React, { useState } from "react";
import { Tooltip, message } from "antd";
import 'antd/dist/antd.css'
import styles from "./style.module.css";
import { IoMdAdd } from 'react-icons/io'
import { MdLink } from 'react-icons/md'
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getContriRequest, getDaoHash, getPayoutRequest, gnosisDetailsofDao, setPayoutFilter, set_active_nonce, set_dao, set_payout_filter, signingPayout, syncTxDataWithGnosis } from "../../store/actions/dao-action";
import { links } from "../../constant/links";
import logo from '../../assets/drepute_logo.svg'
import add_white from '../../assets/Icons/add_white.svg'
import TransactionCard from "../../components/SideCard/TransactionCard";
import PaymentSlideCard from "../../components/SideCard/PaymentSideCard";
import { resetApprovedRequest, setPayment, setTransaction } from "../../store/actions/transaction-action";
import { useSafeSdk } from "../../hooks";
import textStyles from '../../commonStyles/textType/styles.module.css'
import ContributionSideCard from "../../components/SideCard/ContributionSideCard";
import ProfileModal from "../../components/Modal/ProfileModal";
import ContributionOverview from "../../components/SideCard/ContributorOverview";
import chevron_down from '../../assets/Icons/expand_more_black.svg'
import AccountSwitchModal from "../../components/Modal/AccountSwitchModal";
import { AiFillCaretDown } from "react-icons/ai";
import { setLoadingState } from "../../store/actions/toast-action";

export default function DashboardLayout({ children, route, signer }) {

  const accounts = useSelector(x=>x.dao.dao_list)
  const currentDao = useSelector(x=>x.dao.currentDao) 
  const currentTransaction = useSelector(x=>x.transaction.currentTransaction)
  const currentPayment = useSelector(x=>x.transaction.currentPayment)
  const contri_filter_key = useSelector(x=>x.dao.contri_filter_key)
  const role = useSelector(x=>x.dao.role)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
  const contribution_detail = useSelector(x=>x.contributor.contribution_detail)
  const account_mode = useSelector(x=>x.dao.account_mode)
  const [profile_modal, setProfileModal] = useState(false)
  const [switchRoleModal,setSwitchRoleModal] = useState(false)
  const [roleContainerHover, setRoleContainerHover] = useState(false)
  
  const changeAccount = async(item, index) => {
    dispatch(setLoadingState(true))
    await dispatch(getDaoHash())
    dispatch(resetApprovedRequest())
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
    dispatch(setLoadingState(false))
  }

  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      message.success('invite link copied succesfully!')
      return await navigator.clipboard.writeText(`${links.contributor_invite.dev}${currentDao?.uuid}`);
    } else {
      return document.execCommand('copy', true, `${links.contributor_invite.dev}${currentDao?.uuid}`);
    }
  }

  console.log('current dao', account_mode)

  const onProfileModal = () => {
    setProfileModal(!profile_modal)
    setSwitchRoleModal(false)
  }

  const onSwitchRoleModal = () => {
    setProfileModal(false)
    setSwitchRoleModal(!switchRoleModal)
  }

  const headerComponet = () => {
    return(
    <div className={styles.header}>
      <div style={{color:'white', textAlign:'start'}} className={textStyles.ub_14}>
        {currentDao?.name}
      </div>
      <div className={styles.profileContainer}>
        <div>
          {account_mode==='ADMIN'&&<div onMouseEnter={()=>setRoleContainerHover(true)} onMouseLeave={()=>setRoleContainerHover(false)} onClick={()=>onSwitchRoleModal()} style={{background:roleContainerHover?'white':'#5D5C5D', cursor:'pointer'}} className={styles.roleSwitchContainer}>
            <div style={{color:roleContainerHover?'black':'white'}} className={textStyles.m_14}>{role==='ADMIN'?'Approval':'Contributor'}</div>
            {<AiFillCaretDown color={switchRoleModal||roleContainerHover?'black':'white'} style={{alignSelf:'center'}} size={12} />}
          </div>}
          {switchRoleModal&&<AccountSwitchModal onChange={()=>setSwitchRoleModal(false)} />}
        </div>
        <div>
          <div onClick={()=>onProfileModal()} className={styles.accountIcon}>
          </div>
          {profile_modal&&<ProfileModal />}
        </div>
      </div>
    </div>
    )
  }

  const renderAdminStats = () => (
    <div onClick={()=>copyTextToClipboard()} className={styles.copyLink}>
      <MdLink size={16} color='white' />
      <span className={styles.copyLinkdiv}>
      copy invite link
      </span>
    </div>
  )

  const renderSideBarComp = () => {
    if(role === 'ADMIN'){
    if(route==='contributions' && currentTransaction){
      return contri_filter_key?<TransactionCard signer={signer} />:<ContributionSideCard signer={signer} />
    }else if (route==='payments' && currentPayment){
      return <PaymentSlideCard signer={signer}/>
    }else{
      return renderAdminStats()
    }
  }else{
    if(contribution_detail){
      return <ContributionSideCard isAdmin={false} signer={signer} />
    }else{
      return <ContributionOverview />
    }
  }
  }

  console.log('ffff', currentDao?.uuid, accounts[0])

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
            <div onClick={()=>changeAccount(item, index)} style={{height:'2.25rem',borderRadius:!item?.dao_details?.logo_url?0:'2.25rem', width:'100%', background:'transparent', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              {/* {currentDao?.uuid === item?.dao_details?.uuid?<div style={{height:'100%', width:'4px', background:'white', borderTopRightRadius:'8rem',borderBottomRightRadius:'8rem', marginRight:'8px'}}/>:<div style={{height:'100%', width:'4px', background:'transparent', borderTopRightRadius:'8rem',borderBottomRightRadius:'8rem',marginRight:'8px'}}/>} */}
              {item?.dao_details?.logo_url?<img src={item?.dao_details?.logo_url} alt='logo'height='100%'  style={{borderRadius:'2.25rem',background:'black', width:'2.25rem'}} />:<div style={{height:'2.25rem',borderRadius:'2.25rem', width:'2.25rem', background:'#FF0186', display:'flex', justifyContent:'center', alignItems:'center'}}/>}
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
            {/* {role === 'ADMIN' && */}
            <div className={styles.adminStats}>
              {renderSideBarComp()}
            </div>
        </div>
        </div>

      </div>
  );
}
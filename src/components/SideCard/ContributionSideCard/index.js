import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Typography } from "antd";
import { IoAddOutline, GoChevronUp, RiDeleteBin7Fill } from "react-icons/all";
import cross from "../../../assets/Icons/cross_white.svg";
import delete_icon from '../../../assets/Icons/delete_icon.svg'
import styles from "./style.module.css";
import textStyle  from "../../../commonStyles/textType/styles.module.css";
import { approveContriRequest, rejectContriRequest, setTransaction } from '../../../store/actions/transaction-action';
// import { getAllDaowithAddress, getContriRequest } from '../../store/actions/dao-action';
import { convertTokentoUsd } from "../../../utils/conversion";
import { setContributionDetail } from "../../../store/actions/contibutor-action";
import POCPBadge from "../../POCPBadge";
import { useSafeSdk } from "../../../hooks";
import SafeServiceClient from "@gnosis.pm/safe-service-client";

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')


const ContributionSideCard = ({signer, isAdmin = true}) => {
  
  const currentTransaction = useSelector(
    isAdmin?(x) => x.transaction.currentTransaction:x=>x.contributor.contribution_detail
  )
  const currentDao = useSelector(x=>x.dao.currentDao)
  const address = currentTransaction?.requested_by?.public_address;
  const [txInfo, setTxInfo] = useState([])
  const [safeInfo, setSafeInfo] = useState()
  const dispatch = useDispatch();
  const getEmoji = () => {
    if (currentTransaction?.stream === "DESIGN") {
      return "🎨";
    }else{
      return "🎨";
    }
  };

  const getTransactionInfo = useCallback(async() => {
    let tx
    if(currentTransaction?.status!=='REQUESTED'&& currentTransaction?.status!=='REJECTED'){ 
      console.log('here', currentTransaction)
      tx  = await serviceClient.getTransaction(currentTransaction?.gnosis_reference_id)
    }
    const safeInfo = await serviceClient.getSafeInfo(currentDao?.safe_public_address)
    console.log('transaction', tx)
    setTxInfo(tx)
    setSafeInfo(safeInfo)
    
  },[currentDao?.safe_public_address, currentTransaction?.gnosis_reference_id, currentTransaction?.status])

  useEffect(()=>{
    getTransactionInfo()
  },[getTransactionInfo])
  
  const getTotalAmount = () => {
    const usd_amount_all = []
    if(currentTransaction?.status !== 'REQUESTED'){
      // currentTransaction?.map((item, index)=>{
          currentTransaction.tokens.map((x, i) => {
              usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
          })
      // })

      const amount_total = usd_amount_all?.reduce((a,b)=>a+b)
      return parseFloat(amount_total)?.toFixed(2)
    }
  }

  console.log('total', currentTransaction, isAdmin, txInfo)

    const onContributionCrossPress = () => {
      dispatch(setTransaction(null))
      dispatch(setContributionDetail(null))
    }
    
    const tokenInfo = () => (
      <div className={styles.tokenDiv}>
        <div className={styles.tokenHeader}>
          <div style={{color:'#ECFFB8'}} className={textStyle.m_16}>{getTotalAmount()}$</div>
          <div style={{color:'#ECFFB870', marginLeft:'4px'}} className={textStyle.m_16}>Total Payout</div>
        </div>
        <div style={{background:'#FFFFFF12', height:'1px', marginTop:'0.75rem', marginBottom:'0.75rem'}}/>
        {currentTransaction?.tokens?.map((x, i)=>(
          <div key={i} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', borderBottom:i!==currentTransaction?.tokens?.length -1?'1px solid #FFFFFF12':null, paddingBottom:'0.75rem'}} className={styles.tokenHeader}>
          <div style={{color:'#ECFFB8'}} className={textStyle.m_16}>{x?.amount} {x.details?.symbol}</div>
          <div style={{color:'#ECFFB870', marginLeft:'4px'}} className={textStyle.m_16}>{(x?.usd_amount * x.amount).toFixed(2)}$</div>
        </div>
        ))}
      </div>
    )

    const getStatusProperty = () => {
      if(isAdmin){

      }else{
        if(currentTransaction.status === 'REQUESTED'){
          return{title:'Waiting for approval', color:'#FFC664',  dotColor:'#FFC664'}
        }
        else if(currentTransaction.status === 'REJECTED'){
          return{title:'Rejected', color:'red',dotColor:'red'}
        }
        else if (currentTransaction.status === 'APPROVED'){
          return{title:'Approved', color:'white',dotColor:'#FFFFFF40'} 
        }
        if(currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'){
          return{title:'Approved', color:'white',dotColor:'#FFFFFF40'}
        }
        
      }
    }

    const getSigningProperty = () => {
      if(isAdmin){

      }else{
        if(currentTransaction.status === 'REQUESTED'){
          return{title:'Signing', color:'white',dotColor:'#FFFFFF40'}
        }
        else if(currentTransaction.status === 'REJECTED'){
          return{title:'Rejected', color:'red',dotColor:'red'}
        }
        else if (currentTransaction.status === 'APPROVED'){
          return{title:'Approved', color:'#ECFFB8',dotColor:'#FFFFFF40'} 
        }
        if(currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'){
          return{title:'Approved', color:'white',dotColor:'#FFFFFF40'}
        }
      }
    }

    const getExecutionProperty = () => {
      if(isAdmin){

      }else{
        if(currentTransaction.status === 'REQUESTED'){
          return{title:'Signing', color:'white',dotColor:'#FFFFFF40'}
        }
        else if(currentTransaction.status === 'REJECTED'){
          return{title:'Rejected', color:'red',dotColor:'red'}
        }
        else if (currentTransaction.status === 'APPROVED'){
          return{title:'Signing', color:'white',dotColor:'#FFFFFF40'}
        }
        if(currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'){
          return{title:'Signing', color:'white',dotColor:'#FFFFFF40'}
        }
      }
    }

    const renderSigners_admin = () => (
      <div style={{marginBottom:'2.5rem'}} className={styles.signerContainer}>
          <div className={styles.singleTimeline_signer}>
              <div className={styles.singleHeaderContainer_signer}>
                  
                  <div className={styles.connectorContainer}>
                  <div style={{height:'6px', width:'6px', background:isAdmin?'gray':getStatusProperty()?.dotColor, borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_created}>
                      <div style={{color:isAdmin?'white':getStatusProperty()?.color}} className={textStyle.m_16}>{isAdmin?'Created':getStatusProperty()?.title}</div>
                      {/* <div style={{color:'gray'}} className={textStyle.m_16}>{moment(currentPayment?.gnosis?.submissionDate).startOf('hour').fromNow()}</div> */}
                  </div>

              </div>

              <div  className={styles.singleHeaderContainer_signer}>
                  <div style={{height:'1.5rem'}} className={styles.childrenTimeline_signer}/>

              </div>
              
          </div>
          
          {/* signing container */}
          <div className={styles.singleTimeline_signer}>
              <div className={styles.singleHeaderContainer_signer}>
                  
                  <div className={styles.connectorContainer}>
                      <div style={{height:'6px', width:'6px', background:isAdmin?'gray':getSigningProperty()?.dotColor, borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_signer}>
                      <div style={{color:isAdmin?'white':(!(safeInfo?.owners?.length === txInfo?.confirmations?.length)?getSigningProperty()?.color:'white')}} className={textStyle.m_16}>{'Signing'}</div>
                      {currentTransaction?.status !== 'REQUESTED' &&<div style={{color:isAdmin?'white':(!(safeInfo?.owners?.length === txInfo?.confirmations?.length)?currentTransaction?.status!=='REJECTED'?'#ECFFB8':'red':'grey'), marginLeft:'0.5rem'}} className={textStyle.m_16}>{txInfo?.confirmations?.length} of {safeInfo?.owners?.length}</div>}
                  </div>

              </div>

              <div  className={styles.singleHeaderContainer_signer}>
                  
                  
                  <div className={styles.childrenTimeline_signer}>
                      { currentTransaction?.status !== 'REQUESTED' && !(safeInfo?.owners?.length === txInfo?.confirmations?.length) && txInfo?.confirmations?.map((item, index)=>(
                          <div className={styles.singleAddress} key={index}>
                              <div style={{color:currentTransaction?.status!=='REJECTED'?'#ECFFB8':'red'}} className={`${textStyle.m_16}`}>
                                  somesh  •   
                              </div>
                              <div style={{color:'white'}} className={`${textStyle.m_16}`}>
                                {`${item?.owner.slice(0,5)}...${item?.owner.slice(-3)}`}
                              </div>
                          </div>
                      ))}
                  </div>

              </div>
              
          </div>

          {/* execution container */}

          <div className={styles.singleTimeline_signer}>
              <div className={styles.singleHeaderContainer_signer}>
                  
                  <div className={styles.connectorContainer}>
                      <div style={{height:'6px', width:'6px', background:isAdmin?'gray':(!(safeInfo?.owners?.length === txInfo?.confirmations?.length)||currentTransaction?.status==='REQUESTED'?getExecutionProperty()?.dotColor:'#ECFFB8'), borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_signer}>
                      <div style={{color:isAdmin?'white':!(safeInfo?.owners?.length === txInfo?.confirmations?.length)|| currentTransaction?.status==='REQUESTED'?getExecutionProperty().color:'#ECFFB8'}} className={textStyle.m_16}>Executed</div>
                  </div>

              </div>

              {isAdmin&&txInfo&&txInfo?.isExecuted&&<div  className={styles.singleHeaderContainer_signer}>
                      
                      <div style={{border:0}} className={styles.childrenTimeline_signer}>
                          <div style={{color:'gray', textAlign:'start'}} className={`${textStyle.m_16}`}>
                              <div style={{color:'#FFFFFF80'}} className={textStyle.m_16}>
                                Executed by {txInfo?.executor?.slice(0,5)}...{txInfo?.executor?.slice(-3)}
                              </div>  
                              <div style={{color:'#FFFFFF80', textDecoration:'underline'}} className={textStyle.m_16}>
                              view on etherscan
                              </div>  
                          </div>
                      </div>

              </div>}
              
          </div>

          
      </div>
    )

    return(
        <div className={styles.container}>
            <img onClick={()=>onContributionCrossPress()} src={cross} alt='cross' className={styles.cross} />
            {!(currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'&&!isAdmin)||isAdmin?
            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
              <span
                  className={`${textStyle.ub_23} ${styles.title}`}
              >{`${getEmoji()}`}</span>
              <span ellipsis={{rows:2}} className={`${textStyle.ub_23} ${styles.title}`}>
              {`${currentTransaction?.title}`}
              </span>
              <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${currentTransaction?.requested_by?.metadata?.name} . (${address.slice(0,5)}...${address.slice(-3)})`}</div>
              <div className={`${textStyle.m_16} ${styles.timeInfo}`}>{`${'Design  • '} ${currentTransaction?.time_spent} hrs`}</div>
              <Typography.Paragraph
                className={`${styles.description} ${textStyle.m_16}`}
                ellipsis={
                    {
                        rows: 2,
                        expandable: true,
                        symbol:<Typography.Text className={`${styles.description} ${textStyle.m_16}`}>read more</Typography.Text>,
                    }
                }
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography.Paragraph>
            </div>:
            <POCPBadge />}
            {currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'&&<div className={styles.divider}/>}
            {currentTransaction?.status!=='REQUESTED'&&tokenInfo()}
            {/* {currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'&&
            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
              <span
                  className={`${textStyle.ub_23} ${styles.title}`}
              >{`${getEmoji()}`}</span>
              <span ellipsis={{rows:2}} className={`${textStyle.ub_23} ${styles.title}`}>
              {`${currentTransaction?.title}`}
              </span>
              <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${currentTransaction?.requested_by?.metadata?.name} . (${address.slice(0,5)}...${address.slice(-3)})`}</div>
              <div className={`${textStyle.m_16} ${styles.timeInfo}`}>{`${'Design  • '} ${currentTransaction?.time_spent} hrs`}</div>
            </div>} */}
            <div className={styles.divider}/>  
              {renderSigners_admin()}
            {!isAdmin&&(currentTransaction?.status!=='REQUESTED'&&currentTransaction?.status!=='REJECTED')&&<div className={styles.claim_container}>
              <div onClick={async()=> await dispatch(rejectContriRequest(currentTransaction?.id))} className={styles.deletContainer}>
              <img  src={delete_icon} alt='cross' className={styles.delete} />
              </div>

              <div  className={styles.payNow}>
                <div className={`${textStyle.ub_16}`}>Claim Badge</div>
              </div>
            </div>}
        </div>
  );
};

export default ContributionSideCard;
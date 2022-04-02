import React, { useCallback, useState } from "react";
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


const ContributionSideCard = ({signer, isAdmin = true}) => {
  const currentTransaction = useSelector(
    isAdmin?(x) => x.transaction.currentTransaction:x=>x.contributor.contribution_detail
  )
  const address = currentTransaction?.requested_by?.public_address;
  const dispatch = useDispatch();
  const getEmoji = () => {
    if (currentTransaction?.stream === "DESIGN") {
      return "🎨";
    }
  };

  
  const getTotalAmount = () => {
    const usd_amount_all = []

    // currentTransaction?.map((item, index)=>{
        currentTransaction.tokens.map((x, i) => {
            usd_amount_all.push(((x?.usd_amount) * parseFloat(x?.amount)))
        })
    // })

    const amount_total = usd_amount_all?.reduce((a,b)=>a+b)
    return parseFloat(amount_total)?.toFixed(2)
  }

  console.log('total', getTotalAmount())

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
          <div key={i} style={{display:'flex', flexDirection:'row', justifyContent:'space-between', borderBottom:'1px solid #FFFFFF12', paddingBottom:'0.75rem'}} className={styles.tokenHeader}>
          <div style={{color:'#ECFFB8'}} className={textStyle.m_16}>{x?.amount} {x.details?.symbol}</div>
          <div style={{color:'#ECFFB870', marginLeft:'4px'}} className={textStyle.m_16}>{x?.usd_amount}$</div>
        </div>
        ))}
      </div>
    )

    const approve = [{owner:'0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'}, {owner:'0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'}, {owner:'0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'}, {owner:'0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'}, {owner:'0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'}]

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
        if(currentTransaction.status === 'EXECUTED'){
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
          return{title:'Approved', color:'white',dotColor:'#FFFFFF40'} 
        }
        if(currentTransaction.status === 'EXECUTED'){
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
        if(currentTransaction.status === 'EXECUTED'){
          return{title:'Signing', color:'white',dotColor:'#FFFFFF40'}
        }
      }
    }

    const renderSigners = () => (
      <div style={{marginBottom:'2.5rem'}} className={styles.signerContainer}>
          <div className={styles.singleTimeline_signer}>
              <div className={styles.singleHeaderContainer_signer}>
                  
                  <div className={styles.connectorContainer}>
                  <div style={{height:'6px', width:'6px', background:getStatusProperty().dotColor, borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_created}>
                      <div style={{color:getStatusProperty().color}} className={textStyle.m_16}>{getStatusProperty().title}</div>
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
                      <div style={{height:'6px', width:'6px', background:getSigningProperty().dotColor, borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_signer}>
                      <div style={{color:getSigningProperty().color}} className={textStyle.m_16}>{'Signing'}</div>
                      <div style={{color:currentTransaction?.status!=='REJECTED'?'#ECFFB8':'red', marginLeft:'0.5rem'}} className={textStyle.m_16}>{4} of {4}</div>
                  </div>

              </div>

              <div  className={styles.singleHeaderContainer_signer}>
                  
                  {/* {delegates.length!==currentPayment?.gnosis?.confirmations.length? */}
                  <div className={styles.childrenTimeline_signer}>
                      {approve.map((item, index)=>(
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
                      <div style={{height:'6px', width:'6px', background:getExecutionProperty().dotColor, borderRadius:'6px'}} />
                  </div>

                  
                  <div className={styles.headerTimeline_signer}>
                      <div style={{color:getExecutionProperty().color}} className={textStyle.m_16}>Executed</div>
                  </div>

              </div>

              {/* {!(currentPayment.gnosis.confirmations.length === delegates.length && nonce===currentPayment?.gnosis?.nonce)&& */}
                  {isAdmin&&<div  className={styles.singleHeaderContainer_signer}>
                      
                      <div style={{border:0}} className={styles.childrenTimeline_signer}>
                          <div style={{color:'gray', textAlign:'start'}} className={`${textStyle.m_16}`}>
                              <div style={{color:'#FFFFFF80'}} className={textStyle.m_16}>
                                Executed by aviralsb.eth
                              </div>  
                              <div style={{color:'#FFFFFF80', textDecoration:'underline'}} className={textStyle.m_16}>
                              view on etherscan
                              </div>  
                          </div>
                      </div>

                  </div>
              }
              
          </div>

          
      </div>
  )

    return(
        <div className={styles.container}>
            <img onClick={()=>onContributionCrossPress()} src={cross} alt='cross' className={styles.cross} />
            {currentTransaction?.status!=='EXECUTED'?
            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
              <span
                  className={`${textStyle.ub_23} ${styles.title}`}
              >{`${getEmoji()}`}</span>
              <span ellipsis={{rows:2}} className={`${textStyle.ub_23} ${styles.title}`}>
              {`${currentTransaction?.title}`}
              </span>
              <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${currentTransaction?.requested_by?.metadata?.name} . (${address.slice(0,5)}...${address.slice(-3)})`}</div>
              <div className={`${textStyle.m_16} ${styles.timeInfo}`}>{`${'Design  • '} ${currentTransaction?.time_spent} hrs`}</div>
            </div>:
            <POCPBadge />}
            {tokenInfo()}
            <div className={styles.divider}/>  
            {renderSigners()}

        </div>
  );
};

export default ContributionSideCard;
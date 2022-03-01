import { Card, Col, Divider, Row, Typography } from 'antd'
import React, { useState } from 'react'
import TickSvg from "../../assets/Icons/tick.svg";
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css'
import { BiDotsVerticalRounded } from 'react-icons/all'
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { setPayment } from '../../store/actions/transaction-action';

export default function PaymentCard({item}) {

    const address = useSelector(x=>x.auth.address)
    const [onHover, setOnHover] = useState(false)
    const delegates = useSelector(x=>x.dao.delegates)
    const checkApproval = () => {
        let status
        item.confirmations.map((item, index)=>{
            console.log('item...', address=== item.owner)
            if(address === ethers.utils.getAddress(item.owner)){
                status = true
            }else{
                status = false
            }
        })
        return status
    }

    const singlePayout = () => (
        <div className={styles.singleItem}>
            <div className={styles.itemLeft}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>1600$</div>
                <div style={{marginLeft:'1.75rem'}} className={`${textStyles.m_16} ${styles.greyedText}`}>Design for landing page</div>
            </div>
            <div className={styles.itemRight}>
            <div className={`${textStyles.m_16} ${styles.greyedText}`}>0.25 ETH + 4 SOL</div>
            <div className={`${textStyles.m_16} ${styles.greyedText}`}>sangy  •   0X273...12a</div>
            </div>
        </div>
    )
    
    const bundleTitle = () => (
        <div className={styles.titleContainer}>
            <div style={{marginBottom:'1rem'}} className={styles.itemLeft}>
                <div className={`${textStyles.m_16} ${styles.whiterText}`}>1600$</div>
                <div style={{marginLeft:'1.75rem'}} className={`${textStyles.m_16} ${styles.whiterText}`}>Bundled Payments  •  {payout.length}</div>
            </div>
            <div className={styles.titleRight}>
                <div className={`${textStyles.m_16} ${styles.greyedText}`}>11:32 AM, 20 Feb’ 22</div>
                <BiDotsVerticalRounded style={{marginLeft:'1.625rem'}} size={'1rem'} color='#999999'  />
            </div>
        </div>
    )

    const payout = ['1', '2', '3', '4']
    // console.log(checkApproval())
    const dispatch = useDispatch()
    const onPaymentPress = () => {
        dispatch(setPayment(item))
    }

    return(
        <div onClick={()=>onPaymentPress()} style={{background:onHover&&'#333333', border:onHover&&0, borderRadius:onHover&&'0.75rem'}} onMouseLeave={()=>setOnHover(false)} onMouseEnter={()=>setOnHover(true)} className={styles.container}>
            {payout.length>1 && bundleTitle()}
            {payout.slice(0,3).map((item,index)=>(
                singlePayout()
            ))}
            {payout.length>3&&
            <div className={`${styles.link} ${textStyles.m_16}`}>{`${payout.length - 3} more`}</div>}
            <div style={{flexDirection:'row', justifyContent:'space-between', width:'100%', display:'flex'}}>
                <div style={{background:onHover&&'white'}} className={styles.btnContainer}>
                    <div style={{color:onHover&&'black'}} className={textStyles.ub_14}>{checkApproval()?'Approved':'Approve Payment'}</div>
                </div>
                {onHover&&<div className={`${styles.signerOverview} ${textStyles.m_16}`}>
                {item.confirmations.length} of {delegates.length}
                </div>}
            </div>
        </div>
    )
    
}
import { Card, Col, Divider, Row, Typography } from 'antd'
import React, { useState } from 'react'
import TickSvg from "../../assets/Icons/tick.svg";
import styles from "./style.module.css";
import textStyles from '../../commonStyles/textType/styles.module.css'
import { BiDotsVerticalRounded } from 'react-icons/all'

export default function PaymentCard({item}) {

    const demoArticle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'

    const renderTitleInfo = () => (
        <>  
            <div className={styles.timeText} >9:30 PM, 22 Dec </div>
            <div className={styles.cardTitle}>Payout for Something -(0x48D2F1...)</div>
        </>
    )

    const renderContriParagraph = () => (
        <>
            <Typography.Paragraph
                style={{color:'#FFFFFF', fontFamily:'monospace', fontSize:'14px', opacity:0.56}}
                ellipsis={{
                    rows:3,
                    expandable: true,
                    onEllipsis: ellipsis => {
                        console.log('Ellipsis changed:', ellipsis);
                    },
                    symbol:<Typography.Link style={{color:'#FFFFFF', fontFamily:'monospace', fontSize:'14px', opacity:0.56, textDecoration:'underline'}}>read more</Typography.Link>
                    
                }}
            >
            {demoArticle}
            </Typography.Paragraph>
        </>
    )

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

    return(
        <div className={styles.container}>
            {payout.length>1 && bundleTitle()}
            {payout.slice(0,3).map((item,index)=>(
                singlePayout()
            ))}
            {payout.length>3&&
            <div className={`${styles.link} ${textStyles.m_16}`}>{`${payout.length - 3} more`}</div>}
            <div className={styles.btnContainer}>
                <div className={textStyles.ub_14}>Approve Payment</div>
            </div>
        </div>
    )
    
}
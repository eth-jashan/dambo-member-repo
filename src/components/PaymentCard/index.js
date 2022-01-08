import { Card, Col, Divider, Row, Typography } from 'antd'
import React, { useState } from 'react'
import TickSvg from "../../assets/Icons/tick.svg";
import styles from "./style.module.css";
import { MdEdit } from 'react-icons/md'

export default function PaymentCard() {

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

    return(
        <Card 
            hoverable 
            style={{
                width:'90%',
                background:'#121219', 
                border:0, borderRadius:'12px',  
                alignSelf:'center', 
                padding:'24px 24px 24px 24px', 
                textAlign:'left'
            }}
        >
        {renderTitleInfo()}
        {renderContriParagraph()}
            <a className={styles.textLink}>(1/2) Waiting for others to approve</a>
        </Card>
        )
    
}
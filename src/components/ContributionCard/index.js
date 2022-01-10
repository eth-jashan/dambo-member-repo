import { Card, Col, Divider, Row, Typography } from 'antd'
import React, { useState } from 'react'
import TickSvg from "../../assets/Icons/tick.svg";
import styles from "./style.module.css";
import { MdEdit } from 'react-icons/md'

export default function ContributionCard() {

    const demoArticle = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'

    const [isFocus, setIsFocus] = useState(false)
    const [amount, setAmount] = useState()

    const renderTitleInfo = () => (
        <Row align='middle' justify='space-between'>
            <div className={styles.cardTitle}>Design for landing page</div>
            <>
                <div className={styles.timeText} >9:30 PM, 22 Dec</div>
            </>
        </Row>
    )

    const renderContriInfo = () => (
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <div className={styles.projectTitle}>Project Link</div>
            <div className={styles.projectContributor}>Aviral</div>
            <div className={styles.projectContributor}>40 hrs</div>
        </div>
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
            <Divider style={{border:'1px solid #2F2F3C'}} />
        </>
    )

    const getInputContainerBackground = () => {
        if(isFocus){
            return '#E1DCFF'
        }else if (!isFocus && parseFloat(amount)>0){
            return '#6852FF'
        }else if(!isFocus){
            return 'white'
        }
    }

    const renderAmountInput = () => (
        <Col span={6}>
            <div className={styles.inputContainer} style={{background:getInputContainerBackground()}}>
                <div className={styles.flexContainer}>
                    <span className={styles.amountText} style={{color:!isFocus && parseFloat(amount)>0?'white':'#6852FF'}}>Ξ</span>   
                    <input value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Enter Amount"  onFocus={()=>setIsFocus(true)} onBlur={()=>setIsFocus(false)} style={{color:!isFocus && parseFloat(amount)>0?'white':'#6852FF'}} className={styles.input} />
                </div>
                {isFocus && <img onClick={()=>setIsFocus(false)} src={TickSvg} alt='tick' />}
                {(!isFocus && parseFloat(amount)>0)&&<MdEdit className={styles.logoEdit} onClick={()=>setIsFocus(true)} color={'white'} />}
            </div>
        </Col>
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
        <Row className={styles.contriInfoRow} justify='space-between'>
            {renderContriInfo()}
            <Col span={18}>
                {renderContriParagraph()}
            </Col>
        </Row>
        <div className={styles.inputDiv}>
            {renderAmountInput()}
            <span className={styles.streamText}>Design Stream</span>
        </div>
        </Card>
        )
    
}
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
            <Typography.Text style={{fontSize:'20px', fontFamily:'monospace', color:'white'}}>Design for landing page</Typography.Text>
            <>
                <Typography.Text style={{fontSize:'14px', fontFamily:'monospace', opacity:0.56, color:'white'}} >9:30 PM, 22 Dec</Typography.Text>
            </>
        </Row>
    )

    const renderContriInfo = () => (
        <div style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
            <Typography.Link style={{color:'#FFFFFF', fontFamily:'monospace', textDecoration:'underline', fontSize:'14px'}}>Project Link</Typography.Link>
            <Typography.Text style={{color:'#FFFFFF', fontFamily:'monospace', fontSize:'14px'}}>Aviral</Typography.Text>
            <Typography.Text style={{color:'#FFFFFF', fontFamily:'monospace', fontSize:'14px'}}>40 hrs</Typography.Text>
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
            <div style={{width:'100%', display:'flex', flexDirection:'row',padding:'6px 12px 6px 12px', justifyContent:'space-between', borderRadius:'12px', background:getInputContainerBackground()}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <Typography.Text style={{fontFamily:'monospace',color:!isFocus && parseFloat(amount)>0?'white':'#6852FF', fontSize:'16px'}}>Ξ</Typography.Text>   
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
        <Row style={{marginTop:'12px'}} justify='space-between'>
            {renderContriInfo()}
            <Col span={18}>
                {renderContriParagraph()}
            </Col>
        </Row>
        <div style={{flexDirection:'row', display:'flex',alignItems:'center'}}>
            {renderAmountInput()}
            <Typography.Link style={{color:'#FFFFFF', fontFamily:'monospace', textDecoration:'underline', fontSize:'14px', marginLeft:'20px'}}>Design Stream</Typography.Link>
        </div>
        </Card>
        )
    
}
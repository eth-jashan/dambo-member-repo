import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { rejectContriRequest } from '../../../store/actions/transaction-action'
import styles from './styles.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import cross from '../../../assets/Icons/cross.svg'
import { Typography } from 'antd'

const RequestItem = ({item, tokenItem, approved_request}) => {

    const dispatch = useDispatch()

    const [onCancelHover, setCancelHover] = useState(false)

    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.map((item, index)=>{
            usd_amount.push(((item?.usd_amount) * parseFloat(item?.amount)))
        })
        let amount_total
        usd_amount.length ===0?amount_total=0: amount_total = usd_amount.reduce((a,b)=>a+b)
        return amount_total.toFixed(2)
    }

    //console.log('item....', item)

    return(
            <div className={styles.requestItem}>
            <div style={{width:'100%', display:'flex', flexDirection:'row'}}>
                <div style={{width:'5.2%'}}>
                    <div onClick={async()=>await dispatch(rejectContriRequest(item?.contri_detail?.id))} onMouseLeave={()=>setCancelHover(false)} onMouseEnter={()=>setCancelHover(true)} className={styles.cancel}>
                        <img src={cross} alt='cancel' className={styles.cross}/>
                        {onCancelHover&&<div className={textStyles.m_14}>Cancel Approval</div>}
                    </div>
                </div>
                <Typography.Paragraph style={{marginLeft:'0.75rem'}} ellipsis={{rows:1}} className={`${textStyles.ub_19} ${styles.alignText}`}>
                    {item?.contri_detail?.title}
                </Typography.Paragraph>
            </div>
                <div className={styles.infoContainer}>
                    <div style={{width:'60%',marginLeft:'0.75rem'}}>
                        <div className={`${textStyles.m_16} ${styles.alignText}`}>
                            {item?.contri_detail?.stream?.toLowerCase()}  •  {item?.contri_detail?.time_spent} hrs
                        </div>
                        <div className={`${textStyles.m_16} ${styles.alignText}`}>
                            {item?.contri_detail?.requested_by?.metadata?.name?.split(' ')[0]}  •  {`${item?.contri_detail?.requested_by?.public_address?.slice(0,4)}...${item?.contri_detail?.requested_by?.public_address?.slice(-3)}`}
                        </div>
                        <Typography.Paragraph ellipsis={{rows:2}} className={`${textStyles.m_16} ${styles.greyedText}`}>
                            {/* Jashan has been doing the phenominal boi, keep it up GG. */}
                        </Typography.Paragraph>
                    </div>
                    <div>
                        {item?.payout.map((item, index)=>{
                            return tokenItem(item)
                        })}
                        <div style={{textAlign:'end'}} className={`${textStyles.m_16} ${styles.usdText}`}>
                            {approved_request.length===0?0:getPayoutTotal(item?.payout)}$
                        </div>
                    </div>
                </div>
            </div>
        
    )

}

export default RequestItem
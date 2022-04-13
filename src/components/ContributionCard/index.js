import React, { useState } from 'react'
import styles from './style.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setTransaction } from '../../store/actions/transaction-action'
import { convertTokentoUsd } from '../../utils/conversion'
import three_dots from "../../assets/Icons/three_dots.svg";
import { setContributionDetail } from '../../store/actions/contibutor-action'

export default function ContributionCard({item}) {

    const dispatch = useDispatch()
    const contri_filter_key = useSelector(x=>x.dao.contri_filter_key)
    const role = useSelector(x=>x.dao.role)
    console.log('item', item)
    const onContributionPress = async() => {
        if(role==='ADMIN'){
            const ethPrice = await convertTokentoUsd('ETH')
            if(ethPrice && contri_filter_key !== 0 ){
                dispatch(setTransaction(item, ethPrice))
            }else if (contri_filter_key === 0){
                dispatch(setTransaction(item, ethPrice))
            }
        }else{
            console.log('item', item)
            dispatch(setContributionDetail(item))
        }
    }

    const [onHover, setOnHover] = useState(false)

    const getStatusProperty = () => {
        if(item.status === 'APPROVED' && item.payout_status==='REQUESTED'){
            return {color:'#A2FFB7', title:'approved'}
        }if(item.status === 'REQUESTED'){
            return {color:'#FFC664', title:'active'}
        }
        else if (item.status === 'REJECTED'){
            return {color:'#808080', title:'rejected'}
        }else if(item.status === 'APPROVED' && item.payout_status === 'PAID'){
            return {color:'#808080', title:'paid'}
        }
    }

    const getContributionStatus = () => {
        if(item.status === 'REQUESTED'){
            return{title:'waiting for approval', color:'#FFC664'}
          }
          else if(item.status === 'REJECTED'){
            return{title:'rejected', color:'red'}
          }
          else if (item.status === 'APPROVED'&&item?.payout_status !== 'PAID'){
            return{title:'waiting for signing', color:'#FFC664'}
          }
          if(item?.status==='APPROVED'&&item?.payout_status==='PAID'){
            return{title:'executed', color:'white'}
          }
    }

    return(
        <div 
            onMouseEnter={()=>setOnHover(true)} 
            onMouseLeave={()=>setOnHover(false)} 
            onClick={()=>onContributionPress()} 
            className={styles.container}
        >
            <div className={styles.titleContainer}>
                <div style={{fontFamily:onHover&&'TelegrafBolder'}} className={`${textStyles.m_16} ${styles.title}`}>{item?.title}</div>
            </div>
            <div className={styles.statusContainer}>
                {contri_filter_key && role!=='ADMIN'?null:<div className={textStyles.m_16} style={{color:getStatusProperty()?.color, textAlign:'start'}}>{getStatusProperty()?.title}</div>}
            </div>
            <div className={styles.descriptionContainer}>
                <div style={{color:onHover&&'white'}} className={`${textStyles.m_16} ${styles.description}`}>{`${item?.requested_by?.metadata?.name?.toLowerCase()}  •  ${item?.stream?.toLowerCase()}  •  ${item?.time_spent} hrs`}</div>
            </div>
            {role==='ADMIN'?null:
            <div className={styles.statusContributorContainer}>
                <div className={textStyles.m_16} style={{color:getContributionStatus()?.color, textAlign:'start'}}>{getContributionStatus()?.title}</div>
                {item?.status==='APPROVED'&&item?.payout_status==='PAID'&&<div style={{color:'#ECFFB8'}} className={textStyles.m_16}> • claim badge</div> }
            </div>}
            <img className={styles.menuIcon} alt='menu' src={three_dots} />
        </div>
    )
    
}
import React, { useState } from 'react'
import styles from './style.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { BiDotsVerticalRounded } from 'react-icons/all'
import { useDispatch } from 'react-redux'
import { setTransaction } from '../../store/actions/transaction-action'

export default function ContributionCard({item}) {

    const dispatch = useDispatch()

    const onContributionPress = () => {
        dispatch(setTransaction(item))
    }

    const [onHover, setOnHover] = useState(false)

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
            <div className={styles.descriptionContainer}>
                <div style={{color:onHover&&'white'}} className={`${textStyles.m_16} ${styles.description}`}>{`${item?.requested_by?.metadata?.name?.toLowerCase()}  •  ${item?.stream?.toLowerCase()}  •  ${item?.time_spent} hrs`}</div>
            </div>
            <BiDotsVerticalRounded size={'1rem'} color='#999999'  />
        </div>
    )
    
}
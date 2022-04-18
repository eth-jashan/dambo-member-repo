import React from 'react'
import styles from './style.module.css'
import textStyle from '../../../commonStyles/textType/styles.module.css'
import { useSelector } from 'react-redux'

const ContributionOverview = () => {

    const payoutInfo = () => (
        
        <div className={styles.payoutContainer}>
            <div style={{color:'white', textAlign:'start'}} className={textStyle.m_16}>{contributionOverview?.total_payout.length} Payouts</div>
            <div className={styles.flex_totalPayout}>
                <div style={{color:'#FFFFFF66'}} className={textStyle.m_16}>Total Payout</div>
                <div style={{color:'#ECFFB8'}} className={textStyle.m_16}>{(contributionOverview?.total_amount).toFixed(2)}$</div>
            </div>
            <div className={styles.divider} />
            {contributionOverview.token_info.length>0&&
            contributionOverview.token_info?.map((x,i)=>(
                <div style={{marginTop:'1.5rem'}} className={styles.flex_totalPayout}>
                    <div style={{color:'white'}} className={textStyle.m_14}>{(x?.amount).toFixed(2)} {x?.symbol}</div>
                    <div style={{color:'#FFFFFF66'}} className={textStyle.m_16}>{(x?.value).toFixed(2)}$</div>
                </div>
            ))}
        </div>
    )

    const claimed = useSelector(x=>x.contributor.claimed)
    const unclaimed = useSelector(x=>x.contributor.unclaimed)
    const contributionOverview = useSelector(x=>x.dao.contributionOverview)

    const contributionStats = () => (
        <div className={styles.contributionContainer}>
            <div style={{color:'white', textAlign:'start', borderBottom:'1px solid #292929', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>{contributionOverview?.total_payout.length} Payouts</div>
            <div style={{color:'white', textAlign:'start', borderBottom:'1px solid #292929', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>{claimed.length} Claimed badges</div>
            <div style={{color:'white', textAlign:'start', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>{unclaimed.length} Unclaimed badges</div>
        </div>
    )

    return(
        <div className={styles.container}>
            <div style={{color:'white', textAlign:'start'}} className={textStyle.ub_23}>Overview</div>
            {payoutInfo()}
            {contributionStats()}
        </div>
    )

}

export default ContributionOverview
import React from 'react'
import styles from './style.module.css'
import textStyle from '../../../commonStyles/textType/styles.module.css'

const ContributionOverview = () => {

    const payoutInfo = () => (
        
        <div className={styles.payoutContainer}>
            <div style={{color:'white', textAlign:'start'}} className={textStyle.m_16}>1 Payouts</div>
            <div className={styles.flex_totalPayout}>
                <div style={{color:'#FFFFFF66'}} className={textStyle.m_16}>Total Payout</div>
                <div style={{color:'#ECFFB8'}} className={textStyle.m_16}>1250$</div>
            </div>
            <div className={styles.divider} />
            <div style={{marginTop:'1.5rem'}} className={styles.flex_totalPayout}>
                <div style={{color:'white'}} className={textStyle.m_14}>0.25 ETH</div>
                <div style={{color:'#FFFFFF66'}} className={textStyle.m_16}>1250$</div>
            </div>
            <div className={styles.flex_totalPayout}>
            <div style={{color:'white'}} className={textStyle.m_14}>0.25 ETH</div>
                <div style={{color:'#FFFFFF66'}} className={textStyle.m_16}>1250$</div>
            </div>
        </div>
    )

    const contributionStats = () => (
        <div className={styles.contributionContainer}>
            <div style={{color:'white', textAlign:'start', borderBottom:'1px solid #292929', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>1 Payouts</div>
            <div style={{color:'white', textAlign:'start', borderBottom:'1px solid #292929', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>1 Claimed badges</div>
            <div style={{color:'white', textAlign:'start', paddingTop:'1rem', paddingLeft:'1rem', paddingBottom:'1rem'}} className={textStyle.m_14}>1 Unclaimed badges</div>
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
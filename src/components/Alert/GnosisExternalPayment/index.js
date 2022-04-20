import React from 'react'
import styles from './style.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css';
import warning from '../../../assets/Icons/yellow_warning.svg'
import { useSelector } from 'react-redux';

const GnosisExternalPayment = () => {

    const currentDao = useSelector(x=>x.dao.currentDao)

    return(
        <div className={styles.container}>
            <img src={warning} alt='waring' className={styles.warning} />
            <div>
                {/* <div style={{color:'#FFC664', textAlign:'start'}} className={textStyles.ub_16}>Transaction pending on Gnosis,</div> 
                <div style={{color:'#FFC664', textAlign:'start'}} className={textStyles.m_16}>Execute it first to execute pending payments.<a href={`https://gnosis-safe.io/app/rin:${currentDao?.safe_public_address}/balances`} style={{textDecoration:'underline',color:'#FFC664'}}> Go to Gnosis</a></div> */}
            </div>
        </div>
    )

}

export default GnosisExternalPayment
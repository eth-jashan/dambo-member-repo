import React from 'react'

import cross from '../../assets/Icons/cross_white.svg'
import active_tick from '../../assets/Icons/active_tick.svg'
import styles from './style.module.css'
import textStyle  from "../../commonStyles/textType/styles.module.css";
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import moment from 'moment'

const PaymentSlideCard = () =>{

    const token_coin = ['0.002 ETH', '4 SOL']
    const currentPayment = useSelector(x=>x.transaction.currentPayment)
    
    const delegates = useSelector(x=>x.dao.delegates)

    const renderContribution = () => (
        <div className={styles.contribContainer}>
            <div className={styles.leftContent}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    1600$
                </div>

                {token_coin.map((item, index)=>(
                    <div className={`${textStyle.m_16} ${styles.darkerGrey}`}>{item}</div>
                ))}

            </div>
            <div className={styles.rightContainer}>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    Design for landing page
                </div>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    sangy  •  0X273...12a
                </div>
            </div>
        </div>
    )

    const checkApproval = (address) => {
        let status
        currentPayment?.confirmations.map((item, index)=>{
            if(address === ethers.utils.getAddress(item.owner)){
                status = true
            }else{
                status = false
            }
        })
        return status
    }

    console.log(currentPayment?.confirmations[0].owner=== delegates[0], currentPayment?.confirmations[0].owner=== delegates[0])

    const renderSigners = () => (
        <div className={styles.signerContainer}>
        {delegates.map((item, index)=><div className={styles.singleSigner}>
            <div style={{display:'flex', alignItems:'flex-start'}} className={styles.leftContent}>
            {checkApproval(item)&&<img onClick={()=>console.log('on cross press')} src={active_tick} alt='cross' className={styles.tick} />}
            </div>
            <div style={{display:'flex', flexDirection:'row'}} className={styles.rightContainer}>
                <div style={{color: checkApproval(item)&&'#ECFFB8'}} className={`${textStyle.m_16} ${styles.greyishText}`}>
                    aviral
                </div>
                <div className={`${textStyle.m_16} ${styles.greyishText}`}>
                    •  {item?.slice(0,5)+'...'+item.slice(-3)}
                </div>
            </div>
        </div>)}
        </div>
    )
    
    return(
        <div className={styles.container}>
            <img onClick={()=>console.log('on cross press')} src={cross} alt='cross' className={styles.cross} />

            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                2900$
            </div>
            <div className={`${textStyle.ub_23} ${styles.whiteText}`}>
                Bundled Payments • 2
            </div>
            <div style={{marginBottom:'2.5rem'}} className={`${textStyle.m_23} ${styles.greyishText}`}>
                {moment(currentPayment?.submissionDate).format("h:mm a , Do MMM['] YY")}
                
            </div>
            {renderContribution()}
            {renderContribution()}
            <div className={styles.signerHeading}>
            <div>
                <div className={`${textStyle.m_16} ${styles.darkerGrey}`}>
                {currentPayment?.confirmations.length} of {delegates.length} Signed
                </div>
            </div>
            </div>
            {renderSigners()}
        </div>
    )

}

export default PaymentSlideCard
import React from 'react'
import styles from './style.module.css'
const POCPBadge = ({name}) => {
    const link = 'https://www.albawaba.com/sites/default/files/styles/d08_standard/public/im_new/payton/AN.jpg?h=79104f28&itok=YAcqww-s'
    return(
        <div className={styles.container}>
            <div className={styles.upperContainer}>
                <div className={styles.streamTitle}>Design</div>
                <div style={{justifyContent:'space-between', alignItems:'center'}} className={styles.daoInfoContainer}>
                <div className={styles.daoTitle}>Eveels DAO</div>
                <img className={styles.daoProfile} src={'https://lh3.googleusercontent.com/ULjfyo4LJhtV3J9K7lu1xh0YZQBa6WHPp-cwlV2C9sUIyTpgSlv554mh_97fRXsziOIu9xwpukl5NQoDbkE3mlXlWR8zU7qcWQsxVg=w600'} alt='dao-profile' />
                </div>
            </div>
            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
                <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                    <div className={styles.triangle_bottomright}/>
                    <div className={styles.rectangle}/>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.title}>Assets for Landing page</div>
                    <div className={styles.daoInfoContainer}>
                    <div className={styles.to}>To:</div>
                    <div className={styles.to}>aviralsb.eth</div>
                    </div>
                    <div style={{marginBottom:'3rem'}} className={styles.daoInfoContainer}>
                    <div className={styles.to}>By:</div>
                    <div className={styles.to}>snow.eth</div>
                    </div>

                    <div style={{justifyContent:'space-between'}} className={styles.daoInfoContainer}>
                    <div className={styles.to}>29 march</div>
                    <div className={styles.to}>drepute</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default POCPBadge
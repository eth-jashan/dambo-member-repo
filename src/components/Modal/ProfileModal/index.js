import React from 'react'
import styles from './style.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import CrossSvg from "../../..//assets/Icons/cross.svg";
import copy_black from "../../../assets/Icons/copy_black.svg";
import chevron_right from '../../../assets/Icons/chevron_right.svg'
import email from '../../../assets/Icons/email_black.svg'
import setting from '../../../assets/Icons/settings_black.svg'
import { useSelector } from 'react-redux';

const ProfileModal = () => {

    const address = useSelector(x=>x.auth.address)
    
    return(
        
        <div className={styles.modal}>
            {/* <img src={CrossSvg} className={styles.cross} alt='cross' /> */}

            <div className={styles.disconnectDiv} style={{marginTop:'1.5rem'}}>
                <div>
                    <div className={styles.dot}/>
                    <div>
                        <div className={textStyles.m_14}>0X4jh...4h3</div>
                        <div style={{textDecoration:'underline'}} className={textStyles.m_14}>disconnect</div>
                    </div>
                </div>
                <img src={copy_black} className={styles.copy} alt='cross' />
            </div>

            <div className={styles.divider}/>

            <div className={styles.singleOption}>
                <div>
                <img src={setting} alt='setting' className={styles.icon} />
                    <div className={textStyles.m_16}>
                        Settings
                    </div>
                </div>
                <img src={chevron_right} alt='chevro_right' className={styles.chevron} />
            </div>

            <div style={{marginTop:'4px', width:'90%', alignSelf:'center'}} className={styles.divider}/>

            <div className={styles.singleOption}>
                <div>
                    <img src={email} alt='email' className={styles.icon} />
                    <div className={textStyles.m_16}>
                        Contact Us
                    </div>
                </div>
                <img src={chevron_right} alt='chevro_right' className={styles.chevron} />
            </div>
            
        </div>
        
    )

}

export default ProfileModal
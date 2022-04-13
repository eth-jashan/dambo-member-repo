import React from 'react'
import styles from './style.module.css'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import CrossSvg from "../../..//assets/Icons/cross.svg";
import copy_black from "../../../assets/Icons/copy_black.svg";
import chevron_right from '../../../assets/Icons/chevron_right.svg'
import email from '../../../assets/Icons/email_black.svg'
import setting from '../../../assets/Icons/settings_black.svg'
import { useDispatch, useSelector } from 'react-redux';
import { switchRole } from '../../../store/actions/dao-action';

const AccountSwitchModal = ({onChange}) => {

    const address = useSelector(x=>x.auth.address)
    const dispatch = useDispatch()
    const changeRole = (role) => {
        dispatch(switchRole(role))
        onChange()
    }
    
    return(
        
        <div className={styles.modal}>
            <div onClick={()=>changeRole('ADMIN')} className={styles.singleOption}>
                <div>
                <img src={setting} alt='setting' className={styles.icon} />
                    <div className={textStyles.m_16}>
                        Approval view
                    </div>
                </div>
                <img src={chevron_right} alt='chevro_right' className={styles.chevron} />
            </div>

            <div style={{marginTop:'4px', width:'90%', alignSelf:'center'}} className={styles.divider}/>

            <div onClick={()=>changeRole('CONTRIBUTOR')} className={styles.singleOption}>
                <div>
                    <img src={email} alt='email' className={styles.icon} />
                    <div className={textStyles.m_16}>
                        Contributor view
                    </div>
                </div>
                <img src={chevron_right} alt='chevro_right' className={styles.chevron} />
            </div>
            
        </div>
        
    )

}

export default AccountSwitchModal
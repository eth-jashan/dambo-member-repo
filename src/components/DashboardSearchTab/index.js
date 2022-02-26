import React from 'react'
import { MdOutlineFilterAlt, BiSearchAlt2 } from 'react-icons/all'
import styles from './styles.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useSelector } from 'react-redux'

const DashboardSearchTab = () => {

    const contribution_request = useSelector(x=>x.dao.contribution_request)

    return(
        <div className={styles.container}>
            <div className={`${textStyles.m_16} ${styles.text}`}>
                {contribution_request?.length} Contribution requests
            </div>
            <div>
                <BiSearchAlt2 color='#808080' size='1rem'  />
                <MdOutlineFilterAlt style={{marginLeft:'1.25rem'}} color='#808080' size='1rem'  />
            </div>
        </div>
    )

}

export default DashboardSearchTab
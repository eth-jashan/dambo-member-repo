import React from 'react'
import styles from './style.modules.css'

const DashboardHeader = () => {
    return(
        <div className={styles.header}>
            <div className={styles.headerText}>
                Chain Runner DAO
            </div>
        </div>
    )
}

export default DashboardHeader
import React from "react"

import textStyles from "../../../commonStyles/textType/styles.module.css"
import styles from "./style.modules.css"

const TransactionToast = () => {
    return (
        <div className={styles.container}>
            <div className={styles.infoContainer}>
                <div style={{ color: "white" }} className={textStyles.m_16}>
                    Payment Executed • 2,900$
                </div>
            </div>
            <div>
                <div style={{ color: "white" }} className={textStyles.ub_16}>
                    Details
                </div>
            </div>
        </div>
    )
}

export default TransactionToast

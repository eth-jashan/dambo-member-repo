import React from "react"
import styles from "./style.modules.css"
import { AiOutlineCaretDown } from "react-icons/all"

import textStyles from "../../commonStyles/textType/styles.module.css"

const Paybutton = () => {
    return (
        <div className={styles.payBtnCnt}>
            <div className={styles.payBtnChild}>
                <div className={`${styles.whiteText} ${textStyles.ub_16}`}>
                    1 Request approved
                </div>
                <AiOutlineCaretDown size={18} color="white" />
            </div>
            <div className={`${styles.payBtnLeft} ${styles.border}`}>
                <div className={`${styles.whiteText} ${textStyles.m_16}`}>
                    2,500$
                </div>

                <div className={styles.payNow}>Sign and Pay Now</div>
            </div>
        </div>
    )
}

export default Paybutton

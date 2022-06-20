import React from "react"

import textStyles from "../../../commonStyles/textType/styles.module.css"
import { assets } from "../../../constant/assets"
import styles from "./style.module.css"

const TestnetInfo = () => {
    return (
        <div>
            <div className={styles.triangle} />
            <div className={styles.tooltip}>
                <div className={textStyles.m_14}>
                    You are active on testnet(rinkeby), switch to ethereum to
                    use rep3 on mainnet.{" "}
                </div>
                <img className={styles.icon} src={assets.icons.errorIcon} />
            </div>
        </div>
    )
}

export default TestnetInfo

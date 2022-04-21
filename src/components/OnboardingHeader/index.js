import React from "react"
import WalletPicker from "../../components/WalletPicker"
import { Row, Col, Typography } from "antd"
import { useSelector } from "react-redux"
import styles from "./style.module.css"

export default function Header({ children, decreaseStep, signer }) {
    const jwt = useSelector((x) => x.auth.jwt)

    return (
        <div
            align="middle"
            justify="center"
            style={{
                width: "100%",
            }}
        >
            <div className={styles.headerCnt}>
                <div className={styles.headerName}>Drepute</div>

                {jwt && (
                    <div>
                        <WalletPicker signer={signer} />
                    </div>
                )}
            </div>
        </div>
    )
}

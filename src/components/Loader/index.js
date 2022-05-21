import React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import styles from "./style.module.css"
const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />

export default function Loader() {
    return <Spin indicator={antIcon} className={styles.loader} />
}

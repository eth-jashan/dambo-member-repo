import { Tooltip } from "antd"
import React, { useEffect, useState } from "react"
import styles from "./style.module.css"
import defaultPic from "../../assets/defaultPic.png"

export default function AccountPic({ item, changeAccount, currentDao, index }) {
    const text = (item) => <span>{item}</span>
    const [image, setImage] = useState(false)
    function checkImage(url) {
        const image = new Image()
        let status
        image.onload = function () {
            if (this.width > 0) {
                console.log("image exists")
                setImage(url)
            }
        }
        image.onerror = function () {
            console.log("image doesn't exist")
            // status = false
            setImage(false)
        }
        image.src = url
        // return status
    }
    useEffect(() => {
        checkImage(item?.dao_details?.logo_url)
    }, [currentDao?.uuid])
    return (
        <div className={styles.accountContainer} key={item.dao_details?.uuid}>
            <Tooltip
                placement="right"
                title={() => text(item?.dao_details?.name)}
            >
                <div
                    onClick={async () => await changeAccount(item, index)}
                    style={{
                        height: "2.25rem",
                        width: "100%",
                        background: "transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                        cursor: "pointer",
                    }}
                >
                    {currentDao?.uuid === item.dao_details?.uuid && (
                        <div className={styles.selectedDao}></div>
                    )}

                    {item?.dao_details?.logo_url ? (
                        <img
                            src={
                                image ? item?.dao_details?.logo_url : defaultPic
                            }
                            alt="logo"
                            height="100%"
                            style={{
                                borderRadius: "2.25rem",
                                background: "black",
                                width: "2.25rem",
                                margin: "0 auto",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                height: "2.25rem",
                                borderRadius: "2.25rem",
                                width: "2.25rem",
                                background: "#FF0186",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "0 auto",
                            }}
                        />
                    )}
                </div>
            </Tooltip>
        </div>
    )
}

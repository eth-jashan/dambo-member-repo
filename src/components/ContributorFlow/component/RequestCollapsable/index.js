import React, { useEffect, useState } from "react"
import "./style.scss"
// import axios from "axios"
import { assets } from "../../../../constant/assets"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
)

export default function RequestCollapsable({
    title,
    children,
    onOpenCallback = () => {},
    defaultCollapseState = false,
    showSyncing = false,
    isPast = false,
    contributions,
}) {
    const [collapsable, setCollapsable] = useState(
        !!(contributions?.length && !isPast)
    )

    const toggleCollapse = () => {
        if (!collapsable) {
            onOpenCallback()
        }
        setCollapsable(!collapsable)
    }
    useEffect(() => {
        if (contributions?.length && !isPast) {
            setCollapsable(true)
        }
    }, [contributions])
    return (
        <div className="contributor-request-collapsable-container">
            <div onClick={toggleCollapse} className="collapsable-div">
                <img
                    src={
                        collapsable
                            ? assets.icons.chevronUpWhite
                            : assets.icons.chevronDownWhite
                    }
                />
                <div className="approver-title">{title}</div>
                {showSyncing && (
                    <span>
                        Syncing <Spin indicator={antIcon} />
                    </span>
                )}
            </div>
            {collapsable && <div className="open-collapsable">{children}</div>}
        </div>
    )
}

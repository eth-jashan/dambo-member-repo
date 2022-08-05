import React, { useState } from "react"
import "./style.scss"
// import axios from "axios"
import { assets } from "../../../../constant/assets"

export default function RequestCollapsable({
    title,
    children,
    onOpenCallback = () => {},
    defaultCollapseState = false,
}) {
    const [collapsable, setCollapsable] = useState(defaultCollapseState)

    const toggleCollapse = () => {
        if (!collapsable) {
            onOpenCallback()
        }
        setCollapsable(!collapsable)
    }
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
            </div>
            {collapsable && <div className="open-collapsable">{children}</div>}
        </div>
    )
}

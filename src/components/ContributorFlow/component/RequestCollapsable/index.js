import React, { useState } from "react"
import "./style.scss"
import { useSelector } from "react-redux"
// import axios from "axios"
import { useNetwork } from "wagmi"
import { assets } from "../../../../constant/assets"
import ContributionCardV2 from "../ContributionCard"

export default function RequestCollapsable({ title, contributions }) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const [collapsable, setCollapsable] = useState(false)
    console.log("item", contributions)
    return (
        <div className="contributor-request-collapsable-container">
            <div
                onClick={() => setCollapsable(!collapsable)}
                className="collapsable-div"
            >
                <img
                    src={
                        collapsable
                            ? assets.icons.chevronUpWhite
                            : assets.icons.chevronDownWhite
                    }
                />
                <div className="approver-title">{title}</div>
            </div>
            {collapsable && (
                <div className="open-collapsable">
                    {contributions.map((x, i) => (
                        <ContributionCardV2
                            key={i}
                            index={i}
                            isMinimum={i !== 0}
                            item={x}
                        />
                    ))}
                    {/* <ContributionCardV2 selected={true} isMinimum={true} /> */}
                </div>
            )}
        </div>
    )
}

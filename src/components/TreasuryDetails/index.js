import React from "react"
import "./style.scss"
import { useSelector } from "react-redux"

export default function TreasuryDetails() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    console.log("current Dao", currentDao)

    return (
        <div className="treasury-details-container">
            <div className="treasury-info-wrapper">
                <div className="safe-info-wrapper">
                    <div className="safe-details">
                        <div className="safe-name-and-avatar-wrapper">
                            <div className="safe-avatar"></div>
                            <div className="safe-name-and-address">
                                <div className="safe-name">
                                    {currentDao.name}
                                </div>
                                <div className="safe-address">
                                    eth:
                                    {currentDao?.safe_public_address?.slice(
                                        0,
                                        5
                                    )}
                                    ...
                                    {currentDao?.safe_public_address?.slice(-4)}
                                </div>
                            </div>
                        </div>
                        <div className="safe-links">
                            <div className="link">Copy address</div>
                            <div className="separator">•</div>
                            <div className="link">View on etherscan</div>
                        </div>
                    </div>
                    <div className="safe-owner-details">owner details</div>
                </div>
                <div className="treasury-tokens-info">
                    <div className="treasury-tokens-nav">tokens nav</div>
                    <div className="token-details-wrapper">tokens details</div>
                </div>
            </div>
        </div>
    )
}

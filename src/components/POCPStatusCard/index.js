import React from "react"
import { assets } from "../../constant/assets"
import "./styles.scss"

const POCPStatusCard = ({
    approverStatus,
    showOkay,
    approvedBadgeLength,
    onOkayClick,
    approvingFailed,
    onTryAgain,
}) => {
    const indicatorCircles = (status) => {
        return (
            <div className="indicator-circle-border">
                {status && <div className="indicator-inner-circle" />}
            </div>
        )
    }

    // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    const getSwitchStatusTitle = () => {
        switch (approverStatus) {
            case "switching": {
                return "Change chain to Polygon to sign transaction"
            }

            case "signing":
                return "Sign request to mint badges"

            case "confirming":
                return "Signing badges, might take upto a min"

            case "switching-back-success":
                return "Switch Chain back to ethereum"

            case "switching-back-error":
                return "Transactions Failed,"
        }
    }

    const getSwitchStatusNumber = () => {
        switch (approverStatus) {
            case "switching": {
                return 1
            }

            case "signing": {
                return 2
            }

            case "confirming": {
                return 2
            }

            case "switching-back-success": {
                return 3
            }
        }
    }

    const stateIndicator = () => (
        <div className="indicator-container">
            {indicatorCircles(true)}
            <div className="indicator-connector" />
            {indicatorCircles(
                approverStatus !== "switching" &&
                    approverStatus !== "switching-back-error"
            )}
            <div className="indicator-connector" />
            {indicatorCircles(approverStatus === "switching-back-success")}
        </div>
    )

    return (
        <div className="pocp-status-card">
            {approverStatus === "switching-back-success" && (
                <div className="success-message">
                    <div>
                        <div className="greyed-text">Congratulations, </div>
                        <div>{approvedBadgeLength} badges minted</div>
                    </div>
                    {showOkay && (
                        <div onClick={() => onOkayClick()} className="okay-btn">
                            <div>okay</div>
                        </div>
                    )}
                </div>
            )}
            <div
                style={{
                    background:
                        approverStatus === "switching-back-error" && "#FFB22E",
                }}
                className="container"
            >
                <div className="indicator-div">
                    {stateIndicator()}
                    <div className="stage-info-container">
                        {approverStatus !== "switching-back-error" && (
                            <div className="step-info">
                                Step {getSwitchStatusNumber()} of 3
                            </div>
                        )}
                        <div className="flex-container">
                            <div className="step-stage">
                                {getSwitchStatusTitle()}
                            </div>
                            {approverStatus === "switching-back-error" && (
                                <div
                                    onClick={async () => await onTryAgain()}
                                    className="step-stage-try"
                                >
                                    try again
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <img src={assets.icons.infoIcon} className="info-icon" />
            </div>
        </div>
    )
}

export default POCPStatusCard

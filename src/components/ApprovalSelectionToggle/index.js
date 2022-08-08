import React from "react"
import { assets } from "../../constant/assets"
import textStyles from "../../commonStyles/textType/styles.module.css"
import "./styles.scss"
import MultiTextBox from "../Common/MultiTextBox"
import TokenInput from "../Common/TokenInput"
import { Progress, Switch } from "antd"
import { useSelector } from "react-redux"

const ApprovalSelectionToggle = ({
    feedback,
    setFeedback,
    type,
    toggleTitle,
    feedbackShow,
    setFeedBackSow,
    payDetail,
    addToken,
    updatedPayDetail,
    updateTokenType,
    active,
    setActive,
}) => {
    const availableToken = useSelector((x) => x.dao.balance)

    const renderPayTokenActive = () => {
        return (
            <div className="pay-token-div">
                {payDetail.map((x, i) => (
                    <div className="token-input-div" key={i}>
                        <TokenInput
                            payDetail={payDetail}
                            tokenInput={x.amount}
                            onChange={(e) => updatedPayDetail(e, i)}
                            updateTokenType={(x) => updateTokenType(x, i)}
                        />
                    </div>
                ))}
                {availableToken.length > 1 && (
                    <div onClick={() => addToken()} className="add-token-btn">
                        <img
                            src={assets.icons.plusGray}
                            className="plus-icon"
                        />
                        <div
                            style={{ color: "#8F8E8E", marginLeft: "0.75rem" }}
                            className={textStyles.m_16}
                        >
                            Add another token
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const renderMintActive = () => (
        <div>
            {!feedbackShow && (
                <div
                    onClick={() => setFeedBackSow(true)}
                    className="render-active-div"
                >
                    <div className="feedback-icon-container">
                        <img
                            className="plus-icon"
                            src={assets.icons.plusBlack}
                        />
                    </div>
                    <div style={{ color: "white" }} className={textStyles.m_16}>
                        {feedbackShow ? "Remove Feedback" : "Add Feedback"}
                    </div>
                </div>
            )}

            {feedbackShow && (
                <div>
                    <div className="feedback-container">
                        <div
                            onClick={() => setFeedBackSow(false)}
                            className="render-active-div"
                            style={{ borderRadius: 0 }}
                        >
                            <div className="feedback-icon-container">
                                <img
                                    className="plus-icon"
                                    src={assets.icons.minusWhite}
                                />
                            </div>
                            <div
                                style={{ color: "white" }}
                                className={textStyles.m_16}
                            >
                                Remove Feedback
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div className="progress-limit-container">
                                <Progress
                                    trailColor="#CCCCCC"
                                    strokeColor="#ECFFB8"
                                    strokeWidth={10}
                                    width={"1.25rem"}
                                    type="circle"
                                    showInfo={false}
                                    percent={(feedback.length / 144) * 100}
                                />
                            </div>
                            <div className="multi-box-container">
                                <MultiTextBox
                                    value={feedback}
                                    textLimit={144}
                                    setValue={(e) => setFeedback(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const renderActiveOption = () => {
        switch (type) {
            case "mint":
                return renderMintActive()
            case "token":
                return renderPayTokenActive()
            default:
                return null
        }
    }

    return (
        <div className="approval-selection-body">
            <div className={active ? "container-active" : "container"}>
                {/* {renderToggle()} */}
                <div className={active ? "toggle-div-active" : "toggle-div"}>
                    <div className="switch-container">
                        <Switch
                            onChange={() => setActive(!active)}
                            style={{ width: "36px" }}
                            checked={active}
                        />
                    </div>

                    <div
                        style={{ color: active ? "#ECFFB8" : "white" }}
                        className={active ? textStyles.ub_16 : textStyles.m_16}
                    >
                        {toggleTitle}
                    </div>
                </div>
            </div>

            {active && renderActiveOption()}
        </div>
    )
}

export default ApprovalSelectionToggle

import React from "react"
import "./style.scss"
import rightArrow from "../../assets/Icons/right_arrow_white.svg"
import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
)

export default function NextButton({
    text,
    isDisabled,
    isContributor,
    nextButtonCallback,
    isNext,
    isRep3Setup,
    isLoading = false,
}) {
    return (
        <div
            style={{ cursor: "pointer" }}
            onClick={!isDisabled ? nextButtonCallback : () => {}}
            className={`next-btn-container ${
                !isDisabled ? "btnCtn" : "btnCtnGreyed"
            }`}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div className="titleContainer">
                    <span className="whiteIcon">
                        {!isContributor && !isRep3Setup ? "Next" : text}
                    </span>
                    {!isRep3Setup && !isContributor && (
                        <span className="greyedText"> &bull; {text}</span>
                    )}
                </div>
                {isLoading ? (
                    <Spin indicator={antIcon} />
                ) : (
                    <img src={rightArrow} alt="right" className="icon" />
                )}
            </div>
        </div>
    )
}

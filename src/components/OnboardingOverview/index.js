import React from "react"
import "./style.scss"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { assets } from "../../constant/assets"
import NextButton from "../NextButton"

const OnboardingOverview = ({ increaseStep, setPayout, isPayout }) => {
    const renderOnboardingSteps = () => (
        <div className="onboardOverview">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    marginRight: "1rem",
                }}
            >
                <div className="pointer" />
                <div className="verticalDivider" />
                <div className="pointer" />
                <div className="verticalDivider" />
                <div className="pointer" />
            </div>
            <div>
                <div className={`${textStyles.m_19}`}>
                    Basic Community details like, name and image
                </div>
                <div className={`${textStyles.m_19} onboardingSteps`}>
                    Register People on Protocol
                </div>
                <div className={`${textStyles.m_19}`}>
                    Sign and register community
                </div>
            </div>
        </div>
    )

    const payoutSelection = () => (
        <div>
            <div className="selectionContainer">
                <img
                    onClick={setPayout}
                    className="checkboxOutline"
                    src={
                        isPayout
                            ? assets.icons.checkBoxActive
                            : assets.icons.checkoBoxOutline
                    }
                />
                <div className={`${textStyles.ub_19}`}>
                    I will be using rep3 for payouts as well
                </div>
            </div>
            <div
                style={{ marginLeft: "2rem", opacity: "0.5" }}
                className={`${textStyles.m_19}`}
            >
                requires multisig linking or creation
            </div>
        </div>
    )

    return (
        <div className="gnosisSafeListContainer layout">
            <div>
                <div className={`headingSecondary blackHeading`}>
                    Onboarding onto rep3 is faster than making popcorn
                </div>
                {renderOnboardingSteps()}
                <div className="divider" />
                {payoutSelection()}
            </div>
            <div className="buttonDiv">
                <div className="backDiv">
                    <img
                        src={assets.icons.backArrowBlack}
                        alt="right"
                        className="backIcon"
                    />
                    <div className="back-title">Back</div>
                </div>
                <NextButton
                    text={"Community Details"}
                    nextButtonCallback={async () => await increaseStep()}
                />
            </div>
        </div>
    )
}

export default OnboardingOverview

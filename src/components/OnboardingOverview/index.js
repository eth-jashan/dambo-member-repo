import { Typography, Popover, message, Steps } from "antd"
import React, { useCallback, useEffect } from "react"
// import styles from "./style.module.css"
import "./style.scss"
import { MdOutlineAdd } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import chevron_right from "../../assets/Icons/chevron_right.svg"
import info from "../../assets/Icons/info.svg"
import plus from "../../assets/Icons/plus_black.svg"
import textStyles from "../../commonStyles/textType/styles.module.css"
import {
    addSafeAddress,
    getAllSafeFromAddress,
    connectDaoToDiscord,
} from "../../store/actions/dao-action"
import { assets } from "../../constant/assets"
import NextButton from "../NextButton"
// import assets from '../../constant/assets'

// const { Step } = Steps

const OnboardingOverview = ({ increaseStep }) => {
    // const [searchParams, _setSearchParams] = useSearchParams()
    // const setCurrentStep = () => {
    //     setStep(2)
    // }
    // let safeList = useSelector((x) => x.dao.allSafeList)
    // if (!guildId) {
    //     safeList = safeList?.filter((x) => x.name === "")
    // }

    // const navigate = useNavigate()
    // const setGnosisWallet = async (x) => {
    //     if (x.guild_id) return
    //     if (guildId && x.name) {
    //         const res = await dispatch(
    //             connectDaoToDiscord(x.uuid, guildId, discordUserId)
    //         )
    //         if (res) {
    //             message.success("Discord registered to dao successfully")
    //             navigate("/dashboard")
    //         } else {
    //             message.error("Something went wrong please try again later")
    //         }
    //     } else {
    //         dispatch(addSafeAddress(x.addr))
    //         if (x.name !== "") {
    //             navigate("/dashboard")
    //         } else {
    //             setHasMultiSignWallet(true)
    //             setCurrentStep()
    //         }
    //     }
    // }

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
                    className="checkboxOutline"
                    src={assets.icons.checkoBoxOutline}
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
                    nextButtonCallback={increaseStep}
                    // isDisabled={!areValidOwners()}
                />
            </div>
        </div>
    )
}

export default OnboardingOverview

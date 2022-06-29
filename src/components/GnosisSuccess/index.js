import React, { useState } from "react"
import "./styles.scss"
import texStyles from "../../commonStyles/textType/styles.module.css"
import {
    chainSwitch,
    getSelectedChainId,
    processDaoToPOCP,
    setChainInfoAction,
} from "../../utils/POCPutils"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"
import Lottie from "react-lottie"
import confetti from "../../assets/lottie/confett-lottie.json"
import { ethers } from "ethers"
import { assets } from "../../constant/assets"
import NextButton from "../NextButton"

const GnosisSuccess = ({ increaseStep }) => {
    const jwt = useSelector((x) => x.auth.jwt)
    const pocpInfo = useSelector((x) => x.dao.pocp_register)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const setPocpAction = (chainId) => {
        setChainInfoAction(chainId)
    }

    const registerCallback = async (events) => {
        let chainId = getSelectedChainId()
        chainId = ethers.utils.hexValue(chainId.chainId)
        await chainSwitch(chainId)
        navigate("/dashboard")
    }
    const registerErrorCallback = () => setLoading(false)
    const signupForPocp = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const { chainId } = await provider.getNetwork()
        setPocpAction(chainId)
        setLoading(true)
        try {
            await processDaoToPOCP(
                pocpInfo.name,
                pocpInfo.owner,
                pocpInfo.dao_uuid,
                jwt,
                registerCallback,
                registerErrorCallback
            )
            // if (!res) {
            //     setLoading(false)
            // }
        } catch (error) {
            setLoading(false)
        }
    }
    const defaultOptions = {
        loop: false,
        animationData: confetti,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const renderBanner = () => (
        <div className="pocp-banner">
            <div>
                <div className="banner-heading">Signup for POCP</div>
                <div className="banner-para">
                    Proof of contribution protocol lets you give out
                    <br /> verifiable on chain credentials for all your DAO
                    <br />
                    contributions.{" "}
                </div>
            </div>
            <div
                onClick={async () => await signupForPocp()}
                className="banner-btn-div"
            >
                <div className="signup-btn">
                    <div>{loading ? "Signing Up..." : "Signup for POCP"}</div>
                </div>
                <div
                    onClick={() => navigate("/dashboard")}
                    className="skip-btn"
                >
                    Skip for now
                </div>
            </div>
        </div>
    )

    return (
        <div className="container pocp-signup-container">
            <div className={texStyles.ub_53}>Congratulations</div>
            <div className="secondary-text">
                Your multisig safe is
                <br /> created and ready to use
            </div>
            <Lottie
                isClickToPauseDisabled={true}
                options={defaultOptions}
                style={{
                    height: "40%",
                    width: "60%",
                    position: "absolute",
                    top: 0,
                }}
            />

            <div className={`${texStyles.m_36} opacity-text`}>
                Upnext registering community <br />
                onto the protocol.
            </div>

            <div className="bottomBar">
                <div className="backDiv">
                    <img
                        src={assets.icons.backArrowBlack}
                        alt="right"
                        className="backIcon"
                    />
                    <div className="backTitle">Back</div>
                </div>
                <NextButton
                    text={
                        // hasMultiSignWallet
                        "Register people"
                        // : "Create Multisig"
                    }
                    nextButtonCallback={increaseStep}
                    // isDisabled={name === "" || deploying || loading}
                />
            </div>
        </div>
    )
}

export default GnosisSuccess

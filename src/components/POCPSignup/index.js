import React, { useState } from "react"
import "./styles.scss"
import texStyles from "../../commonStyles/textType/styles.module.css"
import { processDaoToPOCP } from "../../utils/POCPutils"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import Lottie from "react-lottie"
import confetti from ".././../assets/lottie/confett-lottie.json"
import { setPocpAction } from "../../store/actions/toast-action"
import { ethers } from "ethers"
import { web3 } from "../../constant/web3"

const POCPSignup = () => {
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const pocpInfo = useSelector((x) => x.dao.pocp_register)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const registerCallback = async (events) => {
        console.log("heree", events)
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
        navigate("/dashboard")
    }
    const registerErrorCallback = () => setLoading(false)
    const signupForPocp = async () => {
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

            {renderBanner()}
        </div>
    )
}

export default POCPSignup

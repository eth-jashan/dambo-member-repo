import React, { useState } from "react"
import "./styles.scss"
import texStyles from "../../commonStyles/textType/styles.module.css"
import { processDaoToPOCP } from "../../utils/POCPutils"
import { useSelector } from "react-redux"
import { message } from "antd"
import { useNavigate } from "react-router"
import Lottie from "react-lottie"
import confetti from ".././../assets/lottie/confett-lottie.json"

const POCPSignup = () => {
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const pocpInfo = useSelector((x) => x.dao.pocp_register)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const onSuccess = () => {
        console.log("fired on success !")
        navigate("/dashboard")
    }

    const signupForPocp = async () => {
        setLoading(true)
        await processDaoToPOCP(
            pocpInfo.name,
            pocpInfo.owner,
            address,
            pocpInfo.dao_uuid,
            jwt,
            onSuccess
        )
        // console.log("register function", res)
        // if (res) {
        //     setLoading(false)
        //     console.log("successfull")
        //     message.success("Registered To Pocp Successfully")
        //     navigate("/dashboard")
        // } else if (!res && res !== undefined) {
        //     setLoading(false)
        //     navigate("/dashboard")
        // }
    }
    const defaultOptions = {
        loop: true,
        autoplay: true,
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

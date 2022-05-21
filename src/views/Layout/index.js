import React from "react"
import styles from "./style.module.css"
import BackSvg from "../../assets/Icons/backSvg.svg"
import OnboardingHeader from "../../components/OnboardingHeader"
import Lottie from "react-lottie"
import background from "../../assets/lottie/onboarding_background.json"

export default function Layout({
    children,
    decreaseStep,
    currentStep,
    contributorWallet,
    signer,
    deploying,
    steps,
}) {
    const checkRoute = () => {
        if (currentStep > 1 && currentStep <= steps.length - 1) {
            return true
        }
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: background,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    return (
        <div className={styles.layout}>
            <Lottie
                options={defaultOptions}
                style={{ position: "absolute", height: "70vh", bottom: 0 }}
                className={styles.layoutImage}
                isClickToPauseDisabled={true}
            />
            <div className={styles.content}>
                <OnboardingHeader
                    contributorWallet={contributorWallet}
                    signer={signer}
                />
                {!contributorWallet && (
                    <div className={styles.modal}>
                        {!contributorWallet && checkRoute() && !deploying ? (
                            <img
                                className={styles.backImg}
                                onClick={decreaseStep}
                                src={BackSvg}
                                alt="back"
                            />
                        ) : (
                            <div className={styles.backImg} />
                        )}
                        {children}
                    </div>
                )}
                {contributorWallet && children}
            </div>
        </div>
    )
}

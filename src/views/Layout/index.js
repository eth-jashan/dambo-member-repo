import React, { useState } from "react"
import styles from "./style.module.css"
import OnboardingHeader from "../../components/OnboardingHeader"
import Lottie from "react-lottie"
import background from "../../assets/lottie/onboarding_background.json"
import ProfileModal from "../../components/Modal/ProfileModal"

export default function Layout({ children, contributorWallet, signer }) {
    const [walletCenter, setWalletCenterModal] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: background,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    return (
        <>
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
                        onWalletCenterOpen={(x) => setWalletCenterModal(x)}
                        walletCenter={walletCenter}
                    />
                    {walletCenter && (
                        <div className={styles.walletModal}>
                            <ProfileModal
                                onActionComplete={() =>
                                    setWalletCenterModal(false)
                                }
                                isOnboard={true}
                            />
                        </div>
                    )}

                    {!contributorWallet && (
                        <div className={styles.modal}>{children}</div>
                    )}
                    {contributorWallet && children}
                </div>
            </div>
            <div className={styles.mobileLayout}>
                <OnboardingHeader
                    contributorWallet={contributorWallet}
                    signer={signer}
                    onWalletCenterOpen={(x) => setWalletCenterModal(x)}
                    walletCenter={walletCenter}
                    showWalletPicker={false}
                />
                <div className={styles.mobileContent}>
                    <div className={styles.mobileContentHeading}>
                        You’re early
                    </div>
                    <div>
                        We're yet to support mobile, please try again on
                        desktop.
                    </div>
                </div>
            </div>
        </>
    )
}

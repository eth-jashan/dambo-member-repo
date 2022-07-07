import React from "react"
import NextButton from "../NextButton"
import styles from "./style.module.css"
import { useDispatch, useSelector } from "react-redux"
import { addThreshold } from "../../store/actions/dao-action"
import { assets } from "../../constant/assets"
import textStyles from "../../commonStyles/textType/styles.module.css"
import gnosis_loader from "../../assets/lottie/gnosis_loader.json"
import Lottie from "react-lottie"

export default function ApproveTransaction({
    increaseStep,
    selectedIndex,
    setSelectedIndex,
    hasMultiSignWallet,
    setProvider,
    deploying,
}) {
    const owners = useSelector((x) => x.dao.newSafeSetup.owners)
    const dispatch = useDispatch()
    const onNext = async () => {
        // setProvider()
        dispatch(addThreshold(selectedIndex + 1))
        await increaseStep()
        // if (!hasMultiSignWallet) {

        // }
    }
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: gnosis_loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const GnosisLoader = () => (
        <div className={styles.loaderLayout}>
            <div className={`${textStyles.ub_53} ${styles.textAlign}`}>
                Creating safe
            </div>
            <div className={`${textStyles.ub_53} ${styles.textAlign}`}>
                might take upto a min
            </div>
            <Lottie
                options={defaultOptions}
                // style={{ height: "40%", width: "100%" }}
                className={styles.layoutImage}
            />
        </div>
    )

    return (
        <>
            {deploying ? (
                <GnosisLoader />
            ) : (
                <div className={styles.wrapper}>
                    <div className={styles.heading}>Add vault owners</div>
                    <div
                        className={`${styles.heading} ${styles.greyedHeading}`}
                    >
                        have more than one owner to
                        <br />
                        maximize security
                    </div>
                    <div className={styles.peopleContainer}>
                        {Array(owners.length)
                            .fill()
                            .map((owner, index) => (
                                <div
                                    key={index}
                                    className={`${styles.peopleDiv} ${
                                        index === selectedIndex
                                            ? styles.highlighted
                                            : ""
                                    }`}
                                    onClick={() => setSelectedIndex(index)}
                                >
                                    <div>{index + 1}</div>
                                    <p>{index > 0 ? "People" : "Person"}</p>
                                </div>
                            ))}
                    </div>
                    <div className={styles.bottomBar}>
                        <div className={styles.backDiv}>
                            <img
                                src={assets.icons.backArrowBlack}
                                alt="right"
                                className={styles.backIcon}
                            />
                            <div className={styles.backTitle}>Back</div>
                        </div>
                        <NextButton
                            text="Add DAO details"
                            nextButtonCallback={async () => await onNext()}
                            isDisabled={!(selectedIndex >= 0)}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

import React from "react"
import styles from "./style.module.css"
import { BsArrowRightShort } from "react-icons/bs"
import rightArrow from "../../assets/Icons/right_arrow_white.svg"
import gnosis_loader from "../../assets/lottie/gnosis_loader.json"
import Lottie from "react-lottie"

export default function NextButton({
    increaseStep,
    text,
    isDisabled,
    isContributor,
    loader,
}) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: gnosis_loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    return (
        <div
            style={{ cursor: "pointer" }}
            onClick={!isDisabled ? increaseStep : () => {}}
            className={!isDisabled ? styles.btnCtn : styles.btnCtnGreyed}
        >
            {/* { !loader? */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div className={styles.titleContainer}>
                    <span className={styles.whiteIcon}>
                        {!isContributor ? "Next" : "Open Dashboard"}
                    </span>
                    {!isContributor && (
                        <span className={styles.greyedText}>
                            {" "}
                            &bull; {text}
                        </span>
                    )}
                </div>
                <img src={rightArrow} alt="right" className={styles.icon} />
            </div>
            {/*: <Lottie options={defaultOptions} style={{height:'1rem'}} className={styles.layoutImage}/> */}
            {/* } */}
        </div>
    )
}

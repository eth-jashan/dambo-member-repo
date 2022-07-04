import React from "react"
import styles from "./style.module.css"
import rightArrow from "../../assets/Icons/right_arrow_white.svg"

export default function NextButton({
    text,
    isDisabled,
    isContributor,
    nextButtonCallback,
    isNext,
}) {
    return (
        <div
            style={{ cursor: "pointer" }}
            onClick={!isDisabled ? nextButtonCallback : () => {}}
            className={!isDisabled ? styles.btnCtn : styles.btnCtnGreyed}
        >
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
        </div>
    )
}

import React from "react"
import { useSelector } from "react-redux"
import NextButton from "../NextButton"
import styles from "./style.module.css"

export default function ApproveTransaction({
    increaseStep,
    selectedIndex,
    setSelectedIndex,
}) {
    const owners = useSelector((x) => x.dao.newSafeSetup.owners)
    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>Add vault owners</div>
            <div className={`${styles.heading} ${styles.greyedHeading}`}>
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
                <NextButton
                    text="Add DAO details"
                    increaseStep={increaseStep}
                    isDisabled={!(selectedIndex >= 0)}
                />
            </div>
        </div>
    )
}

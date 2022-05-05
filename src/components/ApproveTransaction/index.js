import React from "react"
import NextButton from "../NextButton"
import styles from "./style.module.css"
import { useDispatch, useSelector } from "react-redux"
import { addThreshold } from "../../store/actions/dao-action"

export default function ApproveTransaction({
    increaseStep,
    selectedIndex,
    setSelectedIndex,
    hasMultiSignWallet,
    setProvider,
}) {
    const owners = useSelector((x) => x.dao.newSafeSetup.owners)
    const dispatch = useDispatch()
    const onNext = () => {
        dispatch(addThreshold(selectedIndex + 1))
        increaseStep()
        if (!hasMultiSignWallet) {
            setProvider()
        }
    }
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
                    nextButtonCallback={onNext}
                    isDisabled={!(selectedIndex >= 0)}
                />
            </div>
        </div>
    )
}

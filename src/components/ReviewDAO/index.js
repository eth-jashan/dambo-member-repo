import React from "react"
import styles from "./style.module.css"
import NextButton from "../NextButton"

export default function ReviewDAO({ increaseStep, owners, selectedIndex }) {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.heading}>Double check to see if</h1>
            <h1 className={styles.heading}>things are how they</h1>
            <h1 className={styles.heading}>should be</h1>
            <div className={styles.reviewDetails}>
                <h3>Ownership</h3>
                {owners.map((owner) => (
                    <div className={styles.ownerRow} key={owner.id}>
                        <div>{owner.name}</div>
                        <div>{owner.address}</div>
                    </div>
                ))}
                <div className={styles.editOwnerShip}>
                    Edit Ownership details
                </div>
                <div className={styles.permissionDetails}>
                    {selectedIndex + 1} Account permission required to approve
                    transactions
                </div>
                <div className={styles.editPermission}>
                    Edit Permission details
                </div>
            </div>
            <div className={styles.bottomBar}>
                <NextButton text="Review" increaseStep={increaseStep} />
            </div>
        </div>
    )
}

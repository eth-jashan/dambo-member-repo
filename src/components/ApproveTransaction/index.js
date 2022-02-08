import React, { useState } from "react";
import NextButton from "../NextButton";
import styles from "./style.module.css";

export default function ApproveTransaction({
  increaseStep,
  numberOfOwners,
  selectedIndex,
  setSelectedIndex,
}) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>
      Add vault owners
      </h1>
      <h1 className={`${styles.heading} ${styles.greyedHeading}`}>
      have more than one owner to maximize security
      </h1>
      <div className={styles.peopleContainer}>
        {Array(numberOfOwners)
          .fill()
          .map((owner, index) => (
            <div
              key={index}
              className={`${styles.peopleDiv} ${
                index === selectedIndex ? styles.highlighted : ""
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
          text="Review"
          increaseStep={increaseStep}
          isDisabled={selectedIndex >= 0 ? false : true}
        />
      </div>
    </div>
  );
}

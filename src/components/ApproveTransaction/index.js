import React from "react";
import styles from "./style.module.css";

export default function ApproveTransaction() {
  return (
    <div>
      <h1 className={styles.heading}>
        How many people should approve a transaction?
      </h1>
      <h1 className={`${styles.heading} ${styles.greyedHeading}`}>
        having multiple is safer
      </h1>
    </div>
  );
}

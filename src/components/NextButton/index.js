import React from "react";
import styles from "./style.module.css";

export default function NextButton({ increaseStep, text, isDisabled }) {
  return (
    <button
      onClick={!isDisabled ? increaseStep : () => {}}
      className={isDisabled ? styles.disabled : ""}
    >
      <span>
        <span className={styles.whiteIcon}>Next</span> <span className={isDisabled?styles.greyedText:styles.whiteText}>&bull;{text}</span>
      </span>
      <span className={styles.whiteIcon} >&#8594;</span>
    </button>
  );
}

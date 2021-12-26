import React from "react";
import styles from "./style.module.css";

export default function NextButton({ increaseStep, text, isDisabled }) {
  return (
    <button
      onClick={!isDisabled ? increaseStep : () => {}}
      className={isDisabled ? styles.disabled : ""}
    >
      <span>
        Next &bull; <span className={styles.greyedText}>{text}</span>
      </span>
      <span>&#8594;</span>
    </button>
  );
}

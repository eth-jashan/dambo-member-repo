import React from "react";
import styles from "./style.module.css";
import Bg from "../../assets/bg.png";

export default function Layout({ children, decreaseStep }) {
  return (
    <div className={styles.layout}>
      <img src={Bg} alt="bg" className={styles.layoutImage} />
      <div className={styles.content}>
        <div className={styles.nav}>
          &#128526; <span>The Breakroom</span>
        </div>
        <div className={styles.modal}>
          <div className={styles.backArrow} onClick={decreaseStep}>
            &#8592;
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

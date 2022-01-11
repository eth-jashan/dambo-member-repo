import React from "react";
import styles from "./style.module.css";
import Bg from "../../assets/bg.png";
import BackSvg from "../../assets/Icons/back.svg";
import OnboardingHeader from "../../components/OnboardingHeader";

export default function Layout({ children, decreaseStep, currentStep }) {
  if (currentStep === 0) {
    return (
      <div className={styles.layout}>
        <img src={Bg} alt="bg" className={styles.layoutImage} />
        <div className={styles.content}>
          <OnboardingHeader />
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.layout}>
      <img src={Bg} alt="bg" className={styles.layoutImage} />
      <div className={styles.content}>
        <OnboardingHeader />
        <div className={styles.modal}>
          <div className={styles.backArrow} onClick={decreaseStep}>
            <img src={BackSvg} alt="back" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

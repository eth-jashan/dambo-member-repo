import React from "react";
import styles from "./style.module.css";
import Bg from "../../assets/bg.png";
import BackSvg from "../../assets/Icons/back.svg";
import OnboardingHeader from "../../components/OnboardingHeader";

export default function Layout({ children, decreaseStep, currentStep, contributorWallet}) {
  return (
    <div className={styles.layout}>
      <img src={Bg} alt="bg" className={styles.layoutImage} />
      <div className={styles.content}>
        <OnboardingHeader />
        {!contributorWallet&&<div className={styles.modal}>
          {children}
        </div>}
        {contributorWallet && children}
      </div>
    </div>
  );
}

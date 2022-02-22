import React from "react";
import styles from "./style.module.css";
import Bg from "../../assets/bg.png";
import BackSvg from "../../assets/Icons/backSvg.svg";
import OnboardingHeader from "../../components/OnboardingHeader";
import Lottie from 'react-lottie';
import {IoArrowBackOutline} from 'react-icons/io'
import background from '../../assets/lottie/onboarding_background.json'

export default function Layout({ children, decreaseStep, currentStep, contributorWallet}) {
  const checkRoute = () => {
    if(currentStep >1 && currentStep <= 4){
      console.log('current route....', currentStep)
      return true
    }
  }

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: background,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className={styles.layout}>
      <Lottie options={defaultOptions} style={{position:'absolute', top:0, bottom:0}} className={styles.layoutImage}/>
      {/* <img src={Bg} alt="bg" className={styles.layoutImage} /> */}
      {/* <IoArrowBackOutline /> */}
      <div className={styles.content}>
        <OnboardingHeader />
        {!contributorWallet&&<div className={styles.modal}>
        {/* <div> */}
          {(!contributorWallet && checkRoute())? <img className={styles.backImg} onClick={decreaseStep} src={BackSvg} alt="back" />:<div className={styles.backImg}/>}
          {children}
        </div>}
        {contributorWallet && children}
      </div>
    </div>
  );
}

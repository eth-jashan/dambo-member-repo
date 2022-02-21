import React from "react";
import styles from "./style.module.css";
import { BsArrowRightShort } from 'react-icons/bs';
import rightArrow from "../../assets/Icons/right_arrow_white.svg";

export default function NextButton({ increaseStep, text, isDisabled, isContributor, width }) {
  
  return (
    <div onClick={!isDisabled ? increaseStep : () => {}} className={!isDisabled ? styles.btnCtn : styles.btnCtnGreyed}> 
      <div className={styles.titleContainer}>
        <span className={styles.whiteIcon}>{!isContributor?'Next':'Open Dashboard'}</span> 
        {!isContributor&&<span className={styles.greyedText}> &bull; {text}</span>}
      </div>
      <img src={rightArrow} alt='right' className={styles.icon} />
    </div>
  );
}

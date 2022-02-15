import React from "react";
import styles from "./style.module.css";
import { BsArrowRightShort } from 'react-icons/bs';

export default function NextButton({ increaseStep, text, isDisabled, isContributor }) {
  console.log('DISABLEDDDD', isDisabled)
  return (
    <div   onClick={!isDisabled ? increaseStep : () => {}} className={!isDisabled ? styles.btnCtn : styles.btnCtnGreyed}> 
      <div>
        <span className={styles.whiteIcon}>{!isContributor?'Next':'Open Dashboard'}</span> 
        {!isContributor&&<span className={styles.greyedText}>&bull; {text}</span>}
      </div>
      <BsArrowRightShort style={{alignSelf:'center', marginTop:'8px'}} size={24} color={'white'} />
    </div>
  );
}

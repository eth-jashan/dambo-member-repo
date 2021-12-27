import React, { useRef, useEffect } from "react";
import styles from "./style.module.css";
import NextButton from "../NextButton";

export default function NamingDAO({
  setHasMultiSignWallet,
  increaseStep,
  DAOName,
  setDAOName,
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <div className={styles.wrapper}>
      <h1>Welcome to breakroom,</h1>
      <h1>what should we call your DAO</h1>
      <input
        type="text"
        className={styles.DAONameInput}
        placeholder="ipsum lorem"
        value={DAOName}
        onChange={(e) => setDAOName(e.target.value)}
        ref={inputRef}
      />
      <div className={styles.bottomBar}>
        <NextButton
          text="Add Owners"
          increaseStep={increaseStep}
          isDisabled={false}
        />
        <div onClick={() => setHasMultiSignWallet(true)}>
          Already Have a MultiSig Safe
        </div>
      </div>
    </div>
  );
}

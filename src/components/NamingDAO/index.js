import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

export default function NamingDAO() {
  const [DAOName, setDAOName] = useState("");
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
        <button>
          <span>
            Next &bull; <span className={styles.greyedText}>Add Owners</span>
          </span>
          <span>&#8594;</span>
        </button>
        <div>Already Have a MultiSig Safe</div>
      </div>
    </div>
  );
}

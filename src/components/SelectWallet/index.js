import React from "react";
import styles from "./style.module.css";
import forwardSvg from "../../assets/forward.svg";
import plusSvg from "../../assets/plus.svg";

export default function SelectWallet({ setHasMultiSignWallet }) {
  const wallets = [
    "Multisign wallet One",
    "Multisign wallet Two",
    "Multisign wallet Three",
  ];
  return (
    <div className={styles.wrapper}>
      <div>
        <h1>Select multisig wallet you</h1>
        <h1>want to continue with</h1>
      </div>
      <div>
        {wallets.map((wallet) => (
          <div className={styles.walletRow}>
            <p>{wallet}</p>
            <div>
              <img src={forwardSvg} alt="forward arrow" />
            </div>
          </div>
        ))}
        <div
          className={`${styles.walletRow} ${styles.createWalletRow}`}
          onClick={() => setHasMultiSignWallet(false)}
        >
          <p>Create New Wallet</p>
          <div>
            <img src={plusSvg} alt="plus sign" />
          </div>
        </div>
      </div>
    </div>
  );
}

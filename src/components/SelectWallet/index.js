import React from "react"
import styles from "./style.module.css"
import forwardSvg from "../../assets/Icons/forward.svg"
import plusSvg from "../../assets/Icons/plus.svg"

export default function SelectWallet({
    setHasMultiSignWallet,
    wallets,
    setWallets,
}) {
    return (
        <div className={styles.wrapper}>
            <div>
                <h1>Select multisig wallet you</h1>
                <h1>want to continue with</h1>
            </div>
            <div className={styles.wallets}>
                {wallets.map((wallet) => (
                    <div className={styles.walletRow} key={wallet}>
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
    )
}

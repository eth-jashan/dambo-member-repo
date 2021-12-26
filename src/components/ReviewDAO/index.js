import React from "react";
import styles from "./style.module.css";
import { v4 as uuidv4 } from "uuid";
import NextButton from "../NextButton";

export default function ReviewDAO({ increaseStep }) {
  const owners = [
    {
      id: uuidv4(),
      name: "Aviral Bohra",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
    {
      id: uuidv4(),
      name: "Aviral Bohra1",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
    {
      id: uuidv4(),
      name: "Aviral Bohra2",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
    {
      id: uuidv4(),
      name: "Aviral Bohra",
      address: "0x48D2F14fCE53d43FcAB4Ab148d739bbcD4c0fb5B",
    },
  ];
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Double check to see if</h1>
      <h1 className={styles.heading}>things are how they</h1>
      <h1 className={styles.heading}>should be</h1>
      <div className={styles.reviewDetails}>
        <h3>Ownership</h3>
        {owners.map((owner) => (
          <div className={styles.ownerRow} key={owner.id}>
            <div>{owner.name}</div>
            <div>{owner.address}</div>
          </div>
        ))}
        <div className={styles.editOwnerShip}>Edit Ownership details</div>
        <div className={styles.permissionDetails}>
          2 Account permission required to approve transactions
        </div>
        <div className={styles.editPermission}>Edit Permission details</div>
      </div>
      <div className={styles.bottomBar}>
        <NextButton text="Review" increaseStep={increaseStep} />
      </div>
    </div>
  );
}

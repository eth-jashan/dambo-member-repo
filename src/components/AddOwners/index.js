import React from "react";
import styles from "./style.module.css";
import CrossSvg from "../../assets/Icons/cross.svg";
import PlusSvg from "../../assets/Icons/plus.svg";
import { v4 as uuidv4 } from "uuid";
import NextButton from "../NextButton";

export default function AddOwners({ increaseStep, owners, setOwners }) {
  const updateOwner = (e, id, key) => {
    const updatedOwners = owners.map((owner) => {
      if (owner.id === id) {
        const clonedOwner = { ...owner };
        clonedOwner[key] = e.target.value;
        return clonedOwner;
      }
      return owner;
    });
    console.log(e.target.value, updatedOwners);
    setOwners(updatedOwners);
  };

  const deleteOwner = (id) => {
    const ownersAfterDeleting = owners.filter((owner) => owner.id !== id);
    setOwners(ownersAfterDeleting);
  };

  const addOwner = () => {
    const newOwner = {
      id: uuidv4(),
      name: "",
      address: "",
    };
    setOwners([...owners, newOwner]);
  };

  const areValidOwners = () => {
    let isValid = true;
    if (!owners.length) {
      return false;
    }
    owners.forEach((owner) => {
      if (!owner.name) {
        isValid = false;
        return;
      }
      if (!owner.address) {
        isValid = false;
        return;
      }
    });
    return isValid;
  };
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Add vault owners</h1>
      <h1 className={`${styles.heading} ${styles.greyedHeading}`}>
        have more than one owner to maximize security
      </h1>
      <div className={styles.ownerContainer}>
        {owners.map((owner) => (
          <div className={styles.ownerRow} key={owner.id}>
            <input
              type="text"
              value={owner.name}
              onChange={(e) => updateOwner(e, owner.id, "name")}
              className={styles.nameInput}
            />
            <input
              type="text"
              value={owner.address}
              onChange={(e) => updateOwner(e, owner.id, "address")}
              className={styles.addressInput}
            />
            <div onClick={() => deleteOwner(owner.id)}>
              <img src={CrossSvg} alt="delete" />
            </div>
          </div>
        ))}
        <div className={styles.bottomBar}>
          <NextButton
            text="Add Permissions"
            increaseStep={increaseStep}
            isDisabled={!areValidOwners()}
          />
        </div>
      </div>
      <div onClick={addOwner} className={styles.addOwner}>
        Add Owner <img src={PlusSvg} alt="add" />
      </div>
    </div>
  );
}

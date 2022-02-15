import React, { useCallback, useEffect, useState } from "react";
import styles from "./style.module.css";
import CrossSvg from "../../assets/Icons/cross.svg";
import PlusSvg from "../../assets/Icons/plus.svg";
import { v4 as uuidv4 } from "uuid";
import NextButton from "../NextButton";
// import InputField from "../InputField";
import { useDispatch, useSelector } from "react-redux";
import { addOwners, addThreshold } from "../../store/actions/gnosis-action";
import { useSafeSdk, useUserSigner } from "../../hooks";
import SafeServiceClient from "@gnosis.pm/safe-service-client";

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io/')

export default function AddOwners({ increaseStep, hasMultiSignWallet, setStep }) {
  
  const address = useSelector(x=>x.auth.address)
  const [owners, setOwners] = useState([
    {
      id: uuidv4(),
      name: "",
      address: address,
    }
  ])
  const [threshold, setThreshold] = useState(0)
  const dispatch = useDispatch()
  const provider = useSelector(x=>x.auth.web3Provider);
  const safeAddress = useSelector(x=>x.gnosis.safeAddress)
  const userSigner = useUserSigner(provider, null);
  const [loading, setLoading] = useState(false)
  const { safeSdk, safeFactory } = useSafeSdk(userSigner, safeAddress)
  
  const getSafeOwners = useCallback( async() =>{
    console.log(safeSdk)
    // if(safeSdk){
      // setLoading(true)
      // console.log('loadingggg......')
      let ownerObj = []
      const safeInfo = await serviceClient.getSafeInfo(safeAddress)
      if(safeInfo.owners){
        safeInfo.owners.map((item, index)=>{
        ownerObj.push(
          {
            id: uuidv4(),
            name: "",
            address: item,
          }
        )
      })
      setOwners(ownerObj)
      setThreshold(safeInfo.threshold)
      }
    // }
  },[])

  useEffect(()=>{
    if(hasMultiSignWallet){
      getSafeOwners()
    }
  },[getSafeOwners, hasMultiSignWallet])

  const updateOwner = (e, id, key) => {
    const updatedOwners = owners.map((owner) => {
      if (owner.id === id) {
        const clonedOwner = { ...owner };
        clonedOwner[key] = e.target.value;
        return clonedOwner;
      }
      return owner;
    });
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

  const onNext = () => {
    dispatch(addOwners(owners))
    if(hasMultiSignWallet){
      dispatch(addThreshold(threshold))
      setStep(4)
    }else{
      increaseStep()
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>Add vault owners</div>
      <div className={`${styles.heading} ${styles.greyedHeading}`}>
        have more than one owner to maximize security
      </div>
      <div className={styles.ownerContainer}>
        {!loading && owners.length>0&& owners.map((owner) => (
          <div className={styles.ownerRow} key={owner.id}>
            <input
              type="text"
              placeholder={'Owner Name'}
              style={{background:owner?.name === ''?'white':'#E1DCFF'}}
              value={owner?.name}
              onChange={(e) => updateOwner(e, owner.id, "name")}
              className={styles.nameInput}
            />
            {/* <InputField /> */}
            <input
              disabled={hasMultiSignWallet}
              type="text"
              placeholder={'Owner Address'}
              value={owner?.address}
              style={{background:owner.address === ''?'white':'#E1DCFF'}}
              onChange={(e) => updateOwner(e, owner.id, "address")}
              className={styles.addressInput}
            />
            <div onClick={() => deleteOwner(owner.id)}>
              <img src={CrossSvg} alt="delete" />
            </div>
          </div>
        ))}
        
        <div  className={styles.bottomBar}>
          <NextButton
            text="Add Permissions"
            increaseStep={onNext}
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

import React, { useCallback, useEffect, useState } from "react"
import styles from "./style.module.css"
import CrossSvg from "../../assets/Icons/cross.svg"
import PlusSvg from "../../assets/Icons/plusBlack.svg"
import { v4 as uuidv4 } from "uuid"
import NextButton from "../NextButton"
import { useDispatch, useSelector } from "react-redux"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import InputText from "../Input"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { addOwners, addThreshold } from "../../store/actions/dao-action"
import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"
import { assets } from "../../constant/assets"

export default function AddOwners({
    increaseStep,
    hasMultiSignWallet,
    setStep,
    rep3Setup,
}) {
    const address = useSelector((x) => x.auth.address)
    const [owners, setOwners] = useState([
        {
            id: uuidv4(),
            name: "",
            address,
        },
    ])

    const [threshold, setThreshold] = useState(0)
    const dispatch = useDispatch()
    const safeAddress = useSelector((x) => x.dao.newSafeSetup.safeAddress)
    const [loading, setLoading] = useState(false)
    const [safeSigners, setSafeOwners] = useState([])
    const serviceClient = new SafeServiceClient(getSafeServiceUrl())

    const getSafeOwners = useCallback(async () => {
        const ownerObj = []
        const safeInfo = await serviceClient.getSafeInfo(safeAddress)
        if (safeInfo.owners) {
            safeInfo.owners.forEach((item) => {
                ownerObj.push({
                    id: uuidv4(),
                    name: "",
                    address: item,
                })
            })
            setOwners(ownerObj)
            setSafeOwners(ownerObj)
            setThreshold(safeInfo.threshold)
            // }
        }
    }, [safeAddress])

    const checkSafeOwner = (address) => {
        if (hasMultiSignWallet) {
            safeSigners.forEach((x) => {
                if (x === address) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return false
        }
    }

    useEffect(() => {
        if (hasMultiSignWallet) {
            getSafeOwners()
        }
    }, [getSafeOwners, hasMultiSignWallet])

    const updateOwner = (e, id, key) => {
        const updatedOwners = owners.map((owner) => {
            if (owner.id === id) {
                const clonedOwner = { ...owner }
                clonedOwner[key] = e.target.value
                return clonedOwner
            }
            return owner
        })
        setOwners(updatedOwners)
    }

    const deleteOwner = (id) => {
        const ownersAfterDeleting = owners.filter((owner) => owner.id !== id)
        setOwners(ownersAfterDeleting)
    }

    const addOwner = () => {
        const newOwner = {
            id: uuidv4(),
            name: "",
            address: "",
        }
        setOwners([...owners, newOwner])
    }

    const areValidOwners = () => {
        let isValid = true
        if (!owners.length) {
            return false
        }
        owners.forEach((owner) => {
            if (!owner.name) {
                isValid = false
                return
            }
            if (!owner.address) {
                isValid = false
            }
        })
        return isValid
    }

    const onNext = () => {
        dispatch(addOwners(owners))
        if (hasMultiSignWallet) {
            dispatch(addThreshold(threshold))
            setStep("daoInfo")
        } else {
            increaseStep()
        }
    }

    const renderHeader = () =>
        rep3Setup ? (
            <div>
                <div className={`${styles.heading} ${textStyles.ub_53}`}>
                    Register people
                </div>
                <div className={`${textStyles.m_36} ${styles.helperHeading}`}>
                    need to have some copy to talk about the protocol, bla bla
                    bla bla
                </div>
            </div>
        ) : (
            <>
                {hasMultiSignWallet ? (
                    <div className={`${styles.heading} ${textStyles.ub_53}`}>
                        Review your owners
                    </div>
                ) : (
                    <div className={styles.heading}>Add vault owners</div>
                )}
                {hasMultiSignWallet ? (
                    <div
                        className={`${styles.heading} ${styles.greyedHeading} ${textStyles.ub_53}`}
                    >
                        Tell us what to call your team
                        <br /> members.
                    </div>
                ) : (
                    <div
                        className={`${styles.heading} ${styles.greyedHeading} ${textStyles.ub_53}`}
                    >
                        have more than one owner to <br /> maximize security
                    </div>
                )}
            </>
        )

    console.log(safeSigners)

    return (
        <div className={styles.wrapper}>
            {renderHeader()}

            <div className={styles.ownerContainer}>
                {!loading &&
                    owners.length > 0 &&
                    owners.map((owner, index) => (
                        <div className={styles.ownerRow} key={owner.id}>
                            <div style={{ width: "32%", border: 0 }}>
                                <InputText
                                    type="text"
                                    placeholder={"Username"}
                                    width={"100%"}
                                    value={owner?.name}
                                    onChange={(e) =>
                                        updateOwner(e, owner.id, "name")
                                    }
                                />
                            </div>
                            <div style={{ width: "60%", border: 0 }}>
                                <InputText
                                    width={"100%"}
                                    disabled={hasMultiSignWallet || index === 0}
                                    type="text"
                                    placeholder={"Owner Address"}
                                    value={owner?.address}
                                    style={{
                                        background:
                                            owner.address === ""
                                                ? "white"
                                                : "#E1DCFF",
                                    }}
                                    onChange={(e) =>
                                        updateOwner(e, owner.id, "address")
                                    }
                                    className={styles.addressInput}
                                />
                            </div>
                            <div
                                onClick={() =>
                                    !checkSafeOwner(owner.address) ||
                                    (index !== 0 && deleteOwner(owner.id))
                                }
                            >
                                {!checkSafeOwner(owner.address) ? (
                                    <img src={CrossSvg} alt="delete" />
                                ) : (
                                    <img
                                        src={assets.icons.infoIcon}
                                        alt="info"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            <div
                onClick={
                    !hasMultiSignWallet || rep3Setup
                        ? () => addOwner()
                        : () => {}
                }
                className={styles.addOwner}
            >
                Add Owner <img src={PlusSvg} alt="add" />
            </div>

            <div className={styles.bottomBarAbsolute}>
                <div className={styles.backDiv}>
                    <img
                        src={assets.icons.backArrowBlack}
                        alt="right"
                        className={styles.backIcon}
                    />
                    <div className={styles.backTitle}>Back</div>
                </div>
                <NextButton
                    text={rep3Setup ? "Sign Transaction" : "Add Permissions"}
                    nextButtonCallback={onNext}
                    isDisabled={!areValidOwners()}
                />
            </div>
        </div>
    )
}

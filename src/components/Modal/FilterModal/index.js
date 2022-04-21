import React, { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { filterRequests } from "../../../store/actions/dao-action"
import styles from "./styles.module.css"

const FilterModal = ({ show, onClose, isContribution }) => {
    const CloseRef = useRef()

    const [checkedVerticles, setCheckedVerticles] = useState([])
    const dispatch = useDispatch()

    const checkList = ["Development", "Design", "Writing", "Marketing"]
    const radioList = [
        { key: "1hr", value: "< 1 hr" },
        { key: "1hr4", value: "1 hr - 4 hr" },
        { key: "4hr12", value: "4 hr - 12 hr" },
        { key: "12hr30", value: "12 hr - 30hr" },
        { key: "30hr", value: "> 30 hr" },
    ]
    const [time, setTime] = useState("")

    const handleCheckVerticles = (event) => {
        var updatedList = [...checkedVerticles]
        if (event.target.checked) {
            updatedList = [...checkedVerticles, event.target.value]
        } else {
            updatedList.splice(checkedVerticles.indexOf(event.target.value), 1)
        }
        setCheckedVerticles(updatedList)
    }

    const onChangeRadio = (event) => {
        setTime(event.target.value)
    }

    useEffect(() => {
        const checkIfClickOutside = (e) => {
            if (
                show &&
                CloseRef.current &&
                !CloseRef.current.contains(e.target)
            ) {
                onClose()
                setTime("")
                setCheckedVerticles([])
            }
        }
        document.addEventListener("click", checkIfClickOutside)
        return () => {
            document.removeEventListener("click", checkIfClickOutside)
        }
    }, [show])
    if (!show) {
        return null
    }
    const onApprove = () => {
        dispatch(filterRequests(time, checkedVerticles, isContribution))
        onClose()
    }
    return (
        <div className={styles.filterContainer} ref={CloseRef}>
            <div
                className={styles.filterContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.listContainer}>
                    <div
                        style={{
                            width: "47%",
                            padding: "1rem",
                            borderRight: "1px solid rgba(255,255,255, 0.12)",
                        }}
                    >
                        <div className={styles.filterHeading}>Verticals</div>
                        <div className={styles.checkListContainer}>
                            {checkList.map((item, index) => (
                                <label class={styles.oneCheckcontainer}>
                                    {item}
                                    <input
                                        type="checkbox"
                                        value={item}
                                        onChange={handleCheckVerticles}
                                    />
                                    <span class={styles.checkmark}></span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div
                        style={{
                            width: "53%",
                            padding: "1rem 1rem 0rem 1rem ",
                        }}
                    >
                        <div className={styles.filterHeading}>Time</div>
                        <div
                            className={styles.checkListContainer}
                            onChange={onChangeRadio}
                        >
                            {radioList.map((item, index) => (
                                <label
                                    class={styles.oneRadioContainer}
                                    key={item.key}
                                >
                                    {item.value}
                                    <input
                                        type="radio"
                                        value={item.key}
                                        checked={time === item.key}
                                        name="time"
                                    />
                                    <span class={styles.radiomark}></span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div style={{ display: "flex" }}>
                        {checkedVerticles.length === 0 ? null : (
                            <div>{checkedVerticles.length} . &nbsp; </div>
                        )}
                        <span className={styles.clearbutton}> Clear</span>
                    </div>
                    <div
                        onClick={() => onApprove()}
                        className={styles.approveButton}
                    >
                        Approve Request
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilterModal

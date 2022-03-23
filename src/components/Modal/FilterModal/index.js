import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

const FilterModal = ({ show, onClose }) => {
  const CloseRef = useRef();

  const [checkedVerticles, setCheckedVerticles] = useState([]);

  const checkList = ["Development", "Design", "Writing", "Marketing"];
  const radioList = [
    { key: "1hr", value: "< 1 hr" },
    { key: "1hr4", value: "1 hr - 4 hr" },
    { key: "4hr12", value: "4 hr - 12 hr" },
    { key: "12hr30", value: "12 hr - 30hr" },
    { key: "30hr", value: "> 30 hr" },
  ];
  const [time, setTime] = useState("");

  const handleCheckVerticles = (event) => {
    var updatedList = [...checkedVerticles];
    if (event.target.checked) {
      updatedList = [...checkedVerticles, event.target.value];
    } else {
      updatedList.splice(checkedVerticles.indexOf(event.target.value), 1);
    }
    setCheckedVerticles(updatedList);
  };

  const onChangeRadio = (event) => {
    setTime(event.target.value);
  }

  useEffect(() => {
    const checkIfClickOutside = (e) => {
      if (show && CloseRef.current && !CloseRef.current.contains(e.target)) {
        onClose();
        setTime("")
        setCheckedVerticles([])
      }
    };
    document.addEventListener("click", checkIfClickOutside);
    return () => {
      document.removeEventListener("click", checkIfClickOutside);
    };
  }, [show]);
  if (!show) {
    return null;
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
                // <div key={index}>
                //   <input
                //     value={item}
                //     type="checkbox"
                //     onChange={handleCheckVerticles}
                //   />
                //   <span className={styles.checkmark}>{item}</span>
                // </div>
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
          <div style={{ width: "53%", padding: "1rem 1rem 0rem 1rem " }}>
            <div className={styles.filterHeading}>Time</div>
            <div className={styles.checkListContainer} onChange={onChangeRadio}>
              {/* <div>
                <input
                  type="radio"
                  value="1hr"
                  name="time"
                  checked={time === "1hr"}
                />{" "}
                &lt; 1 hr
              </div>
              <div>
                <input
                  type="radio"
                  value="1hr4"
                  name="time"
                  checked={time === "1hr4"}
                />{" "}
                1 hr - 4 hr
              </div>
              <div>
                <input
                  type="radio"
                  value="4hr12"
                  name="time"
                  checked={time === "4hr12"}
                />{" "}
                4 hr - 12 hr
              </div>
              <div>
                <input
                  type="radio"
                  value="12hr30"
                  name="time"
                  checked={time === "12hr30"}
                />{" "}
                12 hr - 30 hr
              </div>
              <div>
                <input
                  type="radio"
                  value="30hr"
                  name="time"
                  checked={time === "30hr"}
                />{" "}
                &gt; 30 hr
              </div> */}
              {radioList.map((item, index) => (
                  <label class={styles.oneRadioContainer} key={item.key}>{item.value}
                  <input type="radio" value={item.key} checked={time === item.key} name="time" />
                  <span class={styles.radiomark}></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div style={{display:"flex"}}>
            {checkedVerticles.length === 0 ? null : <div>{checkedVerticles.length} . &nbsp; </div> }
            <span className={styles.clearbutton}> Clear</span></div>
          <div className={styles.approveButton}>Approve Request</div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;

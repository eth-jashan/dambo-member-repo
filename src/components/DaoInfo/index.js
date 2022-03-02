import { Typography } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDaoInfo } from "../../store/actions/gnosis-action";
import InputText from "../Input";
import NextButton from "../NextButton";
import styles from "./styles.module.css";
import gnosis_loader from "../../assets/lottie/gnosis_loader.json";
import Lottie from "react-lottie";
import { RiFileUploadLine } from "react-icons/all";

const DaoInfo = ({ increaseStep, decreaseStep, deploying }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const dispatch = useDispatch();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: gnosis_loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const onSubmit = () => {
    dispatch(addDaoInfo(name, email, discord));
    increaseStep();
  };

  return (
    <div className={styles.layout}>
      {deploying ? (
        <Lottie
          options={defaultOptions}
          style={{ height: "100%", width: "100%" }}
          className={styles.layoutImage}
        />
      ) : (
        <>
          <div>
            <div className={styles.heading}>
              Tell us a lil about
              <br />
              your DAO
            </div>

            <div className={styles.form}>
              <div style={{ display: "flex" }}>
                <div style={{ width: "60%" }}>
                  <div>
                    <Typography.Text className={styles.helperText}>
                      What should we call your DAO
                    </Typography.Text>
                    <div>
                      <InputText
                        width={"90%"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="DAO Name"
                      />
                    </div>
                  </div>
                  <div>
                    <Typography.Text className={styles.helperTextSec}>
                      How we can reach you
                    </Typography.Text>
                    <div>
                      <InputText
                        width={"90%"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address (optional)"
                        className={
                          email === "" ? styles.input : styles.inputText
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Typography.Text className={styles.helperTextSec}>
                      Can you link your discord
                    </Typography.Text>
                    <div>
                      <InputText
                        width={"90%"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address (optional)"
                        className={
                          email === "" ? styles.input : styles.inputText
                        }
                      />
                    </div>
                  </div>
                </div>
                <div style={{ flexGrow: 100 }}>
                  <Typography.Text className={styles.helperTextSec}>
                    Upload Logo
                  </Typography.Text>
                  <div className={styles.photoContainer}>
                    <div className={styles.uploadIconCont}>
                      <div className={styles.uploadIcon}>
                        <RiFileUploadLine />
                      </div>
                    </div>
                    <div>
                      <Typography.Text className={styles.helperText}>
                        Click here to upload a file
                      </Typography.Text>
                      <div className={styles.divTextUpload}>
                        <Typography.Text className={styles.uploadText}>
                          PNG,JPG,GIF up to 10MB (recommended size 400px x
                          400px)
                        </Typography.Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.nextBtn}>
            <NextButton
              text="Add Owners"
              increaseStep={onSubmit}
              isDisabled={name === "" || deploying}
              // loader={deploying}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DaoInfo;

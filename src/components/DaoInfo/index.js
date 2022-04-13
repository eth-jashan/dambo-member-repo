import { Typography } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDaoInfo } from "../../store/actions/gnosis-action";
import InputText from "../InputComponent/Input";
import NextButton from "../NextButton";
import styles from "./styles.module.css";
import gnosis_loader from "../../assets/lottie/gnosis_loader.json";
import retry from "../../assets/Icons/retry.svg";
import upload from "../../assets/Icons/upload.svg";
import Lottie from "react-lottie";
import { RiFileUploadLine } from "react-icons/all";
import api from "../../constant/api";
import axios from "axios";

import textStyles from '../../commonStyles/textType/styles.module.css'
import { ethers } from "ethers";
import { registerDaoToPocp } from "../../utils/POCPutils";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { INFURA_ID } from "../../constants";

const DaoInfo = ({ increaseStep, decreaseStep, deploying, hasMultiSignWallet }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [image, setImage] = useState()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: gnosis_loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  
  const onSubmit = async() => {
    dispatch(addDaoInfo(name, email, discord, image?.url));
    increaseStep();
  }
  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      // if (e.target.result.length > MAX_IMAGE_SIZE) {
      //   return alert("Image is loo large.");
      // }
      const imageObj = {
        url: false,
        image: e.target.result,
        preview:URL.createObjectURL(file),
      };
      setImage(imageObj)
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = async(e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createImage(files[0]);
  };


  const uploadImage = async () => {
    setLoading(true)
    const response = await axios({
      method: "GET",
      url: api.s3Uplaod.url,
    });
    let binary;
    binary = atob(image.image.split(",")[1]);
    let array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    let blobData = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
    const result = await fetch(response.data.uploadURL, {
      method: "PUT",
      body: blobData,
    });
    console.log(result, response.data.uploadURL.split("?")[0])
    // Final URL for the user doesn't need the query string params
      setImage((x) => ({ ...x, url: response.data.uploadURL.split("?")[0] }));
      setLoading(false)
  };

  const renderUploadOption = () => (
    <div className={styles.uploadContainer}>
      <div onClick={()=>setImage()} className={styles.retry}>
        <img src={retry} alt='retry'/>
      </div>
      <div onClick={()=>uploadImage()} className={styles.upload}>
        <img src={upload} alt='upload'/>
        <div style={{color:'white'}} className={textStyles.m_16}>upload</div>
      </div>
    </div>
  )

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
            <div className={`${styles.heading} ${textStyles.ub_53}`}>
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
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                        placeholder="Your discord link (optional)"
                        className={
                          email === "" ? styles.input : styles.inputText
                        }
                      />
                    </div>
                  </div>
                </div>
                  <div style={{ flexGrow: 100, display:'flex', alignItems:'center', flexDirection:'column' }}>
                
                    <Typography.Text className={styles.helperTextSec}>
                      Upload Logo
                    </Typography.Text>
                    <div className={styles.photoContainer}>
                       {image?<img alt='logo' src={image?.preview} style={{width:'100%', height:'100%'}} />:
                        <div>
                        <label htmlFor="upload-button">
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
                        </label>
                        <input accept='image/png, image/gif, image/jpeg' type="file" id="upload-button" style={{ display: 'none' }} onChange={onFileChange} />
                        <br />
                      </div>}
                      </div>
                      {image&&renderUploadOption()}
                  </div>
              </div>
            </div>
          </div>
          <div className={styles.nextBtn}>
            <NextButton
              text={hasMultiSignWallet?"Register Dao":"Add Owners"}
              increaseStep={onSubmit}
              isDisabled={name === "" || deploying||loading}
              // loader={deploying}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DaoInfo;

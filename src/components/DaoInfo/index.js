import { Typography } from "antd"
import React, { useState } from "react"
import InputText from "../InputComponent/Input"
import NextButton from "../NextButton"
import styles from "./styles.module.css"
import gnosis_loader from "../../assets/lottie/gnosis_loader.json"
import upload_pic from "../../assets/lottie/upload_pic.json"
import retry from "../../assets/Icons/retry.svg"
import upload_file from "../../assets/Icons/upload_file.svg"
import Lottie from "react-lottie"
import axios from "axios"

import textStyles from "../../commonStyles/textType/styles.module.css"
import { assets } from "../../constant/assets"

const DaoInfo = ({ deploying, increaseStep, onBack }) => {
    const [name, setName] = useState("")
    // const [email, setEmail] = useState("")
    // const [discord, setDiscord] = useState("")
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    // const dispatch = useDispatch()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: gnosis_loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const defaultOptions_upload = {
        loop: true,
        autoplay: true,
        animationData: upload_pic,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const createImage = (file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const imageObj = {
                url: false,
                image: e.target.result,
                preview: URL.createObjectURL(file),
            }
            setImage(imageObj)
            uploadImage(imageObj)
        }
        reader.readAsDataURL(file)
    }

    const onFileChange = async (e) => {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        createImage(files[0])
    }

    const uploadImage = async (imageObj) => {
        setLoading(true)
        const response = await axios({
            method: "GET",
            url: process.env.REACT_APP_S3_UPLOAD,
        })
        const binary = atob(imageObj.image.split(",")[1])
        const array = []
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i))
        }
        const blobData = new Blob([new Uint8Array(array)], {
            type: "image/jpeg",
        })
        await fetch(response.data.uploadURL, {
            method: "PUT",
            body: blobData,
        })
        // Final URL for the user doesn't need the query string params
        setImage((x) => ({ ...x, url: response.data.uploadURL.split("?")[0] }))
        setLoading(false)
    }

    const renderUploadOption = () => (
        <div className={styles.uploadContainer}>
            <div onClick={() => setImage()} className={styles.retry}>
                <img src={retry} alt="retry" />
            </div>
        </div>
    )

    const GnosisLoader = () => (
        <div className={styles.loaderLayout}>
            <div className={`${textStyles.ub_53} ${styles.textAlign}`}>
                Creating safe
            </div>
            <div className={`${textStyles.ub_53} ${styles.textAlign}`}>
                might take upto a min
            </div>
            <Lottie
                options={defaultOptions}
                style={{ height: "40%", width: "100%" }}
                className={styles.layoutImage}
            />
        </div>
    )

    return (
        <div className={styles.layout}>
            {deploying ? (
                <GnosisLoader />
            ) : (
                <>
                    <div>
                        <div
                            className={`${styles.heading} ${textStyles.ub_53}`}
                        >
                            Tell us a lil about
                            <br />
                            your DAO
                        </div>

                        <div className={styles.form}>
                            <div style={{ display: "flex" }}>
                                <div style={{ width: "60%" }}>
                                    <div>
                                        <Typography.Text
                                            className={styles.helperText}
                                        >
                                            What is your Community called?
                                        </Typography.Text>
                                        <div>
                                            <InputText
                                                width={"90%"}
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="Community Name"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        flexGrow: 100,
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        position: "relative",
                                    }}
                                >
                                    {image ? (
                                        <div>
                                            <div className={styles.uploadDiv}>
                                                <div
                                                    className={`${textStyles.m_16} ${styles.uploadTitle}`}
                                                >
                                                    Upload Logo
                                                </div>
                                                {loading && (
                                                    <div
                                                        className={`${textStyles.m_16} ${styles.loadingText}`}
                                                    >
                                                        uploading
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={styles.picContainer}
                                            >
                                                <img
                                                    alt="logo"
                                                    src={image?.preview}
                                                    style={{
                                                        width: "15rem",
                                                        height: "15rem",
                                                        border: "1px solid #eeeef0",
                                                        borderRadius: "0.75rem",
                                                        position: "absolute",
                                                    }}
                                                />
                                                {loading && (
                                                    <Lottie
                                                        options={
                                                            defaultOptions_upload
                                                        }
                                                        className={
                                                            styles.uploadLottie
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div
                                                className={`${textStyles.m_16} ${styles.uploadTitle}`}
                                            >
                                                Upload Logo
                                            </div>
                                            <div
                                                className={styles.picContainer}
                                            >
                                                <label
                                                    className={styles.label}
                                                    htmlFor="upload-button"
                                                >
                                                    <div
                                                        className={
                                                            styles.icon_uplaod
                                                        }
                                                    >
                                                        <img
                                                            alt="file"
                                                            src={upload_file}
                                                            className={
                                                                styles.upload_file
                                                            }
                                                        />
                                                    </div>
                                                    <input
                                                        accept="image/png, image/gif, image/jpeg"
                                                        type="file"
                                                        id="upload-button"
                                                        style={{
                                                            display: "none",
                                                        }}
                                                        onChange={onFileChange}
                                                    />
                                                    <div
                                                        style={{
                                                            alignSelf: "center",
                                                        }}
                                                        className={`${textStyles.m_16}`}
                                                    >
                                                        Click here to upload a
                                                        file
                                                    </div>
                                                    <div
                                                        style={{
                                                            alignSelf: "center",
                                                            textAlign: "center",
                                                            marginTop: "0.5rem",
                                                            color: "#00000050",
                                                        }}
                                                        className={`${textStyles.m_14}`}
                                                    >
                                                        PNG, JPG, GIF up to 10MB
                                                        (recommended size: 400px
                                                        x 400px)
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {image && renderUploadOption()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.bottomBar}>
                        <div
                            onClick={() => onBack()}
                            className={styles.backDiv}
                        >
                            <img
                                src={assets.icons.backArrowBlack}
                                alt="right"
                                className={styles.backIcon}
                            />
                            <div className={styles.backTitle}>Back</div>
                        </div>
                        <NextButton
                            text={"Register people"}
                            nextButtonCallback={() =>
                                increaseStep(name, image?.url)
                            }
                            isDisabled={
                                name === "" || deploying || loading || !image
                            }
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default DaoInfo

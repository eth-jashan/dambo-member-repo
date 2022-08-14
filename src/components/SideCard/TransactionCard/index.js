import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography } from "antd"

import cross from "../../../assets/Icons/cross_white.svg"
import deleteIcon from "../../../assets/Icons/delete_icon.svg"
import styles from "./style.module.css"
import "./style.scss"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import {
    approveContriRequest,
    rejectContriRequest,
    setTransaction,
} from "../../../store/actions/transaction-action"

import ApprovalSelectionToggle from "../../ApprovalSelectionToggle"
import { convertTokentoUsd } from "../../../utils/conversion"
import { assets } from "../../../constant/assets"
import { approveBadge, setLoading } from "../../../store/actions/dao-action"
import dayjs from "dayjs"
import { createContributionMetadataUri } from "../../../utils/POCPServiceSdk"
// import { uploadApproveMetaDataUpload } from "../../../utils/relayFunctions"
import AdminPastSideCard from "./AdminPastSideCard"

const TransactionCard = () => {
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const [payToken, setPayToken] = useState(false)
    const [mint, setMint] = useState(false)
    const address = currentTransaction?.contributor?.public_address
    const dispatch = useDispatch()

    const [feedBackShow, setFeedBackSow] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [loading, setLoading] = useState(false)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const jwt = useSelector((x) => x.auth.jwt)

    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)

    useEffect(() => {
        console.log("transaction changed")
        setFeedBackSow(false)
        setFeedback("")
        setMint(false)
        setPayDetail([
            {
                amount: "",
                token_type: null,
                address: currentTransaction?.requested_by?.public_address,
                usd_amount: ETHprice,
            },
        ])
        setPayToken(false)
    }, [currentTransaction?.id])
    const [payDetail, setPayDetail] = useState([
        {
            amount: "",
            token_type: null,
            address: currentTransaction?.requested_by?.public_address,
            usd_amount: ETHprice,
        },
    ])

    const addToken = async () => {
        const usdConversion = await convertTokentoUsd("ETH")
        if (usdConversion) {
            const newDetail = {
                amount: "",
                token_type: null,
                usd_amount: usdConversion,
                address: currentTransaction?.requested_by?.public_address,
            }
            setPayDetail([...payDetail, newDetail])
        }
    }

    const updatedPayDetail = (e, index) => {
        payDetail[index].amount = e.target.value

        setPayDetail(payDetail)
    }

    const updateTokenType = async (value, index) => {
        const usdConversion = await convertTokentoUsd(value.label)
        if (usdConversion) {
            payDetail[index].token_type = value.value
            payDetail[index].usd_amount = usdConversion
            setPayDetail(payDetail)
        }
    }

    const onContributionPress = () => {
        dispatch(setTransaction(null))
    }

    const onApproveTransaction = async () => {
        setLoading(true)
        if (mint && !payToken) {
            const uploadMetadata = []
            currentTransaction?.details.forEach((x) => {
                if (x.value) {
                    uploadMetadata.push({
                        trait_type: x.fieldName,
                        value: x.value,
                    })
                }
            })
            const res = await createContributionMetadataUri(
                currentDao?.logo_url,
                currentDao?.name,
                currentTransaction?.details.find(
                    (x) => x.fieldName === "Contribution Title"
                )?.value,
                currentTransaction?.details.find(
                    (x) => x.fieldName === "Time Spent in Hours"
                )?.value,
                dayjs().format("D MMM YYYY"),
                currentTransaction?.details.find(
                    (x) => x.fieldName === "Contribution Category"
                )?.value,
                feedback,
                uploadMetadata
            )
            if (res) {
                dispatch(
                    approveBadge(
                        { ...currentTransaction, metadata_hash: res.metadata },
                        feedback
                    )
                )
                await dispatch(
                    approveContriRequest(
                        payToken ? payDetail : [],
                        false,
                        feedback,
                        mint ? 1 : 0,
                        res.metadata
                    )
                )
            }
        } else if (mint && payToken) {
            if (
                payDetail[0]?.amount !== 0 &&
                payDetail[0]?.amount !== "" &&
                payDetail[0]?.amount !== "0"
            ) {
                const newPayout = []
                payDetail.forEach((item) => {
                    if (!item?.token_type) {
                        newPayout.push({
                            amount: item.amount,
                            usd_amount: item?.usd_amount,
                            address:
                                currentTransaction?.contributor?.public_address,
                            details: {
                                name: "Ethereum",
                                symbol: "ETH",
                                decimals: "18",
                                logo_url:
                                    "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png",
                                address: "",
                            },
                        })
                    } else {
                        newPayout.push({
                            amount: item.amount,
                            usd_amount: item?.usd_amount,
                            address:
                                currentTransaction?.contributor?.public_address,
                            details: {
                                name: item?.token_type?.token?.name,
                                symbol: item?.token_type?.token?.symbol,
                                decimals: item?.token_type?.token?.decimals,
                                logo_url: item?.token_type?.token?.logoUri,
                                address: item?.token_type?.tokenAddress,
                            },
                        })
                    }
                })
                const uploadMetadata = []
                currentTransaction?.details.forEach((x) => {
                    if (x.value) {
                        uploadMetadata.push({
                            trait_type: x.fieldName,
                            value: x.value,
                        })
                    }
                })
                const res = await createContributionMetadataUri(
                    currentDao?.logo_url,
                    currentDao?.name,
                    currentTransaction?.details.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value,
                    currentTransaction?.details.find(
                        (x) => x.fieldName === "Time Spent in Hours"
                    )?.value,
                    dayjs().format("D MMM YYYY"),
                    currentTransaction?.details.find(
                        (x) => x.fieldName === "Contribution Category"
                    )?.value,
                    feedback,
                    uploadMetadata
                )
                if (res) {
                    dispatch(
                        approveBadge(currentTransaction, feedback, newPayout)
                    )
                    await dispatch(
                        approveContriRequest(
                            payToken ? newPayout : [],
                            false,
                            feedback,
                            mint ? 1 : 0,
                            false
                        )
                    )
                }
            }
        } else if (payToken && !mint) {
            if (
                payDetail[0]?.amount !== 0 &&
                payDetail[0]?.amount !== "" &&
                payDetail[0]?.amount !== "0"
            ) {
                const newPayout = []
                payDetail.forEach((item) => {
                    if (!item?.token_type) {
                        newPayout.push({
                            amount: item.amount,
                            usd_amount: item?.usd_amount,
                            address:
                                currentTransaction?.contributor?.public_address,
                            details: {
                                name: "Ethereum",
                                symbol: "ETH",
                                decimals: "18",
                                logo_url:
                                    "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png",
                                address: "",
                            },
                        })
                    } else {
                        newPayout.push({
                            amount: item.amount,
                            usd_amount: item?.usd_amount,
                            address:
                                currentTransaction?.contributor?.public_address,
                            details: {
                                name: item?.token_type?.token?.name,
                                symbol: item?.token_type?.token?.symbol,
                                decimals: item?.token_type?.token?.decimals,
                                logo_url: item?.token_type?.token?.logoUri,
                                address: item?.token_type?.tokenAddress,
                            },
                        })
                    }
                })
                await dispatch(
                    approveContriRequest(
                        payToken ? newPayout : [],
                        false,
                        feedback,
                        mint ? 1 : 0,
                        false
                    )
                )
            }
        }
        setLoading(false)
        dispatch(setTransaction(null))
    }

    const getButtonTitle = () => {
        if (mint && payToken) {
            return "Approve Badge and Payment"
        } else if (mint && !payToken) {
            return "Approve Badge"
        } else if (!mint && payToken) {
            return "Approve Payment"
        } else {
            return "Approve Badge"
        }
    }

    return (
        <>
            {currentTransaction?.status === "REQUESTED" ? (
                <div className={styles.container}>
                    <img
                        onClick={() => onContributionPress()}
                        src={cross}
                        alt="cross"
                        className={styles.cross}
                    />

                    <span
                        ellipsis={{ rows: 2 }}
                        className={`${textStyle.ub_23} ${styles.title}`}
                    >
                        {
                            currentTransaction?.details.find(
                                (x) => x.fieldName === "Contribution Title"
                            )?.value
                        }
                        {/* {`${currentTransaction?.title}`} */}
                    </span>

                    <div className={styles.contributorContainer}>
                        <img
                            className={styles.faceIcon}
                            src={assets.icons.faceIcon}
                        />
                        <div
                            className={`${textStyle.m_16} ${styles.ownerInfo}`}
                        >
                            {/* aviral • aviralsb.eth */}
                            {`${
                                currentTransaction?.contributor?.name
                            } . (${address?.slice(0, 5)}...${address?.slice(
                                -3
                            )})`}
                        </div>
                    </div>

                    <div className={styles.timelineContainer}>
                        <img
                            className={styles.faceIcon}
                            src={assets.icons.feedIcon}
                        />
                        <div
                            className={`${textStyle.m_16} ${styles.ownerInfo}`}
                        >
                            {/* {`${currentTransaction?.stream?.toLowerCase()} ${
                    currentTransaction?.time_spent
                } hrs`} */}
                            design •{" "}
                            {
                                currentTransaction?.details.find(
                                    (x) => x.fieldName === "Time Spent in Hours"
                                )?.value
                            }{" "}
                            hrs
                        </div>
                    </div>

                    <Typography.Paragraph
                        className={`${styles.description} ${textStyle.m_16}`}
                        ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: (
                                <Typography.Text
                                    className={`${styles.description} ${textStyle.m_16}`}
                                >
                                    read more
                                </Typography.Text>
                            ),
                        }}
                    >
                        {currentTransaction?.description}
                    </Typography.Paragraph>

                    <ApprovalSelectionToggle
                        feedback={feedback}
                        setFeedback={(e) => setFeedback(e)}
                        toggleTitle="Mint contribution badge"
                        type="mint"
                        feedbackShow={feedBackShow}
                        setFeedBackSow={(x) => setFeedBackSow(x)}
                        active={mint}
                        setActive={() => setMint(!mint)}
                    />

                    {currentDao?.safe_public_address && (
                        <div
                            style={{ marginTop: "1rem", marginBottom: "5rem" }}
                        >
                            <ApprovalSelectionToggle
                                toggleTitle="Pay in tokens"
                                type="token"
                                feedbackShow={feedBackShow}
                                setFeedBackSow={(x) => setFeedBackSow(x)}
                                payDetail={payDetail}
                                addToken={() => addToken()}
                                updatedPayDetail={(e, index) =>
                                    updatedPayDetail(e, index)
                                }
                                updateTokenType={(value, index) =>
                                    updateTokenType(value, index)
                                }
                                active={payToken}
                                setActive={() => setPayToken(!payToken)}
                            />
                        </div>
                    )}
                    <div className={styles.buttonContainer}>
                        <div
                            onClick={async () => {
                                await dispatch(
                                    rejectContriRequest(currentTransaction?.id)
                                )
                                onContributionPress()
                            }}
                            className={styles.deleteContainer}
                        >
                            <img
                                src={deleteIcon}
                                alt="cross"
                                className={styles.delete}
                            />
                        </div>

                        <div
                            onClick={async () =>
                                !loading && (await onApproveTransaction())
                            }
                            className={styles.payNow}
                        >
                            <div className={`${textStyle.ub_16}`}>
                                {loading ? "Approving...." : getButtonTitle()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <AdminPastSideCard onCrossPress={onContributionPress} />
            )}
        </>
    )
}

export default TransactionCard

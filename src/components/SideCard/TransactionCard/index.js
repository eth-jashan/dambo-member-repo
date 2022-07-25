import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography } from "antd"

import cross from "../../../assets/Icons/cross_white.svg"
import deleteIcon from "../../../assets/Icons/delete_icon.svg"
import styles from "./style.module.css"
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
import { uploadApproveMetaDataUpload } from "../../../utils/relayFunctions"
import { createContributionMetadataUri } from "../../../utils/POCPServiceSdk"

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
            //
            const res = await createContributionMetadataUri(
                currentTransaction?.details.find(
                    (x) => x.fieldName === "Contribution Title"
                )?.value,
                currentDao?.name,
                `25 July'22`,
                currentDao?.logo_url
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
                const res = await createContributionMetadataUri(
                    currentTransaction?.details.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value,
                    currentDao?.name,
                    `25 July'22`,
                    currentDao?.logo_url
                )
                if (res) {
                    console.log(res.metadata)
                    dispatch(
                        approveBadge(currentTransaction, feedback, payDetail)
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
            }
        } else if (payToken && !mint) {
            if (
                payDetail[0]?.amount !== 0 &&
                payDetail[0]?.amount !== "" &&
                payDetail[0]?.amount !== "0"
            ) {
                await dispatch(
                    approveContriRequest(
                        payToken ? payDetail : [],
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
    console.log("cuurent", currentDao)
    return (
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
                <img className={styles.faceIcon} src={assets.icons.faceIcon} />
                <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>
                    {/* aviral • aviralsb.eth */}
                    {`${
                        currentTransaction?.contributor?.name
                    } . (${address?.slice(0, 5)}...${address?.slice(-3)})`}
                </div>
            </div>

            <div className={styles.timelineContainer}>
                <img className={styles.faceIcon} src={assets.icons.feedIcon} />
                <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>
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

            {currentDao && (
                <div style={{ marginTop: "1rem", marginBottom: "5rem" }}>
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
                        loading && (await onApproveTransaction())
                    }
                    className={styles.payNow}
                >
                    <div className={`${textStyle.ub_16}`}>
                        {loading ? "Approving...." : getButtonTitle()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard

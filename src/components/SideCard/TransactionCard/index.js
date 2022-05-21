import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { message, Typography } from "antd"

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

const TransactionCard = ({ signer }) => {
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const [payToken, setPayToken] = useState(false)
    const [mint, setMint] = useState(false)
    const address = currentTransaction?.requested_by?.public_address
    const dispatch = useDispatch()
    const getEmoji = () => {
        if (currentTransaction?.stream === "DESIGN") {
            return "🎨"
        } else {
            return "🎨"
        }
    }

    const [feedBackShow, setFeedBackSow] = useState(false)
    const [feedback, setFeedback] = useState("")

    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)
    const [payDetail, setPayDetail] = useState([
        {
            amount: "",
            token_type: null,
            address: currentTransaction?.requested_by?.public_address,
            usd_amount: ETHprice,
        },
    ])

    const availableToken = useSelector((x) => x.dao.balance)

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
        console.log(e.target.value, index)
        payDetail[index].amount = e.target.value
        console.log(payDetail)
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
        if (
            payDetail[0]?.amount !== 0 &&
            payDetail[0]?.amount !== "" &&
            payDetail[0]?.amount !== "0"
        ) {
            dispatch(
                approveContriRequest(payDetail, false, feedback, mint ? 1 : 0)
            )
            dispatch(setTransaction(null))
        } else {
            message.error("Please Add Amount")
        }
    }
    console.log("MINT", mint, payToken)

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
                {`${currentTransaction?.title}`}
            </span>

            <div className={styles.contributorContainer}>
                <img className={styles.faceIcon} src={assets.icons.faceIcon} />
                <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${
                    currentTransaction?.requested_by?.metadata?.name
                } . (${address?.slice(0, 5)}...${address?.slice(-3)})`}</div>
            </div>

            <div className={styles.timelineContainer}>
                <img className={styles.faceIcon} src={assets.icons.feedIcon} />
                <div
                    className={`${textStyle.m_16} ${styles.ownerInfo}`}
                >{`${currentTransaction?.stream?.toLowerCase()} ${
                    currentTransaction?.time_spent
                } hrs`}</div>
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

            <div style={{ marginTop: "1rem", marginBottom: "5rem" }}>
                <ApprovalSelectionToggle
                    toggleTitle="Pay in tokens"
                    type="token"
                    feedbackShow={feedBackShow}
                    setFeedBackSow={(x) => setFeedBackSow(x)}
                    payDetail={payDetail}
                    addToken={() => addToken()}
                    updatedPayDetail={(e, index) => updatedPayDetail(e, index)}
                    updateTokenType={(value, index) =>
                        updateTokenType(value, index)
                    }
                    active={payToken}
                    setActive={() => setPayToken(!payToken)}
                />
            </div>
            <div
                style={{
                    width: "20%",
                    height: "5rem",
                    position: "absolute",
                    bottom: 0,
                    background: "black",
                    display: "flex",
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
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
                    onClick={() => onApproveTransaction()}
                    className={styles.payNow}
                >
                    <div className={`${textStyle.ub_16}`}>Approve Request</div>
                </div>
            </div>
        </div>
    )
}

export default TransactionCard

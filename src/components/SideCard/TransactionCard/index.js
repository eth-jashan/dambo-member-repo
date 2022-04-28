import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Input, message, Typography } from "antd"
import { IoAddOutline, GoChevronUp } from "react-icons/all"
import cross from "../../../assets/Icons/cross_white.svg"
import deleteIcon from "../../../assets/Icons/delete_icon.svg"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import {
    approveContriRequest,
    rejectContriRequest,
    setTransaction,
} from "../../../store/actions/transaction-action"

import { convertTokentoUsd } from "../../../utils/conversion"
import { TokenInput } from "../../InputComponent/TokenInput"

const TransactionCard = ({ signer }) => {
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const token_available = useSelector((x) => x.dao.balance)
    const address = currentTransaction?.requested_by?.public_address
    const dispatch = useDispatch()
    const getEmoji = () => {
        if (currentTransaction?.stream === "DESIGN") {
            return "🎨"
        } else {
            return "🎨"
        }
    }

    const ETHprice = useSelector((x) => x.transaction.initialETHPrice)
    const [feedBackShow, setFeedBackSow] = useState(false)
    const [feedback, setFeedback] = useState("")
    const [payDetail, setPayDetail] = useState([
        {
            amount: "",
            token_type: null,
            address: currentTransaction?.requested_by?.public_address,
            usd_amount: ETHprice,
        },
    ])

    const addToken = async () => {
        const usdCoversion = await convertTokentoUsd("ETH")
        if (usdCoversion) {
            const newDetail = {
                amount: "",
                token_type: null,
                usd_amount: usdCoversion,
                address: currentTransaction?.requested_by?.public_address,
            }
            setPayDetail([...payDetail, newDetail])
        }
    }

    const updatedPayDetail = async (e, index) => {
        payDetail[index].amount = e.target.value
        setPayDetail(payDetail)
    }

    const updateTokenType = async (value, index) => {
        const usdCoversion = await convertTokentoUsd(value.label)
        if (usdCoversion) {
            payDetail[index].token_type = value.value
            payDetail[index].usd_amount = usdCoversion
            setPayDetail(payDetail)
        }
    }

    const onContributionPress = () => {
        dispatch(setTransaction(null))
    }
    const onApproveTransaction = async () => {
        if (
            payDetail[0].amount !== 0 &&
            payDetail[0].amount !== "" &&
            payDetail[0].amount !== "0"
        ) {
            dispatch(approveContriRequest(payDetail, false, feedback))
            dispatch(setTransaction(null))
        } else {
            message.error("Please Add Amount")
        }
    }

    const feedBackContainer = () => (
        <div style={{ width: "100%", marginBottom: "5rem" }}>
            <div
                onClick={() => setFeedBackSow(!feedBackShow)}
                className={styles.feedBackContainer}
            >
                <div className={`${textStyle.m_16}`}>Add Feedback</div>
                {!feedBackShow ? (
                    <IoAddOutline color="#808080" className={styles.add} />
                ) : (
                    <GoChevronUp color="white" className={styles.add} />
                )}
            </div>
            {feedBackShow && (
                <Input.TextArea
                    placeholder="Write your feedback here"
                    className={styles.textArea}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            )}
        </div>
    )

    return (
        <div className={styles.container}>
            <img
                onClick={() => onContributionPress()}
                src={cross}
                alt="cross"
                className={styles.cross}
            />
            <span
                className={`${textStyle.ub_23} ${styles.title}`}
            >{`${getEmoji()}`}</span>
            <span
                ellipsis={{ rows: 2 }}
                className={`${textStyle.ub_23} ${styles.title}`}
            >
                {`${currentTransaction?.title}`}
            </span>
            <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${
                currentTransaction?.requested_by?.metadata?.name
            } . (${address?.slice(0, 5)}...${address?.slice(-3)})`}</div>
            <div
                className={`${textStyle.m_16} ${styles.timeInfo}`}
            >{`${currentTransaction?.stream?.toLowerCase()} ${
                currentTransaction?.time_spent
            } hrs`}</div>

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

            <div className={styles.amountScroll}>
                {payDetail?.map((item, index) => (
                    <TokenInput
                        key={index}
                        dark={true}
                        updateTokenType={(x) => updateTokenType(x, index)}
                        value={item.amount}
                        onChange={(e) => updatedPayDetail(e, index)}
                    />
                ))}
            </div>

            <div
                onClick={
                    token_available?.length > 1 ? () => addToken() : () => {}
                }
                className={styles.addToken}
            >
                <div className={`${textStyle.m_16}`}>Add another token</div>
                <IoAddOutline color="#808080" className={styles.add} />
            </div>

            {feedBackContainer()}
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
                    onClick={async () =>
                        await dispatch(
                            rejectContriRequest(currentTransaction?.id)
                        )
                    }
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

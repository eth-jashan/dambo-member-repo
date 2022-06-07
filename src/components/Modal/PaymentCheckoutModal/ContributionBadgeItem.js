import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { rejectApproval } from "../../../store/actions/transaction-action"
import styles from "./styles.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { Typography } from "antd"
import { getContriRequest } from "../../../store/actions/dao-action"
import { assets } from "../../../constant/assets"

const ContributionBadgeItem = ({
    item,
    index,
    approvedBadgeLength,
    checkoutType = "contribution",
    payoutDetail,
    onClose,
}) => {
    const dispatch = useDispatch()
    const approvedPayoutLength = useSelector(
        (x) => x.transaction.approvedContriRequest
    )

    const [openCard, setOpenCard] = useState(false)
    const getPayoutTotal = (payout) => {
        const usd_amount = []
        payout?.forEach((item) => {
            usd_amount.push(item?.usd_amount * parseFloat(item?.amount))
        })
        let amount_total
        usd_amount.length === 0
            ? (amount_total = 0)
            : (amount_total = usd_amount.reduce((a, b) => a + b))

        return amount_total.toFixed(2)
    }

    const contributionInfo = () => (
        <div>
            <div className={`${styles.flexInfo} ${styles.marginTopClock}`}>
                <img src={assets.icons.clockIcon} />
                <div className={`${styles.hourTitle} ${textStyles.m_16}`}>
                    {item?.time_spent} hour
                </div>
            </div>
            <div className={`${styles.flexInfo} ${styles.clockInfoStyles}`}>
                <img
                    className={styles.clockStyle}
                    src={assets.icons.feedIconBlack}
                />
                <div>
                    <Typography.Paragraph
                        className={`${styles.hourTitle} ${textStyles.m_16}`}
                        ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: (
                                <Typography.Text
                                    className={`${styles.hourTitle} ${textStyles.m_16}`}
                                >
                                    read more
                                </Typography.Text>
                            ),
                        }}
                    >
                        {item?.description}
                    </Typography.Paragraph>
                </div>
            </div>
        </div>
    )

    const getTokenInfo = () => {
        const totalToken = []
        if (checkoutType === "contribution") {
            item.tokens.forEach((x) => {
                if (
                    !totalToken.includes(
                        x?.token_type?.token
                            ? x?.token_type?.token?.symbol
                            : "ETH"
                    )
                ) {
                    totalToken.push(
                        x?.token_type?.token
                            ? x?.token_type?.token?.symbol
                            : "ETH"
                    )
                }
            })
            if (totalToken.length > 1) {
                return `${totalToken[0]} & ${totalToken.length - 1} more`
            } else {
                return `${totalToken[0]}`
            }
        } else if (checkoutType === "payment") {
            payoutDetail.forEach((x) => {
                if (
                    !totalToken.includes(
                        x?.token_type?.token
                            ? x?.token_type?.token?.symbol
                            : "ETH"
                    )
                ) {
                    totalToken.push(
                        x?.token_type?.token
                            ? x?.token_type?.token?.symbol
                            : "ETH"
                    )
                }
            })
            if (totalToken.length > 1) {
                return `${totalToken[0]} and ${totalToken[1]}`
            } else {
                return `${totalToken[0]}`
            }
        }
    }

    const getPayoutInfo = () => (
        <div className={styles.payoutDiv}>
            <div className={styles.payoutInfoCnt}>
                <img src={assets.icons.cashIcon} className={styles.cashIcon} />
                <div className={`${styles.payoutInfo} ${textStyles.m_16}`}>
                    {getPayoutTotal(item.tokens)}$ payment request in{" "}
                    {getTokenInfo()}
                </div>
            </div>
            <div className={`${textStyles.m_16} ${styles.viewMore}`}>View</div>
        </div>
    )
    const getFeedbackInfo = () => (
        <div className={styles.payoutDiv}>
            <div className={styles.payoutInfoCnt}>
                <img
                    src={assets.icons.feedbackCardIcon}
                    className={styles.cashIcon}
                />
                <div className={`${styles.payoutInfo} ${textStyles.m_16}`}>
                    Feedback info
                </div>
            </div>
            <div className={`${textStyles.m_16} ${styles.viewMore}`}>View</div>
        </div>
    )

    const getTotalTokenInfo = () => (
        <div className={styles.paymentTokenDiv}>
            <div className={styles.payoutTotal}>
                <img src={assets.icons.cashIcon} className={styles.cashIcon} />
                <div className={styles.widthFull}>
                    <div
                        className={`${textStyles.m_16} ${styles.payoutTotalTitle}`}
                    >
                        {getPayoutTotal(payoutDetail)}$ Total Payout in{" "}
                        {getTokenInfo()}
                    </div>
                    {payoutDetail.map((x, i) => (
                        <div key={i} className={styles.tokenItem}>
                            <div className={`${textStyles.m_16}`}>{`${
                                x.amount
                            } ${x?.token_type?.token?.symbol || "ETH"}`}</div>
                            <div className={`${textStyles.m_16}`}>
                                {getPayoutTotal(payoutDetail)}0$
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const getCardBorderRadius = () => {
        if (
            (index === approvedBadgeLength - 1 && approvedBadgeLength > 1) ||
            (approvedPayoutLength - 1 === index && approvedPayoutLength > 1)
        ) {
            return "0rem 0rem 0.75rem 0.75rem"
        } else if (approvedBadgeLength === 1 || approvedPayoutLength === 1) {
            return "0.75rem"
        }
    }

    const getCardMarginBottom = () => {
        if (
            (index === approvedBadgeLength - 1 && approvedBadgeLength > 1) ||
            (approvedPayoutLength - 1 === index && approvedPayoutLength > 1)
        ) {
            return "1rem"
        } else if (approvedBadgeLength === 1 || approvedPayoutLength === 1) {
            return "1rem"
        }
    }

    const cancelContribution = async () => {
        if (checkoutType === "contribution") {
            await dispatch(rejectApproval(item?.id))
            await dispatch(getContriRequest())
            onClose()
        } else if (checkoutType === "payment") {
            await dispatch(rejectApproval(item?.id))
            await dispatch(getContriRequest())
            onClose()
        }
    }

    return (
        <div
            style={{
                borderRadius: getCardBorderRadius(),
                marginBottom: getCardMarginBottom(),
                borderTopLeftRadius: index === 0 && "1rem",
                borderTopRightRadius: index === 0 && "1rem",
            }}
            className={styles.contributionWrapper}
        >
            {index !== 0 && <div className={styles.cardDivider} />}
            <div
                style={{
                    borderRadius: getCardBorderRadius(),
                    marginBottom: getCardMarginBottom(),
                    borderTopLeftRadius: index === 0 && "1rem",
                    borderTopRightRadius: index === 0 && "1rem",
                }}
                className={styles.contriBadgeDiv}
            >
                <div className={styles.widthFull}>
                    <div className={styles.closedDiv}>
                        <div className={styles.contriInfo}>
                            <div
                                style={{ textAlign: "start" }}
                                className={`${
                                    openCard
                                        ? textStyles.ub_16
                                        : textStyles.m_16
                                }`}
                            >
                                {item?.title}
                            </div>
                            <div className={styles.contriRequestInfo}>
                                <div
                                    style={{ opacity: !openCard ? "0.6" : "1" }}
                                    className={`${textStyles.m_16}`}
                                >
                                    {item?.stream?.toLowerCase()}
                                </div>
                                <div
                                    style={{ opacity: !openCard ? "0.5" : "1" }}
                                    className={`${textStyles.m_16}`}
                                >
                                    • {item?.requested_by.metadata.name} •
                                    {`${item?.requested_by.public_address.slice(
                                        0,
                                        5
                                    )}...${item?.requested_by.public_address.slice(
                                        -3
                                    )}`}
                                </div>
                            </div>
                        </div>
                        {item.tokens.length > 0 &&
                            checkoutType === "contribution" && (
                                <div className={styles.cashIconContainer}>
                                    <img
                                        src={assets.icons.cashIcon}
                                        className={styles.cashIcon}
                                    />
                                    <div className={styles.divider} />
                                </div>
                            )}
                        {item.feedback && checkoutType === "payment" && (
                            <div className={styles.cashIconContainer}>
                                <img
                                    src={assets.icons.feedbackCardIcon}
                                    className={styles.cashIcon}
                                />
                                <div className={styles.divider} />
                            </div>
                        )}
                    </div>
                    {item?.feedback && checkoutType === "contribution" ? (
                        <div className={styles.feedbackCnt}>
                            <img
                                src={assets.icons.feedbackCardIcon}
                                className={styles.feedbackCardIcon}
                            />
                            <div
                                className={`${textStyles.m_16} ${styles.feedbackText}`}
                            >
                                “{item?.feedback}”
                            </div>
                        </div>
                    ) : null}

                    {checkoutType === "payment" ? getTotalTokenInfo() : null}
                    {item.tokens.length > 0 &&
                        checkoutType === "contribution" &&
                        getPayoutInfo()}
                    {item.feedback &&
                        checkoutType === "payment" &&
                        getFeedbackInfo()}
                    {openCard && contributionInfo()}

                    {openCard && (
                        <div
                            onClick={async () => await cancelContribution()}
                            className={`${textStyles.m_16} ${styles.cancelRequest}`}
                        >
                            Cancel Request
                        </div>
                    )}
                </div>
                <div>
                    {!openCard ? (
                        <img
                            onClick={() => setOpenCard(true)}
                            src={assets.icons.downBlack}
                            className={styles.downBlackIcon}
                        />
                    ) : (
                        <img
                            onClick={() => setOpenCard(false)}
                            src={assets.icons.upBlack}
                            className={styles.downBlackIcon}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContributionBadgeItem

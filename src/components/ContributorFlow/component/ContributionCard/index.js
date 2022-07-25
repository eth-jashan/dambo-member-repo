import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { assets } from "../../../../constant/assets"
import { setContributionSelection } from "../../../../store/actions/contibutor-action"
import payments_orange from "../../../../assets/Icons/payments_orange.svg"
import received_white from "../../../../assets/Icons/received_white.svg"
import dayjs from "dayjs"

export default function ContributionCardV2({
    item,
    isMinimum,
    index,
    selected,
    isLast,
    isFirst,
    contributionType,
    updateCheckbox,
}) {
    const contributionSelected = useSelector(
        (x) => x.contributor.contributorSelectionContribution
    )
    const dispatch = useDispatch()

    const onContributionSelection = () => {
        dispatch(
            setContributionSelection({
                ...item,
                contributionType,
                isFirst,
            })
        )
    }

    const [isHovered, setIsHovered] = useState(false)

    let totalAmountInUsd = 0
    item?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })

    return (
        <div
            className={`contributor-contribution-card-container ${
                contributionSelected?.uuid === item?.uuid
                    ? "selected-contribution"
                    : ""
            } ${index === 0 && !isFirst ? "first-contribution" : ""}
            ${isLast ? "last-contribution" : ""}
            ${contributionType === "approved" && isFirst && "with-checkbox"}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && isFirst && (
                <div
                    className="more-details-hover"
                    onClick={onContributionSelection}
                >
                    more details
                </div>
            )}
            {contributionType === "approved" && isFirst && (
                <input
                    type="checkbox"
                    value={item.isChecked}
                    checked={item.isChecked}
                    onChange={(e) => updateCheckbox(e, index)}
                    className="contribution-approve-checkbox"
                />
            )}
            {/* {!isMinimum && (
                <div className="maximum-div">
                    <div
                        onClick={onContributionSelection}
                        className="contri-info"
                    >
                        <div className="flex-div">
                            <img src={assets.icons.sentWhite} />
                            <div className="contri-meta">
                                <div className="contri-title">
                                    {
                                        item?.details?.find(
                                            (x) =>
                                                x.fieldName ===
                                                "Contribution Title"
                                        )?.value
                                    }
                                </div>
                                <div className="contri-type">
                                    design •{" "}
                                    {item?.details?.find(
                                        (x) =>
                                            x.fieldName === "Contribution Title"
                                    )?.value &&
                                        `${
                                            item?.details?.find(
                                                (x) =>
                                                    x.fieldName ===
                                                    "Time Spent in Hours"
                                            )?.value
                                        }hrs`}
                                </div>
                                <div className="submission-link">
                                    Submission link
                                </div>
                            </div>
                        </div>
                        <div className="contri-feedback">
                            “incredible work and really appreciate coming onver
                            the weekend, love you man, no homo”
                        </div>
                    </div>
                    <div className="action-btn">
                        <div className="claim-btn">
                            <div>Claim Badge</div>
                        </div>
                        <div className="reject-btn">
                            <div>Reject Badge</div>
                        </div>
                    </div>
                </div>
            )} */}
            {isMinimum && (
                <div
                    className="minimum-div"
                    onClick={
                        isFirst ? () => {} : () => onContributionSelection()
                    }
                >
                    <div className="contri-left-min">
                        <div className="contri-title-min">
                            <img
                                src={
                                    item?.created_by_id === item?.created_for_id
                                        ? assets.icons.sentWhite
                                        : received_white
                                }
                            />
                            <div className="title-min">
                                {
                                    item?.details?.find(
                                        (x) =>
                                            x.fieldName === "Contribution Title"
                                    )?.value
                                }
                            </div>
                        </div>
                    </div>
                    <div className="contri-right-min">
                        <div className="contri-right-row">
                            <div className="contri-type-min">
                                {
                                    item?.details?.find(
                                        (x) =>
                                            x.fieldName ===
                                            "Contribution Category"
                                    )?.value
                                }{" "}
                                •{" "}
                                {`${
                                    item?.details?.find(
                                        (x) =>
                                            x.fieldName ===
                                            "Time Spent in Hours"
                                    )?.value
                                }hrs`}{" "}
                                {contributionType !== "approved" &&
                                    `• ${dayjs(item?.createdAt).format(
                                        "DD MMM"
                                    )}`}
                            </div>
                            <div
                                className={`contri-incentive ${contributionType}`}
                            >
                                <div>
                                    {contributionType === "approved" ? (
                                        `${dayjs(item?.createdAt).format(
                                            "DD MMM"
                                        )}`
                                    ) : contributionType === "pending" ? (
                                        <>
                                            {!item?.tokens?.length &&
                                            !item?.voucher_id
                                                ? "waiting for approval"
                                                : "waiting for signing"}
                                            {item?.tokens?.length ? (
                                                <img
                                                    src={payments_orange}
                                                    alt=""
                                                />
                                            ) : (
                                                ""
                                            )}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        </div>
                        {item?.feedback && (
                            <div className="contri-feedback">
                                {item?.feedback}
                            </div>
                        )}
                        {item?.tokens?.length ? (
                            <>
                                <div className="payout-details-text">
                                    <div>
                                        {totalAmountInUsd}$ Total Payout in{" "}
                                        {item?.tokens[0]?.details?.symbol}
                                        {item?.tokens?.length > 1 &&
                                            `${
                                                item?.tokens?.length > 2
                                                    ? ", "
                                                    : "and "
                                            }
                                        ${item?.tokens[1]?.details?.symbol}`}
                                        {item?.tokens?.length > 2 &&
                                            `and ${
                                                item?.tokens?.length - 2
                                            } more`}
                                    </div>
                                    <div>Payment waiting for execution</div>
                                </div>
                                <div className="payout-token-details">
                                    {item?.tokens?.map((token, index) => (
                                        <div
                                            className="payout-token-row"
                                            key={index}
                                        >
                                            <div>
                                                {token?.amount}{" "}
                                                {token?.details?.symbol}
                                            </div>
                                            <div>
                                                {token?.usd_amount *
                                                    token?.amount}
                                                $
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

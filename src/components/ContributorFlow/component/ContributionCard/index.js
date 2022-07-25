import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { assets } from "../../../../constant/assets"
import { setContributionSelection } from "../../../../store/actions/contibutor-action"
import payments_orange from "../../../../assets/Icons/payments_orange.svg"
import payments_green from "../../../../assets/Icons/payments_green.svg"
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
    const [showMore, setShowMore] = useState(false)

    let totalAmountInUsd = 0
    item?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })

    console.log("item is", item)

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
            onClick={isFirst ? () => {} : () => onContributionSelection()}
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
            {isMinimum && (
                <div className="minimum-div">
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
                                        <>
                                            {item?.status === "REJECTED" ? (
                                                <div className="rejected">
                                                    Rejected
                                                </div>
                                            ) : (
                                                <>
                                                    {item?.is_badge ? (
                                                        item?.badge_status ===
                                                        "CLAIMED" ? (
                                                            "Claimer"
                                                        ) : (
                                                            <div className="rejected">
                                                                Rejected
                                                            </div>
                                                        )
                                                    ) : (
                                                        ""
                                                    )}
                                                    {item?.tokens?.length ? (
                                                        <img
                                                            src={payments_green}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        ""
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        {item?.contributionType === "approved" && (
                            <>
                                {item?.feedback && (
                                    <div className="contri-feedback">
                                        {item?.feedback}
                                    </div>
                                )}
                                {item?.tokens?.length ? (
                                    <>
                                        <div className="payout-details-text">
                                            <div>
                                                {totalAmountInUsd}$ Total Payout
                                                in{" "}
                                                {
                                                    item?.tokens[0]?.details
                                                        ?.symbol
                                                }
                                                {item?.tokens?.length > 1 &&
                                                    `${
                                                        item?.tokens?.length > 2
                                                            ? ", "
                                                            : "and "
                                                    }
                                        ${item?.tokens[1]?.details?.symbol}`}
                                                {item?.tokens?.length > 2 &&
                                                    ` and ${
                                                        item?.tokens?.length - 2
                                                    } more`}
                                            </div>
                                            {item?.payout_status !== "PAID" &&
                                                item?.payout_status !==
                                                    "REJECTED" && (
                                                    <div>
                                                        Payment waiting for
                                                        execution
                                                    </div>
                                                )}
                                        </div>
                                        <div className="payout-token-details">
                                            {/* {item?.tokens?.map((token, index) => (
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
                                    ))} */}

                                            {item?.tokens
                                                ?.slice(0, 2)
                                                .map((token, index) => (
                                                    <div
                                                        className="payout-token-row"
                                                        key={index}
                                                    >
                                                        <div className="highlighted">
                                                            {token?.amount}{" "}
                                                            {
                                                                token?.details
                                                                    ?.symbol
                                                            }
                                                        </div>
                                                        <div>
                                                            {token?.usd_amount *
                                                                token?.amount}
                                                            $
                                                        </div>
                                                    </div>
                                                ))}
                                            {item?.tokens?.length > 2 && (
                                                <div>
                                                    {showMore ? (
                                                        <>
                                                            {item?.tokens
                                                                ?.slice(2)
                                                                .map(
                                                                    (
                                                                        token,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            className="payout-token-row"
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <div className="highlighted">
                                                                                {
                                                                                    token?.amount
                                                                                }{" "}
                                                                                {
                                                                                    token
                                                                                        ?.details
                                                                                        ?.symbol
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                {token?.usd_amount *
                                                                                    token?.amount}

                                                                                $
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                )}
                                                            <div
                                                                onClick={() =>
                                                                    setShowMore(
                                                                        false
                                                                    )
                                                                }
                                                                className="show-more-or-less"
                                                            >
                                                                Show less
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div
                                                            onClick={() =>
                                                                setShowMore(
                                                                    true
                                                                )
                                                            }
                                                            className="show-more-or-less"
                                                        >
                                                            Show More
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

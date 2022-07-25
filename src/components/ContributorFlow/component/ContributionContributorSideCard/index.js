import React, { useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { assets } from "../../../../constant/assets"
import { setContributionSelection } from "../../../../store/actions/contibutor-action"
import { Typography } from "antd"
import ContributionBadgeBg from "../../../../assets/Icons/ContributionBadgeBg.png"
import waiting_orange from "../../../../assets/Icons/waiting_orange.svg"
import check_green from "../../../../assets/Icons/check_green.svg"

export default function ContributionContributorSideCard({
    isMinimum,
    index,
    selected,
}) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const dispatch = useDispatch()

    console.log("current dao is", currentDao)

    const contributorSelectionContribution = useSelector(
        (x) => x.contributor.contributorSelectionContribution
    )
    const [showMore, setShowMore] = useState(false)

    let totalAmountInUsd = 0
    contributorSelectionContribution?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })

    return (
        <div className="contributor-contribution-side-card-container">
            <div className="contri-title">
                {
                    contributorSelectionContribution?.details?.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value
                }
            </div>
            <div className="contri-badge-wrapper">
                <div className="contri-badge">
                    <img
                        src={ContributionBadgeBg}
                        alt=""
                        className="contri-badge-bg"
                    />
                    <div className="contri-badge-dao">
                        <img src={currentDao?.logo_url} alt="" />
                        {currentDao?.name}
                    </div>
                    <div className="contri-badge-contribution-info">
                        <div className="contri-badge-title">
                            {
                                contributorSelectionContribution?.details?.find(
                                    (x) => x.fieldName === "Contribution Title"
                                )?.value
                            }
                        </div>
                        <div className="contri-badge-bottom-row">
                            <div>
                                Design •{" "}
                                {
                                    contributorSelectionContribution?.details?.find(
                                        (x) =>
                                            x.fieldName ===
                                            "Time Spent in Hours"
                                    )?.value
                                }
                                hrs
                            </div>
                            <div>22 July' 22</div>
                        </div>
                    </div>
                </div>
                {contributorSelectionContribution?.feedback && (
                    <div className="contri-feedback">
                        {contributorSelectionContribution?.feedback}
                    </div>
                )}
            </div>
            {contributorSelectionContribution?.tokens?.length && (
                <div className="contri-payout-info">
                    <div>
                        <span className="highlighted">{totalAmountInUsd}$</span>{" "}
                        Total Payout
                    </div>
                    {contributorSelectionContribution?.tokens
                        ?.slice(0, 2)
                        .map((token, index) => (
                            <div className="token-payout-row" key={index}>
                                <div className="highlighted">
                                    {token?.amount} {token?.details?.symbol}
                                </div>
                                <div>{token?.usd_amount * token?.amount}$</div>
                            </div>
                        ))}
                    {contributorSelectionContribution?.tokens?.length > 2 && (
                        <div>
                            {showMore ? (
                                <>
                                    {contributorSelectionContribution?.tokens
                                        ?.slice(2)
                                        .map((token, index) => (
                                            <div
                                                className="token-payout-row"
                                                key={index}
                                            >
                                                <div className="highlighted">
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
                                    <div
                                        onClick={() => setShowMore(false)}
                                        className="show-more-or-less"
                                    >
                                        Show less
                                    </div>
                                </>
                            ) : (
                                <div
                                    onClick={() => setShowMore(true)}
                                    className="show-more-or-less"
                                >
                                    Show More
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="contri-info">
                <div className="contributor-info">aviral • aviralsb.eth</div>
                <div className="contri-type">
                    {
                        contributorSelectionContribution?.details?.find(
                            (x) => x.fieldName === "Contribution Category"
                        )?.value
                    }{" "}
                    •{" "}
                    {
                        contributorSelectionContribution?.details?.find(
                            (x) => x.fieldName === "Time Spent in Hours"
                        )?.value
                    }
                    hrs
                </div>

                <Typography.Paragraph
                    className={"contri-description"}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: (
                            <div className={"contri-description-more"}>
                                read more
                            </div>
                        ),
                    }}
                >
                    {
                        contributorSelectionContribution?.details?.find(
                            (x) => x.fieldName === "Additional Notes"
                        )?.value
                    }
                </Typography.Paragraph>
            </div>
            <div className="badge-sign-collapsable">
                <div
                    className={`closed-div ${contributorSelectionContribution?.contributionType}`}
                >
                    {contributorSelectionContribution?.contributionType ===
                    "pending" ? (
                        <>
                            <div className="title">
                                <img src={waiting_orange} alt="" />
                                {/* Waiting for signing */}
                                {!contributorSelectionContribution?.tokens
                                    ?.length &&
                                !contributorSelectionContribution?.voucher_id
                                    ? "waiting for approval"
                                    : "waiting for signing"}
                            </div>
                            <img src={assets.icons.downWhite} />
                        </>
                    ) : (
                        <>
                            <div className="title">
                                <img src={check_green} alt="" />
                                Signed
                            </div>
                            <img src={assets.icons.downWhite} />
                        </>
                    )}
                </div>
            </div>
            {contributorSelectionContribution?.contributionType ===
            "approved" ? (
                contributorSelectionContribution?.isFirst ? (
                    <div className="claim-bottom-btn">
                        <div className="claim-btn">
                            <div className="btn-title">Claim badge</div>
                        </div>
                        <div className="reject-btn">Reject</div>
                    </div>
                ) : (
                    <div className="claim-bottom-btn">
                        Please sign previous transaction to sign this one
                    </div>
                )
            ) : (
                <></>
            )}
        </div>
    )
}

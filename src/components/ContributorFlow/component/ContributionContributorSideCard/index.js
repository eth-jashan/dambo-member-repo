import React, { useEffect, useState } from "react"
import "./style.scss"
import { useSelector } from "react-redux"
import { assets } from "../../../../constant/assets"
import { Typography } from "antd"
import ContributionBadgeBg from "../../../../assets/Icons/ContributionBadgeBg.png"
import waiting_orange from "../../../../assets/Icons/waiting_orange.svg"
import check_green from "../../../../assets/Icons/check_green.svg"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { getSafeServiceUrl } from "../../../../utils/multiGnosisUrl"
import { useNetwork, useAccount, useEnsName } from "wagmi"
import arrow_drop_down_orange from "../../../../assets/Icons/arrow_drop_down_orange.svg"
import arrow_up_orange from "../../../../assets/Icons/arrow_up_orange.svg"
import dayjs from "dayjs"
import CheckSvg from "../../../../assets/Icons/check.svg"

export default function ContributionContributorSideCard({
    isMinimum,
    index,
    selected,
}) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const { address } = useAccount()

    const contributorSelectionContribution = useSelector(
        (x) => x.contributor.contributorSelectionContribution
    )
    const [showMore, setShowMore] = useState(false)

    let totalAmountInUsd = 0
    contributorSelectionContribution?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })
    const { chain } = useNetwork()

    const serviceClient = new SafeServiceClient(getSafeServiceUrl(chain?.id))

    const [signersInfo, setSignersInfo] = useState(null)
    const safeInfo = useSelector((x) => x.dao.safeInfo)

    const getPayoutInfo = async () => {
        if (contributorSelectionContribution?.gnosis_reference_id) {
            const tx = await serviceClient.getTransaction(
                contributorSelectionContribution?.gnosis_reference_id
            )
            console.log("service client tx is", tx)
            setSignersInfo({
                ...tx,
            })
        }
    }

    const [isToggleOpen, setIsToggleOpen] = useState(false)

    const toggle = () => {
        setIsToggleOpen((isToggleOpen) => !isToggleOpen)
    }
    const currentUser = useSelector((x) => x.dao.username)
    const {
        data: ensName,
        isError,
        isLoading,
    } = useEnsName({
        address,
    })

    useEffect(() => {
        getPayoutInfo()
    }, [contributorSelectionContribution])

    console.log("sadsadx", signersInfo, safeInfo)

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
                <div className="contributor-info">
                    {currentUser} •{" "}
                    {ensName ||
                        `${address?.slice(0, 5)}...${address?.slice(-3)}`}
                </div>
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
            {signersInfo && (
                <div className="badge-sign-collapsable">
                    {signersInfo && signersInfo?.isExecuted ? (
                        <div
                            className={`closed-div green-color`}
                            onClick={toggle}
                        >
                            <div className="title">
                                <img src={check_green} alt="" />
                                Signed
                            </div>
                            <img src={assets.icons.downWhite} />
                        </div>
                    ) : (
                        <>
                            <div
                                className={`closed-div orange-color`}
                                onClick={toggle}
                            >
                                <div className="title">
                                    <img src={waiting_orange} alt="" />
                                    {/* Waiting for signing */}
                                    {!contributorSelectionContribution?.tokens
                                        ?.length &&
                                    !contributorSelectionContribution?.voucher_id
                                        ? "waiting for approval"
                                        : signersInfo?.confirmations?.length >=
                                          safeInfo?.threshold
                                        ? "waiting for execution"
                                        : `waiting for signing • ${signersInfo?.confirmations?.length}/${safeInfo?.threshold}`}
                                </div>
                                <img
                                    src={
                                        isToggleOpen
                                            ? arrow_up_orange
                                            : arrow_drop_down_orange
                                    }
                                />
                            </div>
                            <div
                                className={`${
                                    isToggleOpen ? "signers-info-shown " : ""
                                } signers-info`}
                            >
                                {signersInfo?.confirmations?.length >=
                                safeInfo?.threshold ? (
                                    <>
                                        <div>Signing Done</div>
                                        <div className="signer-time">
                                            {dayjs(
                                                signersInfo?.modified
                                            ).fromNow()}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {signersInfo?.confirmations?.map(
                                            (signer, index) => (
                                                <div
                                                    className="signer-row"
                                                    key={index}
                                                >
                                                    <div>
                                                        somesh • somcha.eth
                                                    </div>
                                                    <img
                                                        src={CheckSvg}
                                                        alt=""
                                                    />
                                                </div>
                                            )
                                        )}
                                    </>
                                )}
                                <div>|</div>
                                <div>Request Approved</div>
                                <div className="signer-time">
                                    {dayjs(
                                        signersInfo?.submissionDate
                                    ).fromNow()}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

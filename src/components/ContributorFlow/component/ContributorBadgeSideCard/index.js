import React, { useState, useEffect } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross_white.svg"
import { useSelector, useDispatch } from "react-redux"
import { setContributionDetail } from "../../../../store/actions/contibutor-action"
import { assets } from "../../../../constant/assets"
import { Typography } from "antd"
import waiting_orange from "../../../../assets/Icons/waiting_orange.svg"
import check_green from "../../../../assets/Icons/check_green.svg"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import { getSafeServiceUrl } from "../../../../utils/multiGnosisUrl"
import { useNetwork, useAccount, useEnsName } from "wagmi"
import arrow_drop_down_orange from "../../../../assets/Icons/arrow_drop_down_orange.svg"
import arrow_up_orange from "../../../../assets/Icons/arrow_up_orange.svg"
import dayjs from "dayjs"
import CheckSvg from "../../../../assets/Icons/check.svg"

export default function ContributorBadgeSideCard() {
    const dispatch = useDispatch()
    const onContributionCrossPress = () => {
        dispatch(setContributionDetail(null))
    }
    const { address } = useAccount()

    const currentDao = useSelector((x) => x.dao.currentDao)

    const contribution_detail = useSelector(
        (x) => x.contributor.contribution_detail
    )
    const [showMore, setShowMore] = useState(false)

    let totalAmountInUsd = 0
    contribution_detail?.entity?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })
    const { chain } = useNetwork()

    const serviceClient = new SafeServiceClient(getSafeServiceUrl(chain?.id))

    const [signersInfo, setSignersInfo] = useState(null)
    const safeInfo = useSelector((x) => x.dao.safeInfo)

    const getPayoutInfo = async () => {
        if (contribution_detail?.entity?.gnosis_reference_id) {
            const tx = await serviceClient.getTransaction(
                contribution_detail?.entity?.gnosis_reference_id
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
    }, [contribution_detail?.entity])

    return (
        <div className="contributor-badge-side-card-container">
            <img
                onClick={() => onContributionCrossPress()}
                src={cross}
                alt="cross"
                className="cross-icon"
            />
            <div className="contri-title">
                {
                    contribution_detail?.entity?.details?.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value
                }
            </div>
            {contribution_detail?.entity?.tokens?.length && (
                <div className="contri-payout-info">
                    <div>
                        <span className="highlighted">{totalAmountInUsd}$</span>{" "}
                        Total Payout
                    </div>
                    {contribution_detail?.entity?.tokens
                        ?.slice(0, 2)
                        .map((token, index) => (
                            <div className="token-payout-row" key={index}>
                                <div className="highlighted">
                                    {token?.amount} {token?.details?.symbol}
                                </div>
                                <div>{token?.usd_amount * token?.amount}$</div>
                            </div>
                        ))}
                    {contribution_detail?.entity?.tokens?.length > 2 && (
                        <div>
                            {showMore ? (
                                <>
                                    {contribution_detail?.entity?.tokens
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
                        contribution_detail?.entity?.details?.find(
                            (x) => x.fieldName === "Contribution Category"
                        )?.value
                    }{" "}
                    •{" "}
                    {
                        contribution_detail?.entity?.details?.find(
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
                        contribution_detail?.entity?.details?.find(
                            (x) => x.fieldName === "Additional Notes"
                        )?.value
                    }
                </Typography.Paragraph>
            </div>
            {signersInfo && (
                <div className="badge-sign-collapsable" onClick={toggle}>
                    {signersInfo && signersInfo?.isExecuted ? (
                        <div className={`closed-div green-color`}>
                            <div className="title">
                                <img src={check_green} alt="" />
                                Signed
                            </div>
                            <img src={assets.icons.downWhite} />
                        </div>
                    ) : (
                        <>
                            <div className={`closed-div orange-color`}>
                                <div className="title">
                                    <img src={waiting_orange} alt="" />
                                    {/* Waiting for signing */}
                                    {!contribution_detail?.entity?.tokens
                                        ?.length &&
                                    !contribution_detail?.entity?.voucher_id
                                        ? "waiting for approval"
                                        : signersInfo?.confirmations?.length ===
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
                                className={
                                    isToggleOpen
                                        ? "signers-info-shown"
                                        : "signers-info"
                                }
                            >
                                {signersInfo?.confirmations?.length ===
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

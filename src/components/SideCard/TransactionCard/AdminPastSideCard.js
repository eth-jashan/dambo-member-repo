import SafeServiceClient from "@gnosis.pm/safe-service-client"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useEnsName, useNetwork } from "wagmi"
import { getSafeServiceUrl } from "../../../utils/multiGnosisUrl"
import ContributionBadgeBg from "../../../assets/Icons/ContributionBadgeBg.png"
import waiting_orange from "../../../assets/Icons/waiting_orange.svg"
import check_green from "../../../assets/Icons/check_green.svg"
import arrow_drop_down_orange from "../../../assets/Icons/arrow_drop_down_orange.svg"
import arrow_up_orange from "../../../assets/Icons/arrow_up_orange.svg"
import CheckSvg from "../../../assets/Icons/check.svg"
import "./style.scss"
import dayjs from "dayjs"
import { Typography } from "antd"
import cross from "../../../assets/Icons/cross_white.svg"
import { assets } from "../../../constant/assets"
import etherscanIcon from "../../../assets/Icons/etherscanIcon.svg"
import openseaIcon from "../../../assets/Icons/openseaIcon.svg"
import twitterIcon from "../../../assets/Icons/twitter-icon.svg"
import { getBadgeOnMetadata } from "../../../utils/POCPServiceSdk"
import { chainType } from "../../../utils/chainType"

const AdminPastSideCard = ({ onCrossPress }) => {
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const address = currentTransaction?.contributor?.public_address
    let totalAmountInUsd = 0
    currentTransaction?.tokens.forEach((token) => {
        totalAmountInUsd = totalAmountInUsd + token?.usd_amount * token?.amount
    })
    const currentDao = useSelector((x) => x.dao.currentDao)
    const {
        data: ensName,
        isError,
        isLoading,
    } = useEnsName({
        address: currentTransaction?.contibutor?.public_address,
    })
    const [showMore, setShowMore] = useState(false)
    const getSignerName = (address) => {
        const details = currentDao?.approvers?.filter(
            (ele) => ele.addr === address
        )
        return details?.[0]?.name
    }
    const openEtherscan = () => {
        window.open(
            `https://${
                chainType(chain?.id) === "Testnet" ? "mumbai." : ""
            }polygonscan.com/token/${badgeInfo?.contractAddress?.id}?a=${
                badgeInfo?.tokenID
            }`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://${
                chainType(chain?.id) === "Testnet" ? "testnets." : ""
            }opensea.io/assets/${
                chainType(chain?.id) === "Testnet" ? "mumbai" : "matic"
            }/${badgeInfo?.contractAddress?.id}/${badgeInfo?.tokenID}`,
            "_blank"
        )
    }
    const [signersInfo, setSignersInfo] = useState(null)
    const safeInfo = useSelector((x) => x.dao.safeInfo)
    const { chain } = useNetwork()

    const serviceClient = new SafeServiceClient(getSafeServiceUrl(chain?.id))

    const [isToggleOpen, setIsToggleOpen] = useState(false)

    const toggle = () => {
        setIsToggleOpen((isToggleOpen) => !isToggleOpen)
    }
    const getPayoutInfo = async () => {
        if (currentTransaction?.gnosis_reference_id) {
            const tx = await serviceClient.getTransaction(
                currentTransaction?.gnosis_reference_id
            )
            setSignersInfo({
                ...tx,
            })
        }
    }
    const [badgeInfo, setBadgeInfo] = useState(null)

    const getBadgeInfo = async () => {
        if (currentTransaction?.badge_status === "CLAIMED") {
            const res = await getBadgeOnMetadata(
                `http://arweave.net/${currentTransaction?.metadata_hash}`,
                currentDao?.uuid
            )

            setBadgeInfo(res.data.associationBadges[0])
        }
    }

    useEffect(() => {
        if (currentTransaction?.gnosis_reference_id) {
            getPayoutInfo()
        } else {
            setSignersInfo(null)
        }
        if (currentTransaction?.badge_status === "CLAIMED") {
            getBadgeInfo()
        } else {
            setBadgeInfo(null)
        }
    }, [currentTransaction])

    return (
        <div className="admin-past-side-card-container">
            <img
                onClick={() => onCrossPress()}
                src={cross}
                alt="cross"
                className={"cross"}
            />
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
                                currentTransaction?.details?.find(
                                    (x) => x.fieldName === "Contribution Title"
                                )?.value
                            }
                        </div>
                        <div className="contri-badge-bottom-row">
                            <div>
                                {
                                    currentTransaction?.details?.find(
                                        (x) =>
                                            x.fieldName ===
                                            "Contribution Category"
                                    )?.value
                                }{" "}
                                •{" "}
                                {
                                    currentTransaction?.details?.find(
                                        (x) =>
                                            x.fieldName ===
                                            "Time Spent in Hours"
                                    )?.value
                                }
                                hrs
                            </div>
                            <div>
                                {dayjs(currentTransaction?.created_at).format(
                                    "DD MMM' YY"
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {currentTransaction?.feedback && (
                    <div className="contri-feedback">
                        {currentTransaction?.feedback}
                    </div>
                )}
                {badgeInfo && (
                    <>
                        <div className="lineBreak"></div>
                        <div className="badge-footer">
                            <div className="footer-icons">
                                <div
                                    className="badge-footer-icon"
                                    onClick={openOpensea}
                                >
                                    <img src={openseaIcon} alt="" />
                                </div>
                                <div
                                    className="badge-footer-icon"
                                    onClick={openEtherscan}
                                >
                                    <img src={etherscanIcon} alt="" />
                                </div>
                            </div>
                            <div>
                                <button>
                                    Share <img src={twitterIcon} alt="" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            {currentTransaction?.tokens?.length && (
                <div className="contri-payout-info">
                    <div>
                        <span className="highlighted">
                            {totalAmountInUsd.toFixed(2)}$
                        </span>{" "}
                        Total Payout
                    </div>
                    {currentTransaction?.tokens
                        ?.slice(0, 2)
                        .map((token, index) => (
                            <div className="token-payout-row" key={index}>
                                <div className="highlighted">
                                    {token?.amount.toFixed(2)}{" "}
                                    {token?.details?.symbol}
                                </div>
                                <div>
                                    {(
                                        token?.usd_amount * token?.amount
                                    ).toFixed(2)}
                                    $
                                </div>
                            </div>
                        ))}
                    {currentTransaction?.tokens?.length > 2 && (
                        <div>
                            {showMore ? (
                                <>
                                    {currentTransaction?.tokens
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
            console.l
            <div className="contri-info">
                <div className="contributor-info">
                    {currentTransaction?.contributor?.name} •{" "}
                    {ensName ||
                        `${address?.slice(0, 5)}...${address?.slice(-3)}`}
                </div>
                <div className="contri-type">
                    {
                        currentTransaction?.details?.find(
                            (x) => x.fieldName === "Contribution Category"
                        )?.value
                    }{" "}
                    •{" "}
                    {
                        currentTransaction?.details?.find(
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
                        currentTransaction?.details?.find(
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
                                    {!currentTransaction?.tokens?.length &&
                                    !currentTransaction?.voucher_id
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
                                                        {getSignerName(address)}{" "}
                                                        •{" "}
                                                        {`${address?.slice(
                                                            0,
                                                            5
                                                        )}...${address?.slice(
                                                            -3
                                                        )}`}
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

export default AdminPastSideCard

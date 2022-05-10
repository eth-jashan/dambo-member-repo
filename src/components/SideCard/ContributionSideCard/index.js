import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { message, Typography } from "antd"
import cross from "../../../assets/Icons/cross_white.svg"
import delete_icon from "../../../assets/Icons/delete_icon.svg"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import { setTransaction } from "../../../store/actions/transaction-action"
import {
    setClaimLoading,
    setContributionDetail,
} from "../../../store/actions/contibutor-action"
import POCPBadge from "../../POCPBadge"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import {
    checkClaimApprovedSuccess,
    isApprovedToken,
    processBadgeApprovalToPocp,
    processClaimBadgeToPocp,
} from "../../../utils/POCPutils"

import { ethers } from "ethers"
import { web3 } from "../../../constant/web3"
import {
    claimUpdate,
    getAllApprovedBadges,
    getAllClaimedBadges,
    getAllUnclaimedBadges,
    getContriRequest,
    getPayoutRequest,
    set_contri_filter,
    set_payout_filter,
} from "../../../store/actions/dao-action"
import POCPProxy from "../../../smartContract/POCP_Contracts/POCP.json"
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/all"
import * as dayjs from "dayjs"
import {
    getIpfsUrl,
    uplaodApproveMetaDataUpload,
} from "../../../utils/relayFunctions"

const serviceClient = new SafeServiceClient(
    "https://safe-transaction.rinkeby.gnosis.io/"
)

const ContributionSideCard = ({
    signer,
    isAdmin = true,
    route,
    onRouteChange,
}) => {
    const currentTransaction = useSelector(
        isAdmin
            ? (x) => x.transaction.currentTransaction
            : (x) => x.contributor.contribution_detail
    )
    const communityInfo = useSelector((x) => x.dao.communityInfo)
    const role = useSelector((x) => x.dao.role)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const address = currentTransaction?.requested_by?.public_address
    // const signer_address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const [txInfo, setTxInfo] = useState([])
    const [safeInfo, setSafeInfo] = useState()
    const dispatch = useDispatch()
    const claim_loading = useSelector((x) => x.contributor.claim_loading)
    const unclaimed = useSelector((x) => x.dao.all_unclaimed_badges)
    const [signerOpen, setSignerOpen] = useState(
        currentTransaction?.status !== "REQUESTED" &&
            !(safeInfo?.owners?.length === txInfo?.confirmations?.length)
    )
    const [executionOpen, setExecutionOpen] = useState(false)

    const all_approved_badge = useSelector((x) => x.dao.all_approved_badge)
    const getEmoji = () => {
        if (currentTransaction?.stream === "DESIGN") {
            return "🎨"
        } else {
            return "🎨"
        }
    }

    const getApproveCheck = async () => {
        console.log(currentTransaction?.approved_tx, currentTransaction)
        if (currentTransaction?.approved_tx) {
            const customHttpProvider = new ethers.providers.JsonRpcProvider(
                web3.infura
            )
            const reciept = await customHttpProvider.getTransactionReceipt(
                currentTransaction?.approved_tx
            )
            console.log("reciept", reciept)
            if (reciept.status) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const getClaimCheck = async () => {
        if (currentTransaction?.claimed_tx) {
            const customHttpProvider = new ethers.providers.JsonRpcProvider(
                web3.infura
            )
            const reciept = await customHttpProvider.getTransactionReceipt(
                currentTransaction?.claimed_tx
            )
            if (reciept.status) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    const [approvedBadge, setApprovedBadge] = useState(false)
    const [claimBadge, setClaimBadge] = useState(false)

    const getTransactionInfo = useCallback(async () => {
        let tx
        if (
            currentTransaction?.status !== "REQUESTED" &&
            currentTransaction?.status !== "REJECTED"
        ) {
            tx = await serviceClient.getTransaction(
                currentTransaction?.gnosis_reference_id
            )
        }
        const safeInfo = await serviceClient.getSafeInfo(
            currentDao?.safe_public_address
        )

        const approval = await getApproveCheck()
        const claim_status = await getClaimCheck()
        console.log("Yo", approval)
        setApprovedBadge(approval)
        setClaimBadge(claim_status)
        setTxInfo(tx)
        setSafeInfo(safeInfo)
    }, [
        currentDao?.safe_public_address,
        currentTransaction?.gnosis_reference_id,
        currentTransaction?.status,
    ])

    useEffect(() => {
        getTransactionInfo()
    }, [getTransactionInfo])

    const getTotalAmount = () => {
        const usd_amount_all = []
        if (currentTransaction?.status !== "REQUESTED") {
            currentTransaction.tokens.map((x, i) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
            const amount_total = usd_amount_all?.reduce((a, b) => a + b)
            return parseFloat(amount_total)?.toFixed(2)
        }
    }

    const onContributionCrossPress = () => {
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }

    const tokenInfo = () => (
        <div style={{ position: "relative", width: "100%" }}>
            <div className={styles.tokenDiv}>
                <div className={styles.tokenHeader}>
                    <div
                        style={{ color: "#ECFFB8" }}
                        className={textStyle.m_16}
                    >
                        {getTotalAmount()}$
                    </div>
                    <div
                        style={{ color: "#ECFFB870", marginLeft: "4px" }}
                        className={textStyle.m_16}
                    >
                        Total Payout
                    </div>
                </div>
                <div
                    style={{
                        background: "#FFFFFF12",
                        height: "1px",
                        marginTop: "0.75rem",
                        marginBottom: "0.75rem",
                    }}
                />
                {currentTransaction?.tokens?.map((x, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottom:
                                i !== currentTransaction?.tokens?.length - 1
                                    ? "1px solid #FFFFFF12"
                                    : null,
                            paddingBottom: "0.75rem",
                        }}
                        className={styles.tokenHeader}
                    >
                        <div
                            style={{ color: "#ECFFB8" }}
                            className={textStyle.m_16}
                        >
                            {x?.amount} {x.details?.symbol}
                        </div>
                        <div
                            style={{ color: "#ECFFB870", marginLeft: "4px" }}
                            className={textStyle.m_16}
                        >
                            {(x?.usd_amount * x.amount).toFixed(2)}$
                        </div>
                    </div>
                ))}
            </div>
            {currentTransaction?.feedback && (
                <div className={styles.feedBackContainer}>
                    <div className={textStyle.m_14}>
                        {currentTransaction?.feedback}
                    </div>
                </div>
            )}
        </div>
    )
    const getStatusProperty = () => {
        if (isAdmin) {
        } else {
            if (currentTransaction.status === "REQUESTED") {
                return {
                    title: "Waiting for approval",
                    color: "#FFC664",
                    dotColor: "#FFC664",
                }
            } else if (currentTransaction.status === "REJECTED") {
                return { title: "Rejected", color: "red", dotColor: "red" }
            } else if (currentTransaction.status === "APPROVED") {
                return {
                    title: "Approved",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            }
            if (
                currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID"
            ) {
                return {
                    title: "Approved",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            }
        }
    }

    const getSigningProperty = () => {
        if (isAdmin) {
        } else {
            if (currentTransaction.status === "REQUESTED") {
                return {
                    title: "Signing",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            } else if (currentTransaction.status === "REJECTED") {
                return { title: "Rejected", color: "red", dotColor: "red" }
            } else if (currentTransaction.status === "APPROVED") {
                return {
                    title: "Approved",
                    color: "#ECFFB8",
                    dotColor: "#FFFFFF40",
                }
            }
            if (
                currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID"
            ) {
                return {
                    title: "Approved",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            }
        }
    }

    const getExecutionProperty = () => {
        if (isAdmin) {
        } else {
            if (currentTransaction.status === "REQUESTED") {
                return {
                    title: "Signing",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            } else if (currentTransaction.status === "REJECTED") {
                return { title: "Rejected", color: "red", dotColor: "red" }
            } else if (currentTransaction.status === "APPROVED") {
                return {
                    title: "Signing",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            }
            if (
                currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID"
            ) {
                return {
                    title: "Signing",
                    color: "white",
                    dotColor: "#FFFFFF40",
                }
            }
        }
    }

    const getSignerName = (address) => {
        // //console.log(currentDao?.signers[0].public_address, address.toString())
        return currentDao?.signers?.filter(
            (x) => x.public_address === address
        )[0]?.metadata?.name
    }

    const renderSigners_admin = () => (
        <div
            style={{ marginBottom: "2.5rem" }}
            className={styles.signerContainer}
        >
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background: isAdmin
                                    ? "gray"
                                    : getStatusProperty()?.dotColor,
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    <div className={styles.headerTimeline_created}>
                        <div
                            style={{
                                color: isAdmin
                                    ? "white"
                                    : getStatusProperty()?.color,
                            }}
                            className={textStyle.m_16}
                        >
                            {isAdmin ? "Created" : getStatusProperty()?.title}
                        </div>
                    </div>
                </div>

                <div className={styles.singleHeaderContainer_signer}>
                    <div
                        style={{ height: "1.5rem" }}
                        className={styles.childrenTimeline_signer}
                    />
                </div>
            </div>

            {/* signing container */}
            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background: isAdmin
                                    ? "gray"
                                    : getSigningProperty()?.dotColor,
                                borderRadius: "6px",
                            }}
                        />
                    </div>
                    <div className={styles.headingDiv}>
                        <div className={styles.headerTimeline_signer}>
                            <div
                                style={{
                                    color: isAdmin
                                        ? "white"
                                        : !(
                                              safeInfo?.owners?.length ===
                                              txInfo?.confirmations?.length
                                          )
                                        ? getSigningProperty()?.color
                                        : "white",
                                }}
                                className={textStyle.m_16}
                            >
                                {"Signing"}
                            </div>
                            {currentTransaction?.status !== "REQUESTED" && (
                                <div
                                    style={{
                                        color: isAdmin
                                            ? "white"
                                            : !(
                                                  safeInfo?.owners?.length ===
                                                  txInfo?.confirmations?.length
                                              )
                                            ? currentTransaction?.status !==
                                              "REJECTED"
                                                ? "#ECFFB8"
                                                : "red"
                                            : "grey",
                                        marginLeft: "0.5rem",
                                    }}
                                    className={textStyle.m_16}
                                >
                                    {txInfo?.confirmations?.length} of{" "}
                                    {safeInfo?.owners?.length}
                                </div>
                            )}
                            {/* txInfo?isExecuted&& */}
                            {!signerOpen ? (
                                <AiFillCaretDown
                                    className={styles.icon}
                                    color="gray"
                                    size="16px"
                                    onClick={() => setSignerOpen(true)}
                                />
                            ) : (
                                <AiFillCaretUp
                                    className={styles.icon}
                                    color="white"
                                    size="16px"
                                    onClick={() => setSignerOpen(false)}
                                />
                            )}
                            {/* :null */}
                        </div>
                    </div>
                </div>

                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.childrenTimeline_signer}>
                        {signerOpen
                            ? txInfo?.confirmations?.map((item, index) => (
                                  <div
                                      className={styles.singleAddress}
                                      key={index}
                                  >
                                      <div
                                          style={{
                                              color:
                                                  currentTransaction?.status !==
                                                  "REJECTED"
                                                      ? "#ECFFB8"
                                                      : "red",
                                          }}
                                          className={`${textStyle.m_16}`}
                                      >
                                          {`${getSignerName(
                                              item?.owner
                                          )}  •   `}
                                      </div>
                                      <div
                                          style={{ color: "white" }}
                                          className={`${textStyle.m_16}`}
                                      >
                                          {`${item?.owner.slice(
                                              0,
                                              5
                                          )}...${item?.owner.slice(-3)}`}
                                      </div>
                                  </div>
                              ))
                            : null}
                    </div>
                </div>
            </div>

            {/* execution container */}

            <div className={styles.singleTimeline_signer}>
                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.connectorContainer}>
                        <div
                            style={{
                                height: "6px",
                                width: "6px",
                                background: isAdmin
                                    ? "gray"
                                    : safeInfo?.owners?.length ===
                                          txInfo?.confirmations?.length ||
                                      currentTransaction?.status === "REQUESTED"
                                    ? getExecutionProperty()?.dotColor
                                    : "#ECFFB8",
                                borderRadius: "6px",
                            }}
                        />
                    </div>
                    <div className={styles.headingDiv}>
                        <div className={styles.headerTimeline_signer}>
                            <div
                                style={{
                                    color: isAdmin
                                        ? "white"
                                        : safeInfo?.owners?.length ===
                                              txInfo?.confirmations?.length ||
                                          currentTransaction?.status ===
                                              "REQUESTED"
                                        ? getExecutionProperty().color
                                        : "#ECFFB8",
                                }}
                                className={textStyle.m_16}
                            >
                                Executed
                            </div>
                            {!executionOpen ? (
                                <AiFillCaretDown
                                    className={styles.icon}
                                    color="gray"
                                    size="16px"
                                    onClick={() => setExecutionOpen(true)}
                                />
                            ) : (
                                <AiFillCaretUp
                                    className={styles.icon}
                                    color="white"
                                    size="16px"
                                    onClick={() => setExecutionOpen(false)}
                                />
                            )}
                            {/* :null */}
                        </div>
                    </div>
                </div>

                {isAdmin && txInfo && txInfo?.isExecuted && executionOpen && (
                    <div className={styles.singleHeaderContainer_signer}>
                        <div
                            style={{ border: 0 }}
                            className={styles.childrenTimeline_signer}
                        >
                            <div
                                style={{
                                    color: "gray",
                                    textAlign: "start",
                                }}
                                className={`${textStyle.m_16}`}
                            >
                                <div
                                    style={{ color: "#FFFFFF80" }}
                                    className={textStyle.m_16}
                                >
                                    Executed by {txInfo?.executor?.slice(0, 5)}
                                    ...
                                    {txInfo?.executor?.slice(-3)}
                                </div>
                                <div
                                    style={{
                                        color: "#FFFFFF80",
                                        textDecoration: "underline",
                                    }}
                                    className={textStyle.m_16}
                                >
                                    view on etherscan
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    const claimed = useSelector((x) => x.contributor.claimed)

    // const isApprovedToken = () => {
    //     const token = unclaimed.filter(
    //         (x) => x.identifier === currentTransaction?.id.toString()
    //     )
    //     if (token.length > 0) {
    //         return { status: true, token }
    //     } else {
    //         return { status: false, token: [] }
    //     }
    // }
    const [load, setLoad] = useState(false)

    const onClaimEventCallback = async (event) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllClaimedBadges())
        await dispatch(getAllUnclaimedBadges())
        dispatch(setContributionDetail(null))
        dispatch(claimUpdate(currentTransaction?.id))
        dispatch(setClaimLoading(false, currentTransaction?.id))
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
    }
    const onErrorCallBack = () => {
        dispatch(setClaimLoading(false, currentTransaction?.id))
    }

    const claimBadges = async () => {
        if (!claim_loading.status) {
            dispatch(setClaimLoading(true, currentTransaction?.id))
            console.log(
                isApprovedToken(unclaimed, currentTransaction?.id).token[0].id
            )
            await processClaimBadgeToPocp(
                isApprovedToken(unclaimed, currentTransaction?.id).token[0].id,
                jwt,
                currentTransaction?.id,
                onClaimEventCallback,
                onErrorCallBack
            )
        }
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }

    const uploadApproveMetatoIpfs = async () => {
        const metaInfo = []
        const cid = []
        const to = []

        metaInfo.push({
            dao_name: currentDao?.name,
            contri_title: currentTransaction?.title,
            signer: address,
            claimer: currentTransaction?.requested_by?.public_address,
            date_of_approve: dayjs().format("D MMM YYYY"),
            id: currentTransaction?.id,
            dao_logo_url:
                currentDao?.logo_url ||
                "https://idreamleaguesoccerkits.com/wp-content/uploads/2017/12/barcelona-logo-300x300.png",
            work_type: currentTransaction?.stream.toString(),
        })
        cid.push(currentTransaction?.id)
        to.push(currentTransaction?.requested_by?.public_address)
        // })
        const response = await uplaodApproveMetaDataUpload(metaInfo)
        if (response) {
            return { status: true, cid, to }
        } else {
            return { status: false, cid: [], to: [] }
        }
    }

    const onApprovalSuccess = async (events) => {
        console.log(events)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
        // dispatch(
        //     afterApproval(
        //         events[events.length - 1].transactionHash,
        //         currentTransaction?.id
        //     )
        // )
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllUnclaimedBadges())
        await dispatch(getAllClaimedBadges())
        // await dispatch(getPayoutRequest())
        //await dispatch(set_payout_filter("PENDING", 1))
        onContributionCrossPress()
        setLoad(false)
    }

    const approvePOCPBadgeWithUrl = async () => {
        setLoad(true)
        console.log(parseInt(communityInfo[0].id))
        if (currentTransaction?.ipfs_url) {
            await processBadgeApprovalToPocp(
                parseInt(communityInfo[0].id),
                [currentTransaction?.requested_by?.public_address],
                [currentTransaction?.id?.toString()],
                [`https://ipfs.infura.io/ipfs/${currentTransaction?.ipfs_url}`],
                jwt,
                onApprovalSuccess,
                onApprovalSuccess
            )
        } else {
            const res = await uploadApproveMetatoIpfs()
            if (res.status) {
                const { cid, url, status } = await getIpfsUrl(
                    jwt,
                    currentDao?.uuid,
                    [currentTransaction?.id]
                )
                if (!status) {
                    const startTime = Date.now()
                    const interval = setInterval(async () => {
                        if (Date.now() - startTime > 30000) {
                            onContributionCrossPress()
                            message.error("Failed to get ipfs url")
                            setLoad(false)
                            clearInterval(interval)
                        }
                        const { cid, url, status } = await getIpfsUrl(
                            jwt,
                            currentDao?.uuid,
                            [currentTransaction?.id]
                        )
                        if (status) {
                            clearTimeout(interval)
                            if (cid?.length > 0) {
                                await processBadgeApprovalToPocp(
                                    parseInt(communityInfo[0].id),
                                    [
                                        currentTransaction?.requested_by
                                            ?.public_address,
                                    ],
                                    [currentTransaction?.id?.toString()],
                                    url,
                                    jwt,
                                    onApprovalSuccess,
                                    onApprovalSuccess
                                )
                            }
                        }
                    }, 2000)
                } else {
                    if (cid?.length > 0) {
                        await processBadgeApprovalToPocp(
                            parseInt(communityInfo[0].id),
                            [currentTransaction?.requested_by?.public_address],
                            [currentTransaction?.id?.toString()],
                            url,
                            jwt,
                            onApprovalSuccess,
                            onApprovalSuccess
                        )
                    }
                }
            }
        }
    }
    // console.log(
    //     "here",
    //     !checkClaimApprovedSuccess(all_approved_badge, currentTransaction?.id),
    //     txInfo?.isExecuted
    // )
    return (
        <div className={styles.container}>
            <img
                onClick={() => onContributionCrossPress()}
                src={cross}
                alt="cross"
                className={styles.cross}
            />
            {!(
                currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID" &&
                !isAdmin
            ) ||
            isAdmin ||
            currentTransaction?.isClaimed ? (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <span
                        className={`${textStyle.ub_23} ${styles.title}`}
                    >{`${getEmoji()}`}</span>
                    <span
                        ellipsis={{ rows: 2 }}
                        className={`${textStyle.ub_23} ${styles.title}`}
                    >
                        {`${currentTransaction?.title}`}
                    </span>
                    <div
                        className={`${textStyle.m_16} ${styles.ownerInfo}`}
                    >{`${
                        currentTransaction?.requested_by?.metadata?.name
                    } . (${address?.slice(0, 5)}...${address?.slice(
                        -3
                    )})`}</div>
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
                </div>
            ) : (
                <POCPBadge
                    dao_name={currentDao?.name}
                    doa_url={
                        currentDao?.logo_url
                            ? currentDao?.logo_url
                            : "https://s3uploader-s3uploadbucket-q66lac569ais.s3.amazonaws.com/1694805252.jpg"
                    }
                    date={`${dayjs().format("D MMM YYYY")}`}
                    title={currentTransaction?.title}
                    from={`${txInfo?.executor?.slice(
                        0,
                        5
                    )}...${txInfo?.executor?.slice(-3)}`}
                    to={`${currentTransaction?.requested_by?.public_address?.slice(
                        0,
                        5
                    )}...${currentTransaction?.requested_by?.public_address?.slice(
                        -3
                    )}`}
                />
            )}
            {currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID" && (
                    <div className={styles.divider} />
                )}
            {currentTransaction?.status !== "REQUESTED" && tokenInfo()}
            {!isAdmin &&
                currentTransaction?.status === "APPROVED" &&
                currentTransaction?.payout_status === "PAID" &&
                route !== "payments" &&
                !isAdmin && (
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div className={styles.divider} />

                        <span
                            ellipsis={{ rows: 2 }}
                            className={`${textStyle.m_16} ${styles.title}`}
                        >
                            {`${currentTransaction?.title}`}
                        </span>
                        <div
                            className={`${textStyle.m_16} ${styles.ownerInfo}`}
                        >{`${
                            currentTransaction?.requested_by?.metadata?.name
                        } . (${address.slice(0, 5)}...${address.slice(
                            -3
                        )})`}</div>
                        <div
                            className={`${textStyle.m_16} ${styles.timeInfo}`}
                        >{`${"Design  • "} ${
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
                    </div>
                )}
            <div className={styles.divider} />
            {renderSigners_admin()}
            {role === "ADMIN" &&
                !checkClaimApprovedSuccess(
                    all_approved_badge,
                    currentTransaction?.id
                ) &&
                txInfo?.isExecuted &&
                txInfo?.value !== "0" &&
                currentDao?.tx_hash && (
                    <div
                        style={{ justifyContent: "center" }}
                        className={styles.claim_container}
                    >
                        <div
                            onClick={async () =>
                                !load && (await approvePOCPBadgeWithUrl())
                            }
                            className={styles.payNow}
                        >
                            <div className={`${textStyle.ub_16}`}>
                                {!load ? "Approve Badge" : "Approving...."}
                            </div>
                        </div>
                    </div>
                )}
            {role === "ADMIN" &&
                currentTransaction?.status === "APPROVED" &&
                (currentTransaction?.payout_status === null ||
                    currentTransaction?.payout_status === "REQUESTED") && (
                    <div
                        style={{ justifyContent: "center" }}
                        className={styles.claim_container}
                    >
                        <div
                            onClick={async () => await onRouteChange()}
                            className={styles.payNow}
                        >
                            <div className={`${textStyle.ub_16}`}>
                                View Transaction
                            </div>
                        </div>
                    </div>
                )}
            {isApprovedToken(unclaimed, currentTransaction?.id).status &&
                !isAdmin &&
                currentTransaction?.status !== "REQUESTED" &&
                currentTransaction?.status !== "REJECTED" &&
                txInfo?.isExecuted && (
                    <div className={styles.claim_container}>
                        <div className={styles.deletContainer}>
                            <img
                                src={delete_icon}
                                alt="cross"
                                className={styles.delete}
                            />
                        </div>
                        <div
                            onClick={async () => await claimBadges()}
                            className={styles.payNow}
                        >
                            <div className={`${textStyle.ub_16}`}>
                                {claim_loading.status &&
                                claim_loading?.id === currentTransaction?.id
                                    ? "Claiming...."
                                    : "Claim Badge"}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}

export default ContributionSideCard

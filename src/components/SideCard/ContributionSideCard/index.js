import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography } from "antd"
import cross from "../../../assets/Icons/cross_white.svg"
import delete_icon from "../../../assets/Icons/delete_icon.svg"
import styles from "./style.module.css"
import textStyle from "../../../commonStyles/textType/styles.module.css"
import {
    rejectContriRequest,
    setTransaction,
} from "../../../store/actions/transaction-action"
import {
    setClaimLoading,
    setContributionDetail,
} from "../../../store/actions/contibutor-action"
import POCPBadge from "../../POCPBadge"
import SafeServiceClient from "@gnosis.pm/safe-service-client"
import moment from "moment"
import { approvePOCPBadge, claimPOCPBadges } from "../../../utils/POCPutils"
import { getAuthToken } from "../../../store/actions/auth-action"
import {
    relayFunction,
    updatePocpApproval,
    updatePocpClaim,
} from "../../../utils/relayFunctions"
import { ethers } from "ethers"
import { web3 } from "../../../constant/web3"
import {
    claimUpdate,
    getContriRequest,
    syncAllBadges,
} from "../../../store/actions/dao-action"
import { setPayoutToast } from "../../../store/actions/toast-action"

const serviceClient = new SafeServiceClient(
    "https://safe-transaction.rinkeby.gnosis.io/"
)

const ContributionSideCard = ({ signer, isAdmin = true }) => {
    const currentTransaction = useSelector(
        isAdmin
            ? (x) => x.transaction.currentTransaction
            : (x) => x.contributor.contribution_detail
    )
    const role = useSelector((x) => x.dao.role)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const address = currentTransaction?.requested_by?.public_address
    const signer_address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const [txInfo, setTxInfo] = useState([])
    const [safeInfo, setSafeInfo] = useState()
    const dispatch = useDispatch()
    const pocp_dao_info = useSelector((x) => x.dao.pocp_dao_info)
    const claim_loading = useSelector((x) => x.contributor.claim_loading)
    const community_id = pocp_dao_info.filter(
        (x) => x.txhash === currentDao?.tx_hash
    )
    const getEmoji = () => {
        if (currentTransaction?.stream === "DESIGN") {
            return "🎨"
        } else {
            return "🎨"
        }
    }

    const getApproveCheck = async () => {
        if (currentTransaction?.approved_tx) {
            const customHttpProvider = new ethers.providers.JsonRpcProvider(
                web3.infura
            )
            const reciept = await customHttpProvider.getTransactionReceipt(
                currentTransaction?.approved_tx
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
            // console.log('here', currentTransaction)
            tx = await serviceClient.getTransaction(
                currentTransaction?.gnosis_reference_id
            )
        }
        const safeInfo = await serviceClient.getSafeInfo(
            currentDao?.safe_public_address
        )
        // console.log('transaction', currentTransaction?.isClaimed)
        const approval = await getApproveCheck()
        const claim_status = await getClaimCheck()
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
        <div className={styles.tokenDiv}>
            <div className={styles.tokenHeader}>
                <div style={{ color: "#ECFFB8" }} className={textStyle.m_16}>
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
        // console.log(currentDao?.signers[0].public_address, address.toString())
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
                        {/* <div style={{color:'gray'}} className={textStyle.m_16}>{moment(currentPayment?.gnosis?.submissionDate).startOf('hour').fromNow()}</div> */}
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
                    </div>
                </div>

                <div className={styles.singleHeaderContainer_signer}>
                    <div className={styles.childrenTimeline_signer}>
                        {currentTransaction?.status !== "REQUESTED" &&
                            !(
                                safeInfo?.owners?.length ===
                                txInfo?.confirmations?.length
                            ) &&
                            txInfo?.confirmations?.map((item, index) => (
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
                                        {`${getSignerName(item?.owner)}  •   `}
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
                            ))}
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
                                    : !(
                                          safeInfo?.owners?.length ===
                                          txInfo?.confirmations?.length
                                      ) ||
                                      currentTransaction?.status === "REQUESTED"
                                    ? getExecutionProperty()?.dotColor
                                    : "#ECFFB8",
                                borderRadius: "6px",
                            }}
                        />
                    </div>

                    <div className={styles.headerTimeline_signer}>
                        <div
                            style={{
                                color: isAdmin
                                    ? "white"
                                    : !(
                                          safeInfo?.owners?.length ===
                                          txInfo?.confirmations?.length
                                      ) ||
                                      currentTransaction?.status === "REQUESTED"
                                    ? getExecutionProperty().color
                                    : "#ECFFB8",
                            }}
                            className={textStyle.m_16}
                        >
                            Executed
                        </div>
                    </div>
                </div>

                {isAdmin && txInfo && txInfo?.isExecuted && (
                    <div className={styles.singleHeaderContainer_signer}>
                        <div
                            style={{ border: 0 }}
                            className={styles.childrenTimeline_signer}
                        >
                            <div
                                style={{ color: "gray", textAlign: "start" }}
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

    const unclaimed = useSelector((x) => x.contributor.unclaimed)
    const claimed = useSelector((x) => x.contributor.claimed)

    const isApprovedToken = () => {
        const token = unclaimed.filter(
            (x) => x.identifier === currentTransaction?.id.toString()
        )
        if (token.length > 0) {
            return { status: true, token }
        } else {
            return { status: false, token: [] }
        }
    }
    const [load, setLoad] = useState(false)

    const claimBadges = async () => {
        if (!claim_loading.status) {
            setLoad(true)
            dispatch(setClaimLoading(true, currentTransaction?.id))
            try {
                const web3Provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                await web3Provider.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: web3.chainid.polygon }],
                })
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = provider.getSigner()
                const { data, signature } = await claimPOCPBadges(
                    signer,
                    address,
                    [parseInt(isApprovedToken().token[0].id)]
                )
                const token = await dispatch(getAuthToken())
                const tx_hash = await relayFunction(token, 3, data, signature)
                if (tx_hash) {
                    await updatePocpClaim(jwt, tx_hash, [
                        currentTransaction?.id,
                    ])
                    const startTime = Date.now()
                    const interval = setInterval(async () => {
                        if (Date.now() - startTime > 30000) {
                            clearInterval(interval)
                            dispatch(
                                setClaimLoading(false, currentTransaction?.id)
                            )
                        }
                        const customHttpProvider =
                            new ethers.providers.JsonRpcProvider(web3.infura)
                        const reciept =
                            await customHttpProvider.getTransactionReceipt(
                                tx_hash
                            )
                        if (reciept?.status) {
                            clearTimeout(interval)
                            dispatch(
                                setClaimLoading(false, currentTransaction?.id)
                            )
                            dispatch(claimUpdate(currentTransaction?.id))
                            onContributionCrossPress()
                            await web3Provider.provider.request({
                                method: "wallet_switchEthereumChain",
                                params: [{ chainId: web3.chainid.rinkeby }],
                            })
                        }
                    }, 2000)
                } else {
                    await web3Provider.provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: web3.chainid.rinkeby }],
                    })
                    dispatch(setClaimLoading(false, currentTransaction?.id))
                }
            } catch (error) {
                // console.log(error.toString())
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                await provider.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: web3.chainid.rinkeby }],
                })
                dispatch(setClaimLoading(false, currentTransaction?.id))
            }
        }
    }

    const approvePOCPBadgeWithUrl = async () => {
        setLoad(true)
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        try {
            await web3Provider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.chainid.polygon }],
            })
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const { data, signature } = await approvePOCPBadge(
                signer,
                parseInt(community_id[0].id),
                signer_address,
                [currentTransaction?.requested_by?.public_address],
                [currentTransaction?.id?.toString()],
                [`https://ipfs.infura.io/ipfs/${currentTransaction?.ipfs_url}`]
            )
            const token = await dispatch(getAuthToken())
            const tx_hash = await relayFunction(token, 5, data, signature)
            if (tx_hash) {
                await updatePocpApproval(jwt, tx_hash, [currentTransaction?.id])
                const startTime = Date.now()
                const interval = setInterval(async () => {
                    if (Date.now() - startTime > 20000) {
                        clearInterval(interval)
                        // console.log("failed to get confirmation")
                    }
                    // console.log('tx_hash', tx_hash)
                    const customHttpProvider =
                        new ethers.providers.JsonRpcProvider(web3.infura)
                    const reciept =
                        await customHttpProvider.getTransactionReceipt(tx_hash)
                    if (reciept?.status) {
                        clearTimeout(interval)
                        setPayoutToast("APPROVED_BADGE")
                        // console.log('successfully registered')
                        await provider.provider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: web3.chainid.rinkeby }],
                        })
                        setLoad(false)
                    }
                    // console.log('again....')
                }, 2000)
            } else {
                // console.log('error in fetching tx hash....')
                await provider.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: web3.chainid.rinkeby }],
                })
                onContributionCrossPress()
                setLoad(false)
            }
        } catch (error) {
            // console.log(error.toString())
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.chainid.rinkeby }],
            })
            onContributionCrossPress()
            setLoad(false)
        }
        await dispatch(syncAllBadges())
        await dispatch(getContriRequest())
        onContributionCrossPress()
    }
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
                    } . (${address.slice(0, 5)}...${address.slice(-3)})`}</div>
                    <div
                        className={`${textStyle.m_16} ${styles.timeInfo}`}
                    >{`${currentTransaction?.stream.toLowerCase()} ${
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
                        {/* {currentTransaction?} */}
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
                    date={`${moment().format("D MMM YYYY")}`}
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
            {/* {currentTransaction?.status==='APPROVED'&&currentTransaction?.payout_status==='PAID'&&
            <div style={{width:'100%', display:'flex', flexDirection:'column'}}>
              <span
                  className={`${textStyle.ub_23} ${styles.title}`}
              >{`${getEmoji()}`}</span>
              <span ellipsis={{rows:2}} className={`${textStyle.ub_23} ${styles.title}`}>
              {`${currentTransaction?.title}`}
              </span>
              <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${currentTransaction?.requested_by?.metadata?.name} . (${address.slice(0,5)}...${address.slice(-3)})`}</div>
              <div className={`${textStyle.m_16} ${styles.timeInfo}`}>{`${'Design  • '} ${currentTransaction?.time_spent} hrs`}</div>
            </div>} */}
            <div className={styles.divider} />
            {renderSigners_admin()}
            {role === "ADMIN" &&
                !approvedBadge &&
                txInfo?.isExecuted &&
                currentTransaction?.ipfs_url && (
                    <div
                        style={{ justifyContent: "center" }}
                        className={styles.claim_container}
                    >
                        <div
                            onClick={async () =>
                                await approvePOCPBadgeWithUrl()
                            }
                            className={styles.payNow}
                        >
                            <div className={`${textStyle.ub_16}`}>
                                {!load ? "Approve Badge" : "Approving...."}
                            </div>
                        </div>
                    </div>
                )}
            {!claimBadge &&
                isApprovedToken().status &&
                !currentTransaction?.isClaimed &&
                !isAdmin &&
                currentTransaction?.status !== "REQUESTED" &&
                currentTransaction?.status !== "REJECTED" &&
                txInfo?.isExecuted && (
                    <div className={styles.claim_container}>
                        <div
                            onClick={async () =>
                                await dispatch(
                                    rejectContriRequest(currentTransaction?.id)
                                )
                            }
                            className={styles.deletContainer}
                        >
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

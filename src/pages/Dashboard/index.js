import { message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { signout } from "../../store/actions/auth-action"

import {
    getAllApprovedBadges,
    getAllClaimedBadges,
    getAllDaowithAddress,
    getAllUnclaimedBadges,
    getCommunityId,
    getContributorOverview,
    getContriRequest,
    getPayoutRequest,
    gnosisDetailsofDao,
    refreshContributionList,
    set_active_nonce,
    set_payout_filter,
    syncTxDataWithGnosis,
} from "../../store/actions/dao-action"
import DashboardLayout from "../../views/DashboardLayout"
import styles from "./style.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import ContributionRequestModal from "../../components/Modal/ContributionRequest"
import { ethers } from "ethers"
import DashboardSearchTab from "../../components/DashboardSearchTab"
import ContributionCard from "../../components/ContributionCard"
import { useSafeSdk } from "../../hooks"

import PaymentCheckoutModal from "../../components/Modal/PaymentCheckoutModal"
import PaymentCard from "../../components/PaymentCard"
import {
    getPendingTransaction,
    setEthPrice,
    setPayment,
    setRejectModal,
    setTransaction,
} from "../../store/actions/transaction-action"
import {
    setLoadingState,
    setPayoutToast,
} from "../../store/actions/toast-action"
import UniversalPaymentModal from "../../components/Modal/UniversalPaymentModal"
import plus_black from "../../assets/Icons/plus_black.svg"
import plus_gray from "../../assets/Icons/plus_gray.svg"
import { convertTokentoUsd } from "../../utils/conversion"
import RejectPayment from "../../components/Modal/RejectPayment"
import BadgeItem from "../../components/BadgeItem"
import { setContributionDetail } from "../../store/actions/contibutor-action"
import dashboardLoader from "../../assets/lottie/dashboardLoader.json"
import Lottie from "react-lottie"
import ApproveCheckoutButton from "../../components/ApproveCheckoutButton"
import TreasuryDetails from "../../components/TreasuryDetails"
import DashboardSideCard from "../../components/SideCard/DashboardSideCard"
import SettingsScreen from "../../components/SettingsScreen"
import magic_button from "../../assets/Icons/magic_button.svg"

export default function Dashboard() {
    const [tab, setTab] = useState("contributions")
    const [currentPage, setCurrentPage] = useState("request")
    const [uniPayHover, setUniPayHover] = useState(false)

    const payoutToast = useSelector((x) => x.toast.payout)
    const active_payout_notification = useSelector(
        (x) => x.dao.active_payout_notification
    )
    const accountMode = useSelector((x) => x.dao.account_mode)
    const account_index = useSelector((x) => x.dao.account_index)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentDao = useSelector((x) => x.dao.currentDao)
    const community_id = useSelector((x) => x.dao.communityInfo)
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const role = useSelector((x) => x.dao.role)
    const approve_contri = useSelector(
        (x) => x.transaction.approvedContriRequest
    )
    const pending_txs = useSelector((x) => x.transaction.pendingTransaction)

    const [modalContri, setModalContri] = useState(false)
    const [modalPayment, setModalPayment] = useState(false)
    const [modalUniPayment, setModalUniPayment] = useState(false)

    const rejectModal = useSelector((x) => x.transaction.rejectModal)

    const contribution_request = useSelector((x) => x.dao.contribution_request)
    const payout_request = useSelector((x) => x.dao.payout_filter)
    const loadingState = useSelector((x) => x.toast.loading_state)
    const approvedBadges = useSelector((x) => x.dao.approvedBadges)
    // gnosis setup
    const [signer, setSigner] = useState()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [showSettings, setShowSettings] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: dashboardLoader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
        },
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (payoutToast) {
                dispatch(setPayoutToast(false))
            }
        }, 3000)
        return () => {
            clearInterval(interval)
        }
    }, [dispatch, payoutToast])

    const setProvider = async () => {
        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        )
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        setSigner(signer)
    }

    useEffect(() => {
        setProvider()
    }, [])

    async function copyTextToClipboard() {
        if ("clipboard" in navigator) {
            message.success("invite link copied successfully!")
            return await navigator.clipboard.writeText(
                `${
                    window.location.origin
                }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                    currentDao?.uuid
                }`
            )
        } else {
            return document.execCommand(
                "copy",
                true,
                `${
                    window.location.origin
                }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                    currentDao?.uuid
                }`
            )
        }
    }

    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener("popstate", () => {
            if (address && jwt) {
                window.history.pushState(
                    null,
                    document.title,
                    window.location.href
                )
            }
        })
    }, [address, jwt])

    async function onInit() {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const account = accounts[0]
        return account
    }

    const adminContributionFetch = async () => {
        await dispatch(getContriRequest())
        dispatch(setLoadingState(false))
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        await dispatch(getPayoutRequest())
        dispatch(set_payout_filter("PENDING"))
    }

    const contributorFetch = async () => {
        await dispatch(getContriRequest())
        dispatch(setLoadingState(false))
        await dispatch(getAllClaimedBadges())
        await dispatch(getAllUnclaimedBadges())
        dispatch(getContributorOverview())
    }

    const initialLoad = useCallback(async () => {
        dispatch(refreshContributionList())
        const account = await onInit()
        if (address === ethers.utils.getAddress(account)) {
            dispatch(setLoadingState(true))
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const chainId = await signer.getChainId()
            const accountRole = await dispatch(getAllDaowithAddress(chainId))
            await dispatch(getCommunityId())
            await dispatch(gnosisDetailsofDao())
            await dispatch(getAllApprovedBadges())

            if (accountRole === "ADMIN") {
                await adminContributionFetch()
            } else {
                await contributorFetch()
            }
        } else {
            dispatch(setLoadingState(false))
            message.info("Token expired")
            dispatch(signout())
            navigate("/")
        }
        dispatch(setLoadingState(false))
    }, [address, dispatch, navigate, role, safeSdk, signer])

    const contributionAdminFetchAccountSwitch = async () => {
        dispatch(setLoadingState(true))
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        await dispatch(getContriRequest())
        dispatch(setLoadingState(false))
    }

    const paymentsAdminFetchAccountSwitch = async () => {
        dispatch(setLoadingState(true))
        await dispatch(getPayoutRequest())
        await dispatch(set_payout_filter("PENDING"))
        await dispatch(getPendingTransaction())
        await dispatch(syncTxDataWithGnosis())
        dispatch(setLoadingState(false))
    }

    const accountSwitch = useCallback(async () => {
        dispatch(setLoadingState(true))
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const chainId = await signer.getChainId()
        const accountRole = await dispatch(getAllDaowithAddress(chainId))
        await dispatch(getCommunityId())
        dispatch(setLoadingState(false))
        if (accountRole === "ADMIN") {
            await contributionAdminFetchAccountSwitch()
            if (tab === "payments") {
                await paymentsAdminFetchAccountSwitch()
            }
        } else {
            await contributorFetch()
        }
        dispatch(setLoadingState(false))
    }, [dispatch, safeSdk, tab])

    useEffect(() => {
        if (!modalPayment) {
            if (role === accountMode && account_index === 0) {
                initialLoad()
            } else {
                accountSwitch()
            }
        }
    }, [])

    useEffect(() => {
        preventGoingBack()
    }, [preventGoingBack])

    const onRouteChange = async (route) => {
        dispatch(refreshContributionList())
        setTab(route)
        dispatch(setLoadingState(true))
        await dispatch(getCommunityId())
        if (role === "ADMIN") {
            if (safeSdk) {
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter("PENDING"))
            if (route !== "payments") {
                dispatch(getContriRequest())
                dispatch(setLoadingState(false))
                await dispatch(getAllApprovedBadges())
            }
        } else {
            await contributorFetch()
        }
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setLoadingState(false))
    }

    const onUniModalOpen = async () => {
        if (!loadingState) {
            const ethPrice = await convertTokentoUsd("ETH")
            if (ethPrice) {
                dispatch(setEthPrice(ethPrice))
                setModalUniPayment(true)
            }
        }
    }

    const renderTab = () => (
        <div className={styles.tabContainer}>
            <div className={styles.routeContainer}>
                <div
                    onClick={async () => await onRouteChange("contributions")}
                    className={
                        tab === "contributions"
                            ? `${styles.selected} ${textStyles.ub_23}`
                            : `${styles.selectionTab} ${textStyles.ub_23}`
                    }
                >
                    Contributions
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                        onClick={async () => await onRouteChange("payments")}
                        style={{ marginLeft: "2rem" }}
                        className={
                            tab === "payments"
                                ? `${styles.selected} ${textStyles.ub_23}`
                                : `${styles.selectionTab} ${textStyles.ub_23}`
                        }
                    >
                        {role === "ADMIN" ? "Payments" : "Badges"}
                    </div>
                    {role === "ADMIN" && active_payout_notification && (
                        <div
                            style={{
                                background: "#FF6666",
                                height: 10,
                                width: 10,
                                borderRadius: 10,
                            }}
                        />
                    )}
                </div>
            </div>
            <div>
                {role === "ADMIN" && (
                    <div
                        onMouseEnter={() => setUniPayHover(true)}
                        onMouseLeave={() => setUniPayHover(false)}
                        style={{ background: modalUniPayment ? "white" : null }}
                        onClick={
                            role === "ADMIN"
                                ? async () => await onUniModalOpen()
                                : () => setModalContri(true)
                        }
                        className={styles.addPaymentContainer}
                    >
                        <img
                            src={
                                uniPayHover || modalUniPayment
                                    ? plus_black
                                    : plus_gray
                            }
                            alt="plus"
                        />
                    </div>
                )}

                {modalUniPayment && (
                    <UniversalPaymentModal
                        signer={signer}
                        onClose={() => setModalUniPayment(false)}
                    />
                )}
            </div>
        </div>
    )

    const renderEmptyScreen = () => (
        <div className={styles.emptyDiv}>
            <div className={styles.heading}>No contribution requests</div>
            {role !== "ADMIN" ? (
                <div className={`${styles.heading} ${styles.greyedHeading}`}>
                    Initiate a contribution
                    <br /> request to get paid
                </div>
            ) : (
                <div className={`${styles.heading} ${styles.greyedHeading}`}>
                    Share link to onboard
                    <br /> contributors
                </div>
            )}
            {role === "ADMIN" ? (
                <button
                    onClick={() => copyTextToClipboard()}
                    className={styles.button}
                >
                    <div>Copy Invite Link</div>
                </button>
            ) : (
                <button
                    onClick={() => setModalContri(true)}
                    className={styles.button}
                >
                    <div>Create Contribution Request</div>
                </button>
            )}
        </div>
    )

    const renderLoadingScreen = () => (
        <div className={styles.emptyDiv}>
            <Lottie
                options={defaultOptions}
                style={{ height: "100%", width: "30%" }}
                className={styles.layoutImage}
            />
        </div>
    )

    const onPaymentModal = () => {
        setProvider()
        setModalPayment(true)
    }

    const approvedContriRequest = useSelector(
        (x) => x.transaction.approvedContriRequest
    )

    const getTotalAmount = () => {
        const usd_amount_all = []

        approvedContriRequest.forEach((item) => {
            item.payout.forEach((x) => {
                usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount))
            })
        })

        const amount_total = usd_amount_all.reduce((a, b) => a + b)
        return parseFloat(amount_total).toFixed(2)
    }

    const payoutData = useSelector((x) => x.toast.payout_data)
    const payoutToastInfo = () => {
        if (payoutToast === "EXECUTED") {
            return {
                title: `Payment Executed  •  ${payoutData?.value}$`,
                background: "#1D7F60",
            }
        } else if (payoutToast === "SIGNED") {
            return {
                title: `Payment Signed  •  ${payoutData?.value}$`,
                background: "#4D4D4D",
            }
        } else if (payoutToast === "ACCEPTED_CONTRI") {
            return {
                title: `${payoutData?.item} Request approved  •  ${payoutData?.value}$`,
                background: "#4D4D4D",
            }
        } else if (payoutToast === "REJECTED") {
            return {
                title: `Payment rejected  •  ${600}$`,
                background: "#4D4D4D",
            }
        } else if (payoutToast === "APPROVED_BADGE") {
            return { title: `Approved Badge`, background: "#4D4D4D" }
        } else if (payoutToast === "CLAIMED_BADGE") {
            return { title: `Claimed Badge`, background: "#4D4D4D" }
        }
    }

    const transactionToast = () => (
        <div
            style={{ background: payoutToastInfo().background }}
            className={styles.toastContainer}
        >
            <div className={styles.toastLeft}>
                <div style={{ color: "white" }} className={textStyles.m_16}>
                    {payoutToastInfo().title}
                </div>
            </div>
            <div className={styles.toastRight}>
                <div style={{ color: "white" }} className={textStyles.ub_16}>
                    Details
                </div>
            </div>
        </div>
    )

    const renderContribution = () =>
        contribution_request.length > 0 ? (
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {contribution_request.map((item, index) => (
                        <ContributionCard
                            // community_id={community_id[0]?.id}
                            // signer={signer}
                            item={item}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        ) : (
            renderEmptyScreen()
        )

    const renderContributorContribution = () =>
        contribution_request.length > 0 ? (
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {/* {contribution_request.map((item, index) => (
                        <ContributionCard
                            // community_id={community_id[0]?.id}
                            // signer={signer}
                            item={item}
                            key={index}
                        />
                    ))} */}
                    <div className={styles.newMembershipBadge}>
                        <img src="https://i.imgur.com/M8ycfjL.png" alt="" />
                        <div className={styles.congratsAndClaim}>
                            <div className={styles.congratulationsText}>
                                Congratulations
                            </div>
                            <div className={styles.badgeName}>
                                You received Pony Pioneer badge
                            </div>
                            <div>
                                <button className={styles.claimBadgeBtn}>
                                    Claim Badge{" "}
                                    <img src={magic_button} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            renderEmptyScreen()
        )
    const dataSource = useSelector((x) => x.dao.all_claimed_badge)
    const renderBadges = () => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: 0,
                overflowY: "auto",
                marginBottom: "2rem",
                width: "100%",
            }}
        >
            {/* {dataSource.length > 0 */}
            {dataSource.map((x, i) => (
                <BadgeItem item={x} key={i} />
            ))}
        </div>
    )
    const renderEmptyBadgesScreen = () => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: 0,
                overflowY: "auto",
                marginBottom: "2rem",
            }}
        >
            <div className={styles.emptyBadge}>
                <div className={`${textStyles.m_16} ${styles.emptySlot}`}>
                    Empty Slot
                </div>
            </div>
            <div className={styles.emptyBadge}>
                <div className={`${textStyles.m_16} ${styles.emptySlot}`}>
                    Empty Slot
                </div>
            </div>
            <div className={styles.emptyBadge}>
                <div className={`${textStyles.m_16} ${styles.emptySlot}`}>
                    Empty Slot
                </div>
            </div>
        </div>
    )
    const renderPayment = () =>
        payout_request.length > 0 ? (
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {/* {nonce !== payout_request[0]?.gnosis?.nonce && (
                        <GnosisExternalPayment />
                    )} */}
                    {payout_request.map((item, index) => (
                        <PaymentCard
                            gnosis={pending_txs}
                            signer={signer}
                            item={item}
                            key={index}
                        />
                    ))}
                </div>
            </div>
        ) : (
            renderEmptyScreen()
        )

    const adminScreen = () =>
        tab === "contributions" ? renderContribution() : renderPayment()
    const contributorScreen = () =>
        tab === "contributions"
            ? renderContributorContribution()
            : dataSource.length > 0
            ? renderBadges()
            : renderEmptyBadgesScreen()

    const setModalBackDropFunc = (x) => {
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }
    return (
        <DashboardLayout
            onRouteChange={async () => await onRouteChange("payments")}
            modalBackdrop={setModalBackDropFunc}
            signer={signer}
            route={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setShowSettings={setShowSettings}
        >
            <div className={styles.layoutContainer}>
                {showSettings ? (
                    <SettingsScreen />
                ) : (
                    <>
                        <div className={styles.children}>
                            {currentPage === "request" ? (
                                <div className={styles.dashView}>
                                    {(modalContri ||
                                        modalPayment ||
                                        modalUniPayment) && (
                                        <div
                                            onClick={() => {
                                                setModalContri(false)
                                                setModalPayment(false)
                                                setModalUniPayment(false)
                                            }}
                                            style={{
                                                position: "absolute",
                                                background: "#7A7A7A",
                                                opacity: 0.2,
                                                bottom: 0,
                                                right: 0,
                                                top: 0,
                                                left: 0,
                                            }}
                                        />
                                    )}
                                    {renderTab()}
                                    {<DashboardSearchTab route={tab} />}
                                    {loadingState
                                        ? renderLoadingScreen()
                                        : role === "ADMIN"
                                        ? adminScreen()
                                        : contributorScreen()}
                                    {rejectModal && (
                                        <RejectPayment
                                            signer={signer}
                                            onClose={() =>
                                                dispatch(setRejectModal(false))
                                            }
                                        />
                                    )}
                                    {(approve_contri.length > 0 ||
                                        approvedBadges.length > 0) &&
                                        tab === "contributions" &&
                                        role === "ADMIN" &&
                                        !modalPayment && (
                                            <ApproveCheckoutButton
                                                onModalOpen={() =>
                                                    onPaymentModal()
                                                }
                                                totalPaymentAmount={
                                                    approve_contri.length !== 0
                                                        ? getTotalAmount()
                                                        : 0
                                                }
                                                paymentApproved={approve_contri}
                                                badgeApproved={approvedBadges}
                                            />
                                        )}
                                    {payoutToast && transactionToast()}
                                    {modalContri && (
                                        <ContributionRequestModal
                                            setVisibility={setModalContri}
                                        />
                                    )}
                                    {modalPayment &&
                                        (approve_contri.length > 0 ||
                                            approvedBadges.length > 0) && (
                                            <PaymentCheckoutModal
                                                signer={signer}
                                                onClose={() =>
                                                    setModalPayment(false)
                                                }
                                            />
                                        )}
                                </div>
                            ) : (
                                <TreasuryDetails />
                            )}
                        </div>
                        <div className={styles.adminStats}>
                            <DashboardSideCard
                                onRouteChange={async () =>
                                    await onRouteChange("payments")
                                }
                                signer={signer}
                                route={tab}
                                currentPage={currentPage}
                            />
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}

import { message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { signout } from "../../store/actions/auth-action"
import {
    getAllDaowithAddress,
    getPayoutRequest,
    gnosisDetailsofDao,
    setContractAddress,
    set_active_nonce,
} from "../../store/actions/dao-action"
import {
    getAllMembershipBadgesList,
    getMembershipVoucher,
    getAllMembershipBadgesForAddress,
    getAllDaoMembers,
} from "../../store/actions/membership-action"
import DashboardLayout from "../../views/DashboardLayout"
import styles from "./style.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import ContributionRequestModal from "../../components/Modal/ContributionRequest"
import ContributionCard from "../../components/ContributionCard"
import { useSafeSdk, usePrevious } from "../../hooks"

import PaymentCheckoutModal from "../../components/Modal/PaymentCheckoutModal"
import PaymentCard from "../../components/PaymentCard"
import {
    setEthPrice,
    setPayment,
    setRejectModal,
    setTransaction,
} from "../../store/actions/transaction-action"
import {
    setLoadingState,
    setPayoutToast,
} from "../../store/actions/toast-action"
import RejectPayment from "../../components/Modal/RejectPayment"
import BadgeItem from "../../components/BadgeItem"
import {
    getContributionAsAdmin,
    getContributionAsContributorApproved,
    getContributionSchema,
    setContributionDetail,
} from "../../store/actions/contibutor-action"
import dashboardLoader from "../../assets/lottie/dashboardLoader.json"
import Lottie from "react-lottie"
import ApproveCheckoutButton from "../../components/ApproveCheckoutButton"
import TreasuryDetails from "../../components/TreasuryDetails"
import DashboardSideCard from "../../components/SideCard/DashboardSideCard"
import SettingsScreen from "../../components/SettingsScreen"
import BadgesScreen from "../../components/BadgesScreen"
import ContributorContributionScreen from "../../components/ContributorContributionScreen"
import { initPOCP } from "../../utils/POCPServiceSdk"
import ContributorBadgeScreen from "../../components/ContributorBadgeScreen"
import { useSigner, useProvider, useAccount, useDisconnect } from "wagmi"
import DashboardSearchTab from "../../components/DashboardSearchTab"
import UniversalPaymentModal from "../../components/Modal/UniversalPaymentModal"
import plus_black from "../../assets/Icons/plus_black.svg"
import plus_gray from "../../assets/Icons/plus_gray.svg"

export default function Dashboard() {
    const [tab, setTab] = useState("contributions")
    const currentDao = useSelector((x) => x.dao.currentDao)
    const payoutToast = useSelector((x) => x.toast.payout)
    const active_payout_notification = useSelector(
        (x) => x.dao.active_payout_notification
    )
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const contributionPending = useSelector(
        (x) => x.contributor.contributionForAdmin
    )

    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const role = useSelector((x) => x.dao.role)
    const [currentPage, setCurrentPage] = useState("badges")
    const approve_contri = useSelector(
        (x) => x.transaction.approvedContriRequest
    )
    const pending_txs = useSelector((x) => x.transaction.pendingTransaction)

    const [modalContri, setModalContri] = useState(false)
    const [modalPayment, setModalPayment] = useState(false)
    const [modalUniPayment, setModalUniPayment] = useState(false)

    const rejectModal = useSelector((x) => x.transaction.rejectModal)

    const contribution_request = useSelector((x) => x.dao.contribution_request)
    const payout_request = useSelector((x) => x.dao.payout_request)
    const loadingState = useSelector((x) => x.toast.loading_state)
    const approvedBadges = useSelector((x) => x.dao.approvedBadges)

    const { data: signer } = useSigner()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [showSettings, setShowSettings] = useState(false)
    const provider = useProvider()
    const prevSigner = usePrevious(signer)
    const { isDisconnected } = useAccount()
    const { disconnect } = useDisconnect()
    const [uniPayHover, setUniPayHover] = useState(false)

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

    useEffect(() => {
        if (isDisconnected) {
            disconnect()
            navigate("/")
        }
    }, [isDisconnected])

    async function copyTextToClipboard() {
        if ("clipboard" in navigator) {
            message.success("invite link copied successfully!")
            return await navigator.clipboard.writeText(
                encodeURI(
                    `${
                        window.location.origin
                    }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                        currentDao?.uuid
                    }`
                )
            )
        } else {
            return document.execCommand(
                "copy",
                true,
                encodeURI(
                    `${
                        window.location.origin
                    }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                        currentDao?.uuid
                    }`
                )
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

    const rep3ProtocolFunctionsCommon = async (currentDaos) => {
        await dispatch(setContractAddress(currentDaos?.proxy_txn_hash))
        await dispatch(getAllMembershipBadgesList())
        await dispatch(getMembershipVoucher())
        await dispatch(getContributionSchema())
        await dispatch(getAllMembershipBadgesForAddress())
    }

    const gnosisFunctionsAdmin = async (dao) => {
        console.log("current safe dao", dao)
        if (dao?.safe_public_address) {
            dispatch(gnosisDetailsofDao())
            dispatch(getPayoutRequest())
            if (safeSdk) {
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }
        }
    }
    const gnosisFunctionsContributor = () => {}

    const contributionFlowAsContributor = async () => {
        await dispatch(getContributionAsContributorApproved())
    }
    const contributionFlowAsAdmin = async () => {
        await dispatch(getContributionAsAdmin())
    }

    const initialLoad = useCallback(async () => {
        if (signer) {
            if (address) {
                dispatch(setLoadingState(true))
                const chainId = await signer.getChainId()
                const { accountRole, currentDaos } = await dispatch(
                    getAllDaowithAddress(chainId)
                )
                await rep3ProtocolFunctionsCommon(currentDaos)
                await initPOCP(currentDaos.uuid, provider, signer, chainId)
                if (accountRole === "ADMIN") {
                    console.log("started here")
                    await gnosisFunctionsAdmin(currentDaos)
                    await dispatch(getAllDaoMembers())
                    await contributionFlowAsAdmin()
                } else {
                    contributionFlowAsContributor()
                    setCurrentPage("request")
                }
            } else {
                dispatch(signout())
                navigate("/")
            }
        }
        dispatch(setLoadingState(false))
    }, [address, dispatch, navigate, role, safeSdk, signer])

    const onAccountSwitch = useCallback(async () => {
        console.log("account switch......")
        if (signer) {
            if (address) {
                dispatch(setLoadingState(true))
                const chainId = await signer.getChainId()
                await rep3ProtocolFunctionsCommon(currentDao)
                await initPOCP(currentDao.uuid, provider, signer, chainId)
                if (role === "ADMIN") {
                    await gnosisFunctionsAdmin(currentDao)
                    await dispatch(getAllDaoMembers())
                    await contributionFlowAsAdmin()
                } else {
                    contributionFlowAsContributor()
                    setCurrentPage("contributions")
                }
            } else {
                dispatch(signout())
                navigate("/")
            }
        }
        dispatch(setLoadingState(false))
    }, [address, dispatch, navigate, role, safeSdk, signer])

    useEffect(() => {
        if (!modalPayment && !prevSigner) {
            initialLoad()
        }
    }, [currentDao?.uuid, signer])

    useEffect(() => {
        if (!modalPayment) {
            onAccountSwitch()
        }
    }, [currentDao?.uuid])

    useEffect(() => {
        preventGoingBack()
    }, [preventGoingBack])

    const onRouteChange = async (route) => {
        setTab(route)
        if (role === "ADMIN" && route === "payments") {
            console.log("To Payments")
            await gnosisFunctionsAdmin()
        } else if (role === "ADMIN" && route === "contributions") {
            console.log("To Contributions")
            await contributionFlowAsAdmin()
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
            {/* <div> */}
            {
                <div
                    onMouseEnter={() => setUniPayHover(true)}
                    onMouseLeave={() => setUniPayHover(false)}
                    style={{ background: modalUniPayment ? "white" : null }}
                    onClick={
                        role === "ADMIN"
                            ? // ? async () => await onUniModalOpen()
                              () => {}
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
            }

            {modalUniPayment && (
                <UniversalPaymentModal
                    signer={signer}
                    onClose={() => setModalUniPayment(false)}
                />
            )}
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
        contributionPending?.length > 0 ? (
            <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
                <div style={{ width: "100%", marginBottom: "100px" }}>
                    {contributionPending.map((item, index) => (
                        <ContributionCard item={item} key={index} />
                    ))}
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
            {dataSource.map((x, i) => (
                <BadgeItem item={x} key={i} />
            ))}
        </div>
    )
    console.log("payout", payout_request)
    const renderPayment = () =>
        payout_request?.length > 0 ? (
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

    const setModalBackDropFunc = (x) => {
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }
    // const contribution = [
    //     {
    //         created_for: "0x9C3f331473602e818E92CD16C948af4e924F81Eb",
    //         request: false,
    //         dao_uuid: "bc9cd815177d4075a9990d29d1b14cb5",
    //         membership_id: 1,
    //         contrib_schema_id: 2,
    //         signed_voucher: {
    //             index: 0,
    //             memberTokenIds: [0],
    //             type_: [1],
    //             tokenUri: "metadatasds;D;,",
    //             data: [0],
    //             nonces: [1],
    //             signature:
    //                 "0x52975260305db40ef82dfcb913ebd594f4fc06fc11828e177ae48cedd75d3a170c5c757246bc67f987d24418b1c522b5f21ea659371195ef89b7a6939110a0b61c",
    //         },
    //         details: [
    //             {
    //                 fieldName: "Contribution Title",
    //                 fieldType: "Text Field",
    //                 options: [],
    //                 value: "asfljb",
    //             },
    //             {
    //                 fieldName: "Additional Notes",
    //                 fieldType: "Long text",
    //                 options: [],
    //                 value: "afl",
    //             },
    //             {
    //                 fieldName: "Time Spent in Hours",
    //                 fieldType: "Numbers",
    //                 options: [],
    //                 value: "1",
    //             },
    //         ],
    //     },
    // ]

    const RequestScreen = () => {
        return (
            <div className={styles.dashView}>
                {(modalContri || modalPayment || modalUniPayment) && (
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
                {/* {<DashboardSearchTab route={tab} />} */}
                {loadingState ? (
                    renderLoadingScreen()
                ) : role === "ADMIN" ? (
                    adminScreen()
                ) : tab === "contributions" ? (
                    <ContributorContributionScreen />
                ) : dataSource?.length > 0 ? (
                    renderBadges()
                ) : (
                    <ContributorBadgeScreen />
                )}
                {rejectModal && (
                    <RejectPayment
                        signer={signer}
                        onClose={() => dispatch(setRejectModal(false))}
                    />
                )}
                {(approve_contri?.length > 0 || approvedBadges?.length > 0) &&
                    tab === "contributions" &&
                    role === "ADMIN" &&
                    !modalPayment && (
                        <ApproveCheckoutButton
                            onModalOpen={() => onPaymentModal()}
                            totalPaymentAmount={
                                approve_contri?.length !== 0
                                    ? getTotalAmount()
                                    : 0
                            }
                            paymentApproved={approve_contri}
                            badgeApproved={approvedBadges}
                        />
                    )}
                {payoutToast && transactionToast()}
                {modalContri && (
                    <ContributionRequestModal setVisibility={setModalContri} />
                )}
                {modalPayment &&
                    (approve_contri?.length > 0 ||
                        approvedBadges?.length > 0) && (
                        <PaymentCheckoutModal
                            signer={signer}
                            onClose={() => setModalPayment(false)}
                        />
                    )}
            </div>
        )
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
                            {currentPage === "request" ||
                            (currentPage === "badges" &&
                                currentDao?.access_role !== "ADMIN") ? (
                                <RequestScreen />
                            ) : currentPage === "badges" ? (
                                <BadgesScreen />
                            ) : (
                                currentPage === "treasury" &&
                                currentDao?.access_role === "ADMIN" && (
                                    <TreasuryDetails />
                                )
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

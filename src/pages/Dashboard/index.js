import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { signout } from "../../store/actions/auth-action"
import {
    getAllClaimedBadges,
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
import { useSafeSdk, usePrevious } from "../../hooks"
import Lottie from "react-lottie"
import dashboardLoader from "../../assets/lottie/dashboardLoader.json"

import {
    setPayment,
    setTransaction,
} from "../../store/actions/transaction-action"
import {
    setLoadingState,
    setPayoutToast,
} from "../../store/actions/toast-action"
import {
    getContributionAsAdmin,
    getContributionAsContributorApproved,
    getContributionSchema,
    getContributorStats,
    getPastContributions,
    setContributionDetail,
} from "../../store/actions/contibutor-action"
import TreasuryDetails from "../../components/TreasuryDetails"
import DashboardSideCard from "../../components/SideCard/DashboardSideCard"
import SettingsScreen from "../../components/SettingsScreen"
import BadgesScreen from "../../components/BadgesScreen"
import { initPOCP } from "../../utils/POCPServiceSdk"
import { useSigner, useProvider, useAccount, useDisconnect } from "wagmi"
import RequestScreen from "../../components/ReuestScreen"

export default function Dashboard() {
    const [tab, setTab] = useState("contributions")
    const currentDao = useSelector((x) => x.dao.currentDao)
    const payoutToast = useSelector((x) => x.toast.payout)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const role = useSelector((x) => x.dao.role)
    const [currentPage, setCurrentPage] = useState("badges")
    const [modalPayment, setModalPayment] = useState(false)

    const { data: signer } = useSigner()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const [showSettings, setShowSettings] = useState(false)
    const provider = useProvider()
    const prevSigner = usePrevious(signer)
    const { isDisconnected } = useAccount()
    const { disconnect } = useDisconnect()
    const loadingState = useSelector((x) => x.toast.loading_state)

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
    const fetchBadges = async () => {
        if (role !== "ADMIN") {
            // dispatch(setLoadingState(true))
            await dispatch(getAllClaimedBadges())
            // dispatch(setLoadingState(false))
        }
    }
    const rep3ProtocolFunctionsCommon = async (currentDaos) => {
        await dispatch(setContractAddress(currentDaos?.proxy_txn_hash))

        await dispatch(getAllMembershipBadgesList())
        await dispatch(getMembershipVoucher())
        await dispatch(getContributionSchema())
        await dispatch(getAllMembershipBadgesForAddress())
    }

    const gnosisFunctionsAdmin = async (dao) => {
        if (dao?.safe_public_address) {
            dispatch(gnosisDetailsofDao())
            dispatch(getPayoutRequest())
            if (safeSdk) {
                const nonce = await safeSdk.getNonce()
                dispatch(set_active_nonce(nonce))
            }
        }
    }

    const contributionFlowAsContributor = async () => {
        await dispatch(getContributionAsContributorApproved())
        await dispatch(getPastContributions())
        await fetchBadges()
        await dispatch(getContributorStats(address))
    }
    const contributionFlowAsAdmin = async () => {
        await dispatch(getContributionAsAdmin())
    }

    const initialLoad = useCallback(async () => {
        if (signer) {
            if (address) {
                dispatch(setLoadingState(true))
                const chainId = await signer?.getChainId()
                const { accountRole, currentDaos } = await dispatch(
                    getAllDaowithAddress(chainId)
                )

                await rep3ProtocolFunctionsCommon(currentDaos)
                await initPOCP(currentDaos.uuid, provider, signer, chainId)
                if (accountRole === "ADMIN") {
                    await gnosisFunctionsAdmin(currentDaos)
                    await dispatch(getAllDaoMembers())
                    await contributionFlowAsAdmin()
                } else {
                    await contributionFlowAsContributor()
                    setCurrentPage("request")
                    setTab("contributions")
                }

                dispatch(setLoadingState(false))
            } else {
                dispatch(signout())
                navigate("/")
            }
        }
    }, [address, dispatch, navigate, role, safeSdk, signer])

    //account changes
    const onAccountSwitch = useCallback(async () => {
        if (signer) {
            if (address) {
                dispatch(setLoadingState(true))
                const chainId = await signer?.getChainId()
                await rep3ProtocolFunctionsCommon(currentDao)
                await initPOCP(currentDao.uuid, provider, signer, chainId)
                if (role === "ADMIN") {
                    setCurrentPage("badges")
                    await gnosisFunctionsAdmin(currentDao)
                    await dispatch(getAllDaoMembers())
                    await contributionFlowAsAdmin()
                } else {
                    contributionFlowAsContributor()
                }
            } else {
                dispatch(signout())
                navigate("/")
            }
        }
        dispatch(setLoadingState(false))
    }, [address, dispatch, navigate, role, safeSdk, signer])

    //screen changes
    const onScreenChange = useCallback(async () => {
        if (signer) {
            if (address) {
                dispatch(setLoadingState(true))
                const chainId = await signer?.getChainId()
                await rep3ProtocolFunctionsCommon(currentDao)
                await initPOCP(currentDao.uuid, provider, signer, chainId)
                if (role === "ADMIN") {
                    // setCurrentPage("badges")
                    await gnosisFunctionsAdmin(currentDao)
                    await dispatch(getAllDaoMembers())
                    await contributionFlowAsAdmin()
                } else {
                    contributionFlowAsContributor()
                }
                dispatch(setLoadingState(false))
            } else {
                dispatch(signout())
                navigate("/")
            }
        }
    }, [address, dispatch, navigate, role, safeSdk, signer])

    useEffect(() => {
        if (!modalPayment && !prevSigner) {
            initialLoad()
        }
    }, [currentDao?.uuid, signer])

    useEffect(async () => {
        if (!modalPayment && currentDao) {
            await onAccountSwitch()
        }
    }, [currentDao?.uuid])

    useEffect(async () => {
        if (!modalPayment && currentDao && role === "ADMIN") {
            await onScreenChange()
        }
    }, [currentPage])

    useEffect(() => {
        preventGoingBack()
    }, [preventGoingBack])

    const onRouteChange = async (route) => {
        setTab(route)
        if (role === "ADMIN" && route === "payments") {
            await gnosisFunctionsAdmin()
        } else if (role === "ADMIN" && route === "contributions") {
            await gnosisFunctionsAdmin()
            await contributionFlowAsAdmin()
        }
    }

    const setModalBackDropFunc = (x) => {
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
    }

    const renderLoadingScreen = () => (
        <div className={styles.emptyDiv}>
            <Lottie
                options={defaultOptions}
                style={{ height: "100%", width: "30%" }}
                className="layoutImage"
            />
        </div>
    )

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
                        {loadingState ? (
                            renderLoadingScreen()
                        ) : (
                            <>
                                <div className={styles.children}>
                                    {currentPage === "request" ||
                                    (currentPage === "badges" &&
                                        currentDao?.access_role !== "ADMIN") ? (
                                        <RequestScreen
                                            onRouteChange={onRouteChange}
                                            tab={tab}
                                            modalPayment={modalPayment}
                                            setModalPayment={setModalPayment}
                                        />
                                    ) : currentPage === "badges" ? (
                                        <BadgesScreen />
                                    ) : (
                                        currentPage === "treasury" &&
                                        currentDao?.access_role === "ADMIN" && (
                                            <TreasuryDetails />
                                        )
                                    )}
                                </div>
                            </>
                        )}
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

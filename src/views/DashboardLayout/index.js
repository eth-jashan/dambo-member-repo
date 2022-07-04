import React from "react"
import { Tooltip } from "antd"
import "antd/dist/antd.css"
import styles from "./style.module.css"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import {
    contributorRefreshList,
    getAllApprovedBadges,
    getAllClaimedBadges,
    getAllUnclaimedBadges,
    getCommunityId,
    getContributorOverview,
    getContriRequest,
    getPayoutRequest,
    gnosisDetailsofDao,
    lastSelectedId,
    refreshContributionList,
    set_active_nonce,
    set_dao,
    set_payout_filter,
    syncTxDataWithGnosis,
} from "../../store/actions/dao-action"
import logo from "../../assets/dreputeLogo.svg"
import add_white from "../../assets/Icons/add_white.svg"
import {
    resetApprovedRequest,
    setPayment,
    setTransaction,
} from "../../store/actions/transaction-action"
import { useSafeSdk } from "../../hooks"
import { setLoadingState } from "../../store/actions/toast-action"
import { setContributionDetail } from "../../store/actions/contibutor-action"
import DashboardHeader from "../../components/DashboardHeader"
import OnboardingHeader from "../../components/OnboardingHeader"
import AntdToast from "../../components/Toast/AntdToast"

export default function DashboardLayout({
    children,
    route,
    signer,
    modalBackdrop,
    currentPage,
    setCurrentPage,
    setShowSettings,
}) {
    const accounts = useSelector((x) => x.dao.dao_list)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const role = useSelector((x) => x.dao.role)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)

    const contributorFetch = async () => {
        dispatch(setLoadingState(true))
        await dispatch(getContriRequest())
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllClaimedBadges())
        await dispatch(getAllUnclaimedBadges())
        dispatch(getContributorOverview())
        dispatch(setLoadingState(false))
    }

    const changeAccount = async (item) => {
        dispatch(refreshContributionList())
        dispatch(contributorRefreshList())
        dispatch(resetApprovedRequest())
        dispatch(set_dao(item))
        // await dispatch(getCommunityId())
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
        dispatch(lastSelectedId(item?.dao_details?.uuid))
        await dispatch(gnosisDetailsofDao())
        dispatch(setLoadingState(true))
        await dispatch(getContriRequest())
        if (route === "contributions" && role === "ADMIN") {
            dispatch(setLoadingState(false))
            await dispatch(getPayoutRequest())
            await dispatch(set_payout_filter("PENDING"))
            await dispatch(syncTxDataWithGnosis())
        } else if (role !== "ADMIN") {
            await contributorFetch()
            dispatch(setLoadingState(false))
        } else if (route !== "contributions" && role === "ADMIN") {
            await dispatch(getPayoutRequest())
            await dispatch(set_payout_filter("PENDING"))
            await dispatch(syncTxDataWithGnosis())
            dispatch(setLoadingState(false))
        }

        if (safeSdk) {
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
        dispatch(setLoadingState(false))
    }

    const text = (item) => <span>{item}</span>
    return (
        <>
            <AntdToast />
            <div className={styles.layout}>
                <div className={styles.accountsLayout}>
                    <div className={styles.logoContainer}>
                        <img
                            src={logo}
                            alt="logo"
                            style={{ height: "2.25rem", width: "2.25rem" }}
                        />
                    </div>

                    {accounts.map((item, index) => (
                        <div
                            className={styles.accountContainer}
                            key={item.dao_details?.uuid}
                        >
                            <Tooltip
                                placement="right"
                                title={() => text(item?.dao_details?.name)}
                            >
                                <div
                                    onClick={async () =>
                                        await changeAccount(item, index)
                                    }
                                    style={{
                                        height: "2.25rem",
                                        width: "100%",
                                        background: "transparent",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        position: "relative",
                                        cursor: "pointer",
                                    }}
                                >
                                    {currentDao?.uuid ===
                                        item.dao_details?.uuid && (
                                        <div
                                            className={styles.selectedDao}
                                        ></div>
                                    )}

                                    {item?.dao_details?.logo_url ? (
                                        <img
                                            src={item?.dao_details?.logo_url}
                                            alt="logo"
                                            height="100%"
                                            style={{
                                                borderRadius: "2.25rem",
                                                background: "black",
                                                width: "2.25rem",
                                                margin: "0 auto",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: "2.25rem",
                                                borderRadius: "2.25rem",
                                                width: "2.25rem",
                                                background: "#FF0186",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                margin: "0 auto",
                                            }}
                                        />
                                    )}
                                </div>
                            </Tooltip>
                        </div>
                    ))}
                    <div className={styles.addContainer}>
                        <div
                            className={styles.addButton}
                            onClick={() => navigate("/onboard/dao")}
                        >
                            <img
                                alt="add"
                                className={styles.addIcon}
                                src={add_white}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.childrenLayout}>
                    <DashboardHeader
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        modalBackdrop={modalBackdrop}
                        route={route}
                        setShowSettings={setShowSettings}
                    />
                    {children}
                </div>
            </div>
            <div className={styles.mobileLayout}>
                <OnboardingHeader
                    signer={signer}
                    onWalletCenterOpen={() => {}}
                    showWalletPicker={false}
                />
                <div className={styles.mobileContent}>
                    <div className={styles.mobileContentHeading}>
                        You’re early
                    </div>
                    <div>
                        We're yet to support mobile, please try again on
                        desktop.
                    </div>
                </div>
            </div>
        </>
    )
}

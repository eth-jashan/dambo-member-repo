import React from "react"
import "antd/dist/antd.css"
import styles from "./style.module.css"
import { useNavigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import {
    lastSelectedId,
    set_active_nonce,
    set_dao,
} from "../../store/actions/dao-action"
import logo from "../../assets/dreputeLogo.svg"
import add_white from "../../assets/Icons/add_white.svg"
import { useSafeSdk } from "../../hooks"
import DashboardHeader from "../../components/DashboardHeader"
import OnboardingHeader from "../../components/OnboardingHeader"
import AntdToast from "../../components/Toast/AntdToast"
import AccountPic from "./AccountPic"

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
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)

    const contributorFetch = async () => {
        // dispatch(setLoadingState(true))
        // dispatch(setLoadingState(false))
    }

    const changeAccount = async (item) => {
        dispatch(set_dao(item))
        dispatch(lastSelectedId(item?.dao_details?.uuid))

        if (safeSdk) {
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
    }

    // console.log("image check", checkImage(accounts[0]?.dao_details?.logo_url))

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
                        <AccountPic
                            currentDao={currentDao}
                            changeAccount={changeAccount}
                            key={index}
                            index={index}
                            item={item}
                        />
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

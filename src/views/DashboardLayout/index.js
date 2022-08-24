import React from "react"
import "antd/dist/antd.css"
import "./style.scss"
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
import { Tooltip } from "antd"

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
    const unclaimedMembershipVouchersForAddress = useSelector(
        (x) => x.membership.unclaimedMembershipVouchersForAddress
    )
    const changeAccount = async (item) => {
        dispatch(set_dao(item))
        dispatch(lastSelectedId(item?.dao_details?.uuid))

        if (safeSdk) {
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
    }

    return (
        <div className="dashboard-layout-container">
            <AntdToast />
            <div className="dashboard-layout">
                <div className="dashboard-accounts-layout">
                    <div className="logoContainer">
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
                    <div className="addContainer">
                        <Tooltip
                            placement="right"
                            title={
                                <span className="dao-add-btn-tooltip">
                                    {
                                        unclaimedMembershipVouchersForAddress.length
                                    }{" "}
                                    Invites pending
                                </span>
                            }
                            overlayClassName="dao-add-btn-tooltip-card"
                        >
                            <div
                                className="dashboard-layout-left-add-button"
                                onClick={() =>
                                    unclaimedMembershipVouchersForAddress.length
                                        ? navigate(
                                              `/onboard/contributor/null`,
                                              {
                                                  state: {
                                                      discordUserId: "userId",
                                                      onboardingStep: 0,
                                                  },
                                              }
                                          )
                                        : navigate("/onboard/dao")
                                }
                            >
                                <img
                                    alt="add"
                                    className="addIcon"
                                    src={add_white}
                                />
                                {unclaimedMembershipVouchersForAddress.length ? (
                                    <div className="unclaimed-vouchers-count">
                                        {
                                            unclaimedMembershipVouchersForAddress.length
                                        }
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                </div>

                <div className="childrenLayout">
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
            <div className="mobileLayout">
                <OnboardingHeader
                    signer={signer}
                    onWalletCenterOpen={() => {}}
                    showWalletPicker={false}
                />
                <div className="mobileContent">
                    <div className="mobileContentHeading">You’re early</div>
                    <div>
                        We're yet to support mobile, please try again on
                        desktop.
                    </div>
                </div>
            </div>
        </div>
    )
}

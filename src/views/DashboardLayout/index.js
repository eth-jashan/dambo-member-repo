import React, { useState } from "react"
import { Tooltip, message } from "antd"
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
import { links } from "../../constant/links"
import logo from "../../assets/dreputeLogo.svg"
import add_white from "../../assets/Icons/add_white.svg"
import TransactionCard from "../../components/SideCard/TransactionCard"
import PaymentSlideCard from "../../components/SideCard/PaymentSideCard"
import {
    resetApprovedRequest,
    setPayment,
    setTransaction,
} from "../../store/actions/transaction-action"
import { useSafeSdk } from "../../hooks"
import textStyles from "../../commonStyles/textType/styles.module.css"
import ContributionSideCard from "../../components/SideCard/ContributionSideCard"
import ProfileModal from "../../components/Modal/ProfileModal"
import ContributionOverview from "../../components/SideCard/ContributorOverview"
import AccountSwitchModal from "../../components/Modal/AccountSwitchModal"
import { AiFillCaretDown } from "react-icons/ai"
import { setLoadingState } from "../../store/actions/toast-action"
import { setContributionDetail } from "../../store/actions/contibutor-action"

export default function DashboardLayout({
    children,
    route,
    signer,
    modalBackdrop,
    onRouteChange,
}) {
    const accounts = useSelector((x) => x.dao.dao_list)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const contri_filter_key = useSelector((x) => x.dao.contri_filter_key)
    const role = useSelector((x) => x.dao.role)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address)
    const contribution_detail = useSelector(
        (x) => x.contributor.contribution_detail
    )
    const account_mode = useSelector((x) => x.dao.account_mode)
    const [profile_modal, setProfileModal] = useState(false)
    const [switchRoleModal, setSwitchRoleModal] = useState(false)
    const [roleContainerHover, setRoleContainerHover] = useState(false)
    const address = useSelector((x) => x.auth.address)
    const community_id = useSelector((x) => x.dao.communityInfo)

    const currentUser = currentDao?.signers.filter(
        (x) => x.public_address === address
    )

    const getInitialForAccount = () => {
        if (currentUser) {
            const nameArray = currentUser[0]?.metadata?.name?.split(" ")
            if (nameArray?.length > 1) {
                return {
                    first: nameArray[0].charAt(0)?.toUpperCase(),

                    last: nameArray[1].charAt(0)?.toUpperCase(),
                }
            } else {
                return {
                    first: nameArray
                        ? nameArray[0]?.charAt(0)?.toUpperCase()
                        : "",
                    last: "",
                }
            }
        }
    }

    const contributorFetch = async () => {
        dispatch(setLoadingState(true))
        await dispatch(getContriRequest())
        await dispatch(getAllApprovedBadges())
        await dispatch(getAllClaimedBadges())
        await dispatch(getAllUnclaimedBadges())
        dispatch(getContributorOverview())
        dispatch(setLoadingState(false))
    }

    const changeAccount = async (item, index) => {
        dispatch(refreshContributionList())
        dispatch(contributorRefreshList())
        dispatch(resetApprovedRequest())
        dispatch(set_dao(item))
        await dispatch(getCommunityId())
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
            await dispatch(set_payout_filter("PENDING", 1))
            await dispatch(syncTxDataWithGnosis())
        } else if (role !== "ADMIN") {
            await contributorFetch()
            dispatch(setLoadingState(false))
        } else if (route !== "contributions" && role === "ADMIN") {
            await dispatch(getPayoutRequest())
            await dispatch(set_payout_filter("PENDING", 1))
            await dispatch(syncTxDataWithGnosis())
            dispatch(setLoadingState(false))
        }

        if (safeSdk) {
            const nonce = await safeSdk.getNonce()
            dispatch(set_active_nonce(nonce))
        }
        dispatch(setLoadingState(false))
    }

    async function copyTextToClipboard() {
        if ("clipboard" in navigator) {
            message.success("invite link copied succesfully!")
            return await navigator.clipboard.writeText(
                `${links.contributor_invite.dev}${currentDao?.uuid}`
            )
        } else {
            return document.execCommand(
                "copy",
                true,
                `${links.contributor_invite.dev}${currentDao?.uuid}`
            )
        }
    }

    const onProfileModal = () => {
        dispatch(setPayment(null))
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
        setProfileModal(!profile_modal)
        setSwitchRoleModal(false)
    }

    const onSwitchRoleModal = () => {
        setProfileModal(false)
        modalBackdrop(!switchRoleModal)
        setSwitchRoleModal(!switchRoleModal)
    }

    const accountSwitchPress = () => {
        dispatch(setTransaction(null))
        dispatch(setContributionDetail(null))
        setSwitchRoleModal(false)
    }

    const headerComponet = () => {
        return (
            <div className={styles.header}>
                <div className={styles.safe_info}>
                    <div
                        style={{ color: "white", textAlign: "start" }}
                        className={textStyles.ub_14}
                    >
                        {currentDao?.name}
                    </div>
                    <div
                        style={{
                            color: "white",
                            textAlign: "start",
                            marginLeft: "0.5rem",
                        }}
                        className={textStyles.m_14}
                    >
                        {currentDao?.safe_public_address}
                    </div>
                </div>
                <div className={styles.profileContainer}>
                    <div>
                        {account_mode === "ADMIN" && (
                            <div
                                onMouseEnter={() => setRoleContainerHover(true)}
                                onMouseLeave={() =>
                                    setRoleContainerHover(false)
                                }
                                onClick={() => onSwitchRoleModal()}
                                style={{
                                    background:
                                        switchRoleModal || roleContainerHover
                                            ? "white"
                                            : "#5D5C5D",
                                    cursor: "pointer",
                                }}
                                className={styles.roleSwitchContainer}
                            >
                                <div
                                    style={{
                                        color:
                                            switchRoleModal ||
                                            roleContainerHover
                                                ? "black"
                                                : "white",
                                    }}
                                    className={textStyles.m_14}
                                >
                                    {role === "ADMIN"
                                        ? "Approval"
                                        : "Contributor"}
                                </div>
                                {
                                    <AiFillCaretDown
                                        color={
                                            switchRoleModal ||
                                            roleContainerHover
                                                ? "black"
                                                : "white"
                                        }
                                        style={{ alignSelf: "center" }}
                                        size={12}
                                    />
                                }
                            </div>
                        )}
                        {switchRoleModal && (
                            <AccountSwitchModal
                                route={route}
                                onChange={() => accountSwitchPress()}
                            />
                        )}
                    </div>
                    <div>
                        <div
                            onClick={() => onProfileModal()}
                            className={styles.accountIcon}
                        >
                            <div
                                className={`${textStyles.m_14} ${textStyles.m_14} ${styles.initialText}`}
                            >
                                {getInitialForAccount()?.first}
                            </div>
                            <div
                                className={`${textStyles.m_14} ${textStyles.m_14} ${styles.initialText}`}
                            >
                                {getInitialForAccount()?.last}
                            </div>
                        </div>
                        {profile_modal && <ProfileModal />}
                    </div>
                </div>
            </div>
        )
    }

    const renderAdminStats = () => (
        <div className={styles.emptySideCard}>
            <div className={`${textStyles.m_28} ${styles.selectContriText}`}>
                Select contribution to see details
            </div>
        </div>
    )

    const renderSideBarComp = () => {
        if (role === "ADMIN") {
            if (route === "contributions" && currentTransaction) {
                return contri_filter_key ? (
                    <TransactionCard signer={signer} />
                ) : (
                    <ContributionSideCard
                        onRouteChange={async () => await onRouteChange()}
                        signer={signer}
                    />
                )
            } else if (route === "payments" && currentPayment) {
                return <PaymentSlideCard signer={signer} />
            } else {
                return renderAdminStats()
            }
        } else {
            if (contribution_detail) {
                return (
                    <ContributionSideCard
                        route={route}
                        isAdmin={false}
                        signer={signer}
                    />
                )
            } else {
                return <ContributionOverview />
            }
        }
    }

    const onBackDropPress = () => {
        setSwitchRoleModal(false)
        setProfileModal(false)
    }

    const text = (item) => <span>{item}</span>
    return (
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
                                    <div className={styles.selectedDao}></div>
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
                {(switchRoleModal || profile_modal) && (
                    <div
                        onClick={() => onBackDropPress()}
                        className={styles.backdrop}
                    />
                )}
                {headerComponet()}
                <div className={styles.layoutContainer}>
                    <div className={styles.children}>{children}</div>
                    <div className={styles.adminStats}>
                        {renderSideBarComp()}
                    </div>
                </div>
            </div>
        </div>
    )
}

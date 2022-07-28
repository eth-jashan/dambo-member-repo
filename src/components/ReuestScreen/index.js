import React, { useState } from "react"
import "./style.scss"
import PaymentCheckoutModal from "../Modal/PaymentCheckoutModal"
import ContributionRequestModal from "../Modal/ContributionRequest"
import RejectPayment from "../Modal/RejectPayment"
import ApproveCheckoutButton from "../ApproveCheckoutButton"
import ContributorContributionScreen from "../ContributorContributionScreen"
import ContributorBadgeScreen from "../ContributorBadgeScreen"
import { useSigner } from "wagmi"
import { useDispatch, useSelector } from "react-redux"
// import DashboardSearchTab from "..//DashboardSearchTab"
import UniversalPaymentModal from "..//Modal/UniversalPaymentModal"
import plus_black from "../../assets/Icons/plus_black.svg"
import plus_gray from "../../assets/Icons/plus_gray.svg"
import textStyles from "../../commonStyles/textType/styles.module.css"
import ContributionCard from "../ContributionCard"
import PaymentCard from "../PaymentCard"
import BadgeItem from "../BadgeItem"
import { setRejectModal } from "../../store/actions/transaction-action"
import { getAllClaimedBadges } from "../../store/actions/dao-action"
import { setLoadingState } from "../../store/actions/toast-action"
import { message } from "antd"

export default function RequestScreen({
    onRouteChange,
    tab,
    modalPayment,
    setModalPayment,
}) {
    const approve_contri = useSelector(
        (x) => x.transaction.approvedContriRequest
    )
    const currentDao = useSelector((x) => x.dao.currentDao)

    // const contribution_request = useSelector((x) => x.dao.contribution_request)
    const loadingState = useSelector((x) => x.toast.loading_state)
    const approvedBadges = useSelector((x) => x.dao.approvedBadges)

    console.log("loading state is ", loadingState)

    const { data: signer } = useSigner()

    const [uniPayHover, setUniPayHover] = useState(false)

    const [modalUniPayment, setModalUniPayment] = useState(false)

    const payoutData = useSelector((x) => x.toast.payout_data)

    const pending_txs = useSelector((x) => x.transaction.pendingTransaction)

    const [modalContri, setModalContri] = useState(false)

    const payout_request = useSelector((x) => x.dao.payout_request)

    const contributionPending = useSelector(
        (x) => x.contributor.contributionForAdmin
    )
    const role = useSelector((x) => x.dao.role)
    const dataSource = useSelector((x) => x.dao.all_claimed_badge)
    const payoutToast = useSelector((x) => x.toast.payout)
    const dispatch = useDispatch()

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

    const active_payout_notification = useSelector(
        (x) => x.dao.active_payout_notification
    )
    const rejectModal = useSelector((x) => x.transaction.rejectModal)

    const adminScreen = () =>
        tab === "contributions" ? renderContribution() : renderPayment()

    const renderEmptyScreen = () => (
        <div className="emptyDiv">
            <div className="heading">No contribution requests</div>
            {role !== "ADMIN" ? (
                <div className={`$"heading} $"greyedHeading}`}>
                    Initiate a contribution
                    <br /> request to get paid
                </div>
            ) : (
                <div className={`$"heading} $"greyedHeading}`}>
                    Share link to onboard
                    <br /> contributors
                </div>
            )}
            {role === "ADMIN" ? (
                <button
                    onClick={() => copyTextToClipboard()}
                    className="button"
                >
                    <div>Copy Invite Link</div>
                </button>
            ) : (
                <button onClick={() => setModalContri(true)} className="button">
                    <div>Create Contribution Request</div>
                </button>
            )}
        </div>
    )

    const approvedContriRequest = useSelector(
        (x) => x.transaction.approvedContriRequest
    )

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
            className="toastContainer"
        >
            <div className="toastLeft">
                <div style={{ color: "white" }} className={textStyles.m_16}>
                    {payoutToastInfo().title}
                </div>
            </div>
            <div className="toastRight">
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

    const onPaymentModal = () => {
        setModalPayment(true)
    }

    const fetchBadges = async () => {
        if (role !== "ADMIN") {
            // dispatch(setLoadingState(true))
            await dispatch(getAllClaimedBadges())
            // dispatch(setLoadingState(false))
        }
    }
    const schemaOfDao = useSelector((x) => x.contributor.contributorSchema)

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

    const renderTab = () => (
        <div className="tabContainer">
            <div className="routeContainer">
                <div
                    onClick={async () => await onRouteChange("contributions")}
                    className={
                        tab === "contributions"
                            ? `selected ${textStyles.ub_23}`
                            : `selectionTab ${textStyles.ub_23}`
                    }
                >
                    Contributions
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <div
                        onClick={async () => {
                            await onRouteChange("payments")
                            fetchBadges()
                        }}
                        style={{ marginLeft: "2rem" }}
                        className={
                            tab === "payments"
                                ? `selected ${textStyles.ub_23}`
                                : `selectionTab ${textStyles.ub_23}`
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
            {role !== "ADMIN" && schemaOfDao && (
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
                    className="addPaymentContainer"
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
    )

    return (
        <div className="request-screen-container">
            <div className="dashView">
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
                {role === "ADMIN" ? (
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
        </div>
    )
}

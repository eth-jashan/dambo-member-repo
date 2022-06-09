import React from "react"
import { useSelector } from "react-redux"
import TransactionCard from "../TransactionCard"
import PaymentSlideCard from "../PaymentSideCard"
import ContributionSideCard from "../ContributionSideCard"
import ContributionOverview from "../ContributorOverview"
import TreasurySideCard from "../TreasurySideCard"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import { MdLink } from "react-icons/md"
import { message } from "antd"
import { FaDiscord } from "react-icons/fa"
import { links } from "../../../constant/links"
import "./style.scss"

export default function DashboardSideCard({
    onRouteChange,
    currentPage,
    route,
    signer,
}) {
    const role = useSelector((x) => x.dao.role)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const currentTransaction = useSelector(
        (x) => x.transaction.currentTransaction
    )
    const currentPayment = useSelector((x) => x.transaction.currentPayment)
    const contri_filter_key = useSelector((x) => x.dao.contri_filter_key)
    const address = useSelector((x) => x.auth.address)
    const contribution_detail = useSelector(
        (x) => x.contributor.contribution_detail
    )

    const openDiscordBot = () => {
        localStorage.setItem("discord_bot_dao_uuid", currentDao.uuid)
        window.open(links.discord_add_bot.staging, "_self")
    }

    async function copyTextToClipboard(textToCopy) {
        if ("clipboard" in navigator) {
            message.success("Copied Successfully")
            return await navigator.clipboard.writeText(textToCopy)
        } else {
            return document.execCommand("copy", true, address)
        }
    }

    const renderAdminStats = () => (
        <div className="dashboard-side-card-container">
            <div className={`${textStyles.m_28} selectContriText`}>
                Select contribution to see details
            </div>
            <div>
                <div
                    onClick={() =>
                        copyTextToClipboard(
                            `${
                                window.location.origin
                            }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                                currentDao?.uuid
                            }`
                        )
                    }
                    className="copyLink"
                >
                    <MdLink color="white" />
                    <span className="copyLinkdiv">copy invite link</span>
                </div>
                {!currentDao.guild_id && (
                    <div
                        onClick={() => openDiscordBot()}
                        className="enableDiscord"
                    >
                        <FaDiscord color="white" />
                        <div>enable discord bot</div>
                    </div>
                )}
            </div>
        </div>
    )

    if (role === "ADMIN") {
        if (currentPage === "treasury") {
            return <TreasurySideCard />
        } else {
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

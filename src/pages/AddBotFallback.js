import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { connectDaoToDiscord } from "../store/actions/dao-action"
import { message } from "antd"
import { getDiscordUserId } from "../store/actions/contibutor-action"
import { links } from "../constant/links"

export default function AddBotFallback() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const search = useLocation().search
    const guildId = new URLSearchParams(search).get("guild_id")
    const daoUuid = localStorage.getItem("discord_bot_dao_uuid")
    const code = new URLSearchParams(search).get("code")

    useEffect(() => {
        async function connectDiscord() {
            const discordId = await dispatch(
                getDiscordUserId(
                    code,
                    "http://staging.app.drepute.xyz/discord/add-bot-fallback"
                )
            )
            const res = await dispatch(
                connectDaoToDiscord(daoUuid, guildId, discordId)
            )
            if (res) {
                message.success("Bot registered successfully")
                navigate("/dashboard")
            } else {
                message.error("Something went wrong!!. Please try again")
            }
        }
        connectDiscord()
    }, [])

    return <div>Please wait while we register your bot</div>
}

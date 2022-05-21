import React, { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { signout } from "../store/actions/auth-action"
import {
    getDiscordOAuth,
    getDiscordUserId,
} from "../store/actions/contibutor-action"
import { links } from "../constant/links"

const DiscordFallback = () => {
    const id = useSelector((x) => x.contributor.invite_code)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const search = useLocation().search
    const code = new URLSearchParams(search).get("code")

    const fallbackCheck = useCallback(async () => {
        try {
            const userId = await dispatch(
                getDiscordUserId(
                    code,
                    `${window.location.origin}/discord/fallback`
                )
            )
            const res = await dispatch(getDiscordOAuth(code))
            const data = JSON.parse(localStorage.getItem("discord"))
            if (res && userId) {
                navigate(`/onboard/contributor/${data.id}`, {
                    state: {
                        discordUserId: userId,
                    },
                })
            } else {
                dispatch(signout())
                navigate(`/`)
            }
        } catch (error) {}
    }, [code, dispatch, navigate])

    useEffect(() => {
        fallbackCheck()
    }, [fallbackCheck])

    return <div />
}

export default DiscordFallback

import React, { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { setAdminStatus, signout } from "../store/actions/auth-action"
import { set_invite_id, setDaoName } from "../store/actions/contibutor-action"
import AuthWallet from "./AuthWallet"

const ContributorSignupFallback = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id, name } = useParams()

    const linkCheck = useCallback(() => {
        dispatch(set_invite_id(id))
        dispatch(signout())
        dispatch(setAdminStatus(false))
        dispatch(setDaoName(name))
        // navigate("/")
    }, [dispatch, id, navigate])

    useEffect(() => {
        linkCheck()
    }, [linkCheck])

    return <AuthWallet />
}

export default ContributorSignupFallback

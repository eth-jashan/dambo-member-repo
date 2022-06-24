import React, { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router"
import { setAdminStatus, signout } from "../store/actions/auth-action"
import { set_invite_id, setDaoName } from "../store/actions/contibutor-action"

const ContributorSignupFallback = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id, name } = useParams()

    const linkCheck = useCallback(() => {
        // console.log("here")
        dispatch(set_invite_id(id))
        dispatch(signout())
        dispatch(setAdminStatus(false))
        dispatch(setDaoName(name))
        navigate("/")
    }, [dispatch, id, navigate])

    useEffect(() => {
        linkCheck()
    }, [linkCheck])

    return <div />
}

export default ContributorSignupFallback

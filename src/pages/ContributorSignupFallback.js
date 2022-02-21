import React, { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { setAdminStatus } from '../store/actions/auth-action'
import { set_invite_id } from '../store/actions/contibutor-action'

const ContributorSignupFallback = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()

    const linkCheck = useCallback(() => {
        dispatch(set_invite_id(id))
        dispatch(setAdminStatus(false))
        navigate('/')
    },[dispatch, id, navigate])

    useEffect(()=>{
        linkCheck()
    },[linkCheck])
    
    return(
        <div/>
    )
}

export default ContributorSignupFallback
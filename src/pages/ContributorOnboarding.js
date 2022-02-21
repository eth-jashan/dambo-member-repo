import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import ContributorSignup from '../components/ContributorSignup'
import { setAdminStatus } from '../store/actions/auth-action'
import { getRole, set_invite_id } from '../store/actions/contibutor-action'
import Layout from '../views/Layout'

const ContributorOnbording = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
    const address = useSelector(x=>x.auth.address)
    const discord = useSelector(x=>x.contributor.discord_auth)
    const jwt = useSelector(x=>x.auth.jwt)

    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener("popstate", () => {
            if(address && jwt){
                console.log('on back!!!')
                window.history.pushState(null, document.title, window.location.href);
            }
        });
    },[address, jwt])

    useEffect(()=>{
    preventGoingBack()
    },[preventGoingBack])

    const checkAuth = useCallback(() => {
        const res = dispatch(getRole(id))
        console.log('resss....', res)
        if(!discord){
            dispatch(set_invite_id(id))
            dispatch(setAdminStatus(false))
            navigate('/')
        }
    },[discord, dispatch, id, navigate])

    // useEffect(()=>{
    //     checkAuth()
    // },[checkAuth])

    return(
        <Layout>
            <ContributorSignup 
                isDao={false} 
            />
        </Layout>
    )

}

export default ContributorOnbording
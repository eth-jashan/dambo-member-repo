import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import ContributorSignup from '../components/ContributorSignup'
import { setAdminStatus } from '../store/actions/auth-action'
import { set_invite_id } from '../store/actions/contibutor-action'
import Layout from '../views/Layout'

const ContributorOnbording = () => {

    // const loggedIn = useSelector(x=>x.auth.loggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();
    const isAdmin = useSelector(x=>x.auth.isAdmin)

    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)

    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener("popstate", () => {
            // navigate.to(1);
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
        if(isAdmin){
            dispatch(set_invite_id(id))
            dispatch(setAdminStatus(false))
            navigate('/')
        }
    },[isAdmin, dispatch, id, navigate])

    useEffect(()=>{
        checkAuth()
    },[checkAuth])

    return(
        <Layout>
            <ContributorSignup 
                isDao={false} 
            />
        </Layout>
    )

}

export default ContributorOnbording
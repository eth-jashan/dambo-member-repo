import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import ContributorSignup from '../components/ContributorSignup'
import { setAdminStatus } from '../store/actions/auth-action'
import { set_invite_id } from '../store/actions/contibutor-action'
import Layout from '../views/Layout'

const ContributorOnbording = () => {

    const loggedIn = useSelector(x=>x.auth.loggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id } = useParams();

    const checkAuth = useCallback(() => {
        if(!loggedIn){
            dispatch(set_invite_id(id))
            dispatch(setAdminStatus(false))
            navigate('/')
        }
    },[loggedIn, dispatch, navigate, id])

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
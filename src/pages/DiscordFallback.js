import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { getDiscordOAuth } from '../store/actions/contibutor-action'

const DiscordFallback = () => {
    
    const address = useSelector(x=>x.auth.address)
    const isAdmin = useSelector(x=>x.auth.isAdmin)
    const id = useSelector(x=>x.contributor.invite_code)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const search = useLocation().search;
    const code = new URLSearchParams(search).get('code');


    const fallbackCheck = useCallback(async() => {
        console.log('discord....', code, isAdmin)
        try {
            const res = await dispatch(getDiscordOAuth(code))
            if(res){
                navigate(`/onboard/contributor/${id}`)
            }else{
                navigate(`/auth`)
            }
        } catch (error) {
            
        }
    },[code, dispatch, id, navigate])

    useEffect(()=>{
        fallbackCheck()
    },[fallbackCheck])

    return(
        <div/>
    )
}

export default DiscordFallback
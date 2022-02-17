import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { getDiscordOAuth } from '../store/actions/contibutor-action'

const DiscordFallback = () => {
    
    const address = useSelector(x=>x.auth.address)
    const id = useSelector(x=>x.contributor.invite_code)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fallbackCheck = useCallback(async() => {
        try {
            const res = await dispatch(getDiscordOAuth())
            if(res){
                navigate(`/onboard/contributor/${id}`)
            }else{
                navigate(`/auth`)
            }
        } catch (error) {
            
        }
    },[dispatch, id, navigate])

    useEffect(()=>{
        fallbackCheck()
    },[fallbackCheck])

    return(
        <div/>
    )
}

export default DiscordFallback
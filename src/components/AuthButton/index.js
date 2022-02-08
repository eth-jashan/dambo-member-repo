import { Button } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authWithSign } from '../../store/actions/auth-action'

const AuthButton = ({address, provider}) => {
    
    const dispatch = useDispatch()

    const onTapSignin = async() => {
       alert('connect start ====>', address)
    }
    console.log('connect start', address)
    return(
        <a onClick={()=>onTapSignin()}>
            Authenticate with Wallet
        </a>
            
    )
}

export default AuthButton
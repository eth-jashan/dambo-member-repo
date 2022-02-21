import React from 'react'
import { useSelector } from 'react-redux'
import ConnectWallet from '../components/ConnectWallet'
import Layout from '../views/Layout'

const AuthWallet = () => {
    const isAdmin = useSelector(x=>x.auth.isAdmin)

    return(
        <Layout contributorWallet={!isAdmin}>
            <ConnectWallet 
                isAdmin={isAdmin} 
            />
        </Layout>
    )

}

export default AuthWallet
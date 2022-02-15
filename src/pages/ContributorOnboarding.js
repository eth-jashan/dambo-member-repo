import React from 'react'
import { useSelector } from 'react-redux'
import ConnectWallet from '../components/ConnectWallet'
import ContributorSignup from '../components/ContributorSignup'
import Layout from '../views/Layout'

const ContributorOnbording = () => {

    const loggedIn = useSelector(x=>x.auth.loggedIn)

    return(
        !loggedIn?
        <Layout contributorWallet={true}>
            <ConnectWallet 
                isDao={false} 
            />
        </Layout>:
        <Layout>
            <ContributorSignup 
                isDao={false} 
            />
        </Layout>
    )

}

export default ContributorOnbording
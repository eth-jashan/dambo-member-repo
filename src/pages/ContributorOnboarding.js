import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import ContributorSignup from "../components/ContributorSignup"
import Layout from "../views/Layout"

const ContributorOnbording = () => {
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)

    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener("popstate", () => {
            if (address && jwt) {
                // console.log('on back!!!')
                window.history.pushState(
                    null,
                    document.title,
                    window.location.href
                )
            }
        })
    }, [address, jwt])

    useEffect(() => {
        preventGoingBack()
    }, [preventGoingBack])

    // useEffect(()=>{
    //     checkAuth()
    // },[checkAuth])

    return (
        <Layout>
            <ContributorSignup isDao={false} />
        </Layout>
    )
}

export default ContributorOnbording

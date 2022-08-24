import React, { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import ContributorSignup from "../components/ContributorSignup"
import Layout from "../views/Layout"
import { useLocation } from "react-router"

const ContributorOnbording = () => {
    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const { state } = useLocation()

    // const preventGoingBack = useCallback(() => {
    //     window.history.pushState(null, document.title, window.location.href)
    //     window.addEventListener("popstate", () => {
    //         if (address && jwt) {
    //             window.history.pushState(
    //                 null,
    //                 document.title,
    //                 window.location.href
    //             )
    //         }
    //     })
    // }, [address, jwt])

    // useEffect(() => {
    //     preventGoingBack()
    // }, [preventGoingBack])

    // useEffect(()=>{
    //     checkAuth()
    // },[checkAuth])

    return (
        <Layout>
            <ContributorSignup
                isDao={false}
                discordUserId={state?.discordUserId}
                onboardingStep={state?.onboardingStep}
            />
        </Layout>
    )
}

export default ContributorOnbording

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import ConnectWallet from "../components/ConnectWallet"
import Layout from "../views/Layout"
import { useNavigate } from "react-router"
// import { setAdminStatus, setLoggedIn } from "../store/actions/auth-action"
// import { getAddressMembership } from "../store/actions/gnosis-action"
// import { getRole } from "../store/actions/contibutor-action"
// import { message } from "antd"
import { getSelectedChainId } from "../utils/POCPutils"

const AuthWallet = () => {
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const uuid = useSelector((x) => x.contributor.invite_code)
    const currentChainId = getSelectedChainId()?.chainId
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const afterConnectWalletCallback = async (setAuth) => {
        // dispatch(setLoggedIn(true))
        // if (isAdmin) {
        //     const res = await dispatch(getAddressMembership(currentChainId))
        //     if (res) {
        //         setAuth(false)
        //         navigate(`/dashboard`)
        //     } else {
        //         setAuth(false)
        //         navigate("/onboard/dao")
        //     }
        // } else {
        //     setAuth(false)
        //     if (!isAdmin) {
        //         try {
        //             const res = await dispatch(getRole(uuid))
        //             if (res) {
        //                 message.success("Already a member")
        //                 dispatch(setAdminStatus(true))
        //                 navigate(`/dashboard`)
        //             }
        //         } catch (error) {
        //             message.error("Error on getting role")
        //         }
        //     }
        // }
    }

    return (
        <Layout>
            <ConnectWallet
                isAdmin={isAdmin}
                afterConnectWalletCallback={afterConnectWalletCallback}
            />
        </Layout>
    )
}

export default AuthWallet

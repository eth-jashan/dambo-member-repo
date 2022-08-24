import axios from "axios"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"
import apiClient from "../../utils/api_client"
import { setChainInfoAction } from "../../utils/wagmiHelpers"

export const getAuthToken = async (jwt) => {
    const res = await axios.get(
        "https://staging.api.drepute.xyz/auth/fetch_api_token",
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    )
    if (res.data.success) {
        return res.data.data.data.token
    }
}

export const authWithSign = (address, signer, chainId) => {
    return async (dispatch) => {
        try {
            const responseNonce = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.auth.getNonce}?addr=${address}`
                // `${"https://2eac-106-51-36-15.ngrok.io/dao_tool_server"}${
                //     routes.auth.getNonce
                // }?addr=${address}`
            )
            const signature = await signer.signMessage(
                `Signing in to rep3.gg with nonce ${responseNonce.data.data.nonce}`
            )
            try {
                const data = { addr: address, sig: signature }
                const responseSignature = await apiClient.post(
                    `${process.env.REACT_APP_DAO_TOOL_URL}${routes.auth.getSignature}`,
                    // `${"https://2eac-106-51-36-15.ngrok.io/dao_tool_server"}${
                    //     routes.auth.getSignature
                    // }`,
                    data
                )
                if (responseSignature.data.success) {
                    dispatch(
                        authActions.set_signing({
                            jwt: responseSignature.data.data.token,
                        })
                    )
                    setChainInfoAction(chainId)
                    localStorage.setItem(
                        address,
                        JSON.stringify({
                            jwt: responseSignature.data.data.token,
                            time: new Date(),
                        })
                    )
                    return 1
                }
            } catch (error) {
                return 0
            }
        } catch (error) {
            return 0
        }
    }
}

export const getJwt = (address, jwt) => {
    return async (dispatch) => {
        const jwtInfo = JSON.parse(localStorage.getItem(address))

        if (jwtInfo?.jwt) {
            try {
                const res = await axios.get(
                    // `${"https://2eac-106-51-36-15.ngrok.io/dao_tool_server"}/auth/ping`,
                    `${process.env.REACT_APP_DAO_TOOL_URL}/auth/ping`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtInfo?.jwt || jwt}`,
                        },
                    }
                )

                if (res.data?.success) {
                    dispatch(authActions.set_signing({ jwt: jwtInfo.jwt }))
                    return jwtInfo?.jwt
                } else {
                    localStorage.removeItem(address)
                    dispatch(authActions.set_signing({ jwt: false }))
                    return 0
                }
            } catch (error) {
                localStorage.removeItem(address)
                dispatch(authActions.set_signing({ jwt: false }))
                return 0
            }
        } else {
            localStorage.removeItem(address)
            dispatch(authActions.set_signing({ jwt: false }))
            return 0
        }
    }
}

export const retrieveAddress = () => {
    return (dispatch) => {
        const address = JSON.parse(localStorage.getItem("current_address"))
        if (address) {
            dispatch(authActions.set_address({ address }))
        } else {
            return 0
        }
    }
}

export const setAddress = (address) => {
    return (dispatch) => {
        dispatch(authActions.set_address({ address }))
    }
}

export const setLoggedIn = (status) => {
    return (dispatch) => {
        dispatch(authActions.set_loggedIn({ status }))
    }
}

export const setContriInfo = (name, role) => {
    return (dispatch) => {
        dispatch(authActions.set_contri_setup({ name, role }))
    }
}

export const setAdminStatus = (status) => {
    return (dispatch) => {
        dispatch(authActions.set_admin({ status }))
    }
}

export const signout = () => {
    return (dispatch) => {
        dispatch(authActions.reset_auth())
    }
}

export const getCommunityRole = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}/${routes.dao.getCommunityRole}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                const roles = []
                res.data.data.forEach((item) => {
                    roles.push({ value: item, label: item })
                })

                dispatch(authActions.set_community_roles({ roles }))
            }
        } catch (error) {}
    }
}

export const joinContributor = (id) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        // const role = getState().auth.role
        const contributorName = getState().auth.contributorName

        const data = {
            addr: address,
            name: contributorName,
            // community_role: "CONTRIBUTOR",
            // discord_user_id: "discordUserId",
        }

        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.joinContributor}/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                dispatch(contributorAction.set_discord({ status: false }))
                return 1
            } else {
                return 0
            }
        } catch (error) {
            return 0
        }
    }
}

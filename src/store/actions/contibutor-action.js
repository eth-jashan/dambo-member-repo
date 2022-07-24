// import axios from "axios"
import { ethers } from "ethers"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"

import apiClient from "../../utils/api_client"

export const set_invite_id = (id) => {
    return (dispatch) => {
        dispatch(contributorAction.set_invite_code({ id }))
    }
}

export const getContributionAsContributorApproved = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib`}?dao_uuid=${uuid}&contributor=1&voucher=1`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                const approvedContribution = []
                res.data.data.contributions.forEach((x) => {
                    if (x.voucher_id) {
                        approvedContribution.push(x)
                    }
                })
                dispatch(
                    contributorAction.set_contributor_contribution_approved({
                        approved: approvedContribution,
                        // pending: pendingContribution,
                    })
                )
            } else {
                return false
            }
        } catch (error) {
            dispatch(
                contributorAction.set_contributor_schema({
                    schema: [],
                    id: 0,
                })
            )
        }
    }
}

export const getRole = (uuid) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const data = {
            uuid,
            wallet_addr: address,
        }
        const res = await apiClient.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getRole}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res.data.success) {
            if (res.data.data.role === "NO_ROLE") {
                return false
            } else {
                return res.data.data.role
            }
        } else {
            return false
        }
    }
}

export const getDiscordOAuth = (code) => {
    return (dispatch) => {
        const data = JSON.parse(localStorage.getItem("discord"))
        if (data) {
            dispatch(authActions.set_address({ address: data.address }))
            dispatch(authActions.set_signing({ jwt: data.jwt }))
            dispatch(contributorAction.set_invite_code({ id: data.id }))
            dispatch(authActions.set_admin({ status: false }))
            dispatch(authActions.set_loggedIn({ status: true }))
            dispatch(contributorAction.set_discord({ status: code }))
            return 1
        } else {
            dispatch(authActions.set_admin({ status: false }))
            return 0
        }
    }
}

export const getDiscordUserId = (grant_code, redirect_uri) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const res = await apiClient.get(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.discord.userId}?discord_code=${grant_code}&redirect_uri=${redirect_uri}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res.data.success) {
            return res.data.data.discord_user_id
        } else {
            return null
        }
    }
}

export const raiseContributionRequest = (
    membership_id,
    // signed_voucher,
    details
) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const uuid = getState().dao.currentDao?.uuid
        const contrib_schema_id = getState().contributor.contributorSchemaId
        console.log("contributor", contrib_schema_id, details)
        const data = {
            created_for: address,
            request: true,
            dao_uuid: uuid,
            membership_id,
            contrib_schema_id: 2,
            details,
        }
        console.log("data", data)
        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${`/contrib`}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
}

export const createContributionBadgeSchema = (schemaArray, id) => {
    return async (dispatch, getState) => {
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt

        const data = {
            dao_uuid: uuid,
            schema: schemaArray,
            version: 1,
        }
        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createSchema}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.success) {
                dispatch(
                    contributorAction.set_contributor_schema({
                        schema: schemaArray,
                        id,
                    })
                )
                return 1
            } else {
                dispatch(
                    contributorAction.set_contributor_schema({
                        schema: [],
                        id: 0,
                    })
                )
                return 0
            }
        } catch (error) {
            console.log("error, on schema creation", error)
        }
    }
}

export const setContributionDetail = (item) => {
    return (dispatch) => {
        dispatch(contributorAction.set_contribution_detail({ item }))
    }
}

export const setDaoName = (name) => {
    return (dispatch) => {
        dispatch(contributorAction.setDaoName({ name }))
    }
}

export const actionOnGenerateSchemaModal = (status) => {
    return (dispatch) => {
        dispatch(contributorAction.set_schema_modal({ status }))
    }
}

export const successConfirmationModal = (status) => {
    return (dispatch) => {
        dispatch(contributorAction.set_success_modal({ status }))
    }
}

export const actionOnContributionRequestModal = (status) => {
    return (dispatch) => {
        dispatch(contributorAction.set_contribution_badge_modal({ status }))
    }
}

export const getContributorNounce = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/membership/get_contrib_schema`}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
}

export const createContributionVouchers = (
    membership_id,
    signed_voucher,
    details
) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const uuid = getState().dao.currentDao?.uuid
        const contrib_schema_id = getState().contributor.contributorSchemaId
        console.log("contributor", contrib_schema_id, details)
        const data = {
            created_for: address,
            request: false,
            dao_uuid: uuid,
            membership_id,
            contrib_schema_id: 2,
            signed_voucher,
            details,
        }
        console.log("data", data)
        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${`/contrib`}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
}

export const getContributionSchema = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/get_contrib_schema`}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                dispatch(
                    contributorAction.set_contributor_schema({
                        schema: res.data.data.schema,
                        id: res.data.data.version,
                    })
                )
            } else {
                return false
            }
        } catch (error) {
            dispatch(
                contributorAction.set_contributor_schema({
                    schema: [],
                    id: 0,
                })
            )
        }
    }
}

export const setContributionSelection = (contribution) => {
    return (dispatch) => {
        dispatch(contributorAction.set_contribution_selection({ contribution }))
    }
}

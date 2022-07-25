// import axios from "axios"
import { ethers } from "ethers"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"

import apiClient from "../../utils/api_client"
import { claimContributionBadge } from "../../utils/POCPServiceSdk"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
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
                dispatch(
                    contributorAction.set_contributor_contribution_approved({
                        approved: res.data.data.contributions,
                    })
                )
                dispatch(
                    contributorAction.set_contribution_counts({
                        contribution_counts: res.data.data.counts,
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

export const getContributionAsAdmin = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib`}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                const pendingContribution = []

                res.data.data.contributions.forEach((x) => {
                    if (x.status === "REQUESTED" && !x.payout_status) {
                        pendingContribution.push(x)
                    } else if (x.status === "APPROVED") {
                        if (!x.voucher_id && x?.mint_badge) {
                            dispatch(
                                daoAction.add_approved_badges({
                                    contribution: x,
                                })
                            )
                        }
                        if (x.tokens.length > 0 && !x.payout_status) {
                            dispatch(
                                tranactionAction.set_approved_request({
                                    item: {
                                        contri_detail: x,
                                        payout: x.tokens,
                                        feedback: x.feedback,
                                    },
                                })
                            )
                        }
                    }
                })
                dispatch(
                    contributorAction.set_admin_contribution({
                        contribution: pendingContribution,
                    })
                )
            } else {
                return false
            }
        } catch (error) {
            dispatch(
                contributorAction.set_admin_contribution({
                    contribution: [],
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

export const raiseContributionRequest = (membership_id, details) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const uuid = getState().dao.currentDao?.uuid
        const contrib_schema_id = getState().contributor.contributorSchemaId
        console.log("contributor", contrib_schema_id, details)
        const data = {
            created_for: address,
            request: 1,
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

export const getContributorNounce = (membershipId) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/membership/get_next_nonce?`}?token_id=${membershipId}&dao_uuid=${uuid}`,
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

export const updateContributionVoucher = (
    signed_voucher,
    contribution_uuids
) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const data = { dao_uuid: uuid, signed_voucher, contribution_uuids }
        try {
            await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${`/contrib/voucher`}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
        } catch (error) {}
    }
}

// export const contributionBadgeClaim = (
//     contributionId,
//     memberTokenId,
//     approveIndex,
//     hashCallbackFn,
//     callbackOnSuccess
// ) => {
//     return async (dispatch, getState) => {
//         const jwt = getState().auth.jwt
//         const uuid = getState().dao.currentDao?.uuid
//         const proxyContract = getState().dao.daoProxyAddress
//         // /contrib/voucher
//         try {
//             const res = await apiClient.get(
//                 `${
//                     process.env.REACT_APP_DAO_TOOL_URL
//                 }${`/contrib/voucher`}?contribution_uuid=${contributionId}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${jwt}`,
//                     },
//                 }
//             )
//             if (res.data.success) {
//                 // return res.data
//                 console.log("Voucher", res.data.data)
//                 // await claimContributionBadge(
//                 //     proxyContract,
//                 //     "voucher",
//                 //     memberTokenId,
//                 //     approveIndex,
//                 //     hashCallbackFn,
//                 //     callbackOnSuccess
//                 // )
//             } else {
//                 // return false
//             }
//         } catch (error) {
//             return false
//         }
//     }
// }

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
        console.log("contributor", contrib_schema_id, signed_voucher)
        const data = {
            created_for: address,
            request: false,
            dao_uuid: uuid,
            membership_id,
            contrib_schema_id: 2,
            signed_voucher,
            details,
        }
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

export const getPendingContributions = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib`}?dao_uuid=${uuid}&contributor=1`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                dispatch(
                    contributorAction.set_contributor_contribution_pending({
                        pending: res.data.data.contributions,
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

export const getPastContributions = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/past_contribs`}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                dispatch(
                    contributorAction.set_contributor_contribution_past({
                        past: res.data.data.contributions,
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

export const contributionBadgeClaim = (
    contributionUuid,
    memberTokenId,
    callbackOnSuccess,
    contributions
) => {
    return async (dispatch, getState) => {
        console.log("in contributionBadgeClaim")
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const proxyContract = getState().dao.daoProxyAddress
        // /contrib/voucher
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/voucher`}?contribution_uuid=${contributionUuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                // return res.data
                console.log("Voucher", res.data.data, memberTokenId)
                const tokens =
                    res.data?.data?.signed_voucher?.tokenUri?.split(",")
                console.log("tokens are", tokens)
                const approveIndexes = []
                contributions.forEach((contribution) => {
                    if (contribution.isChecked) {
                        approveIndexes.push(
                            tokens.indexOf(contribution?.metadata_hash)
                        )
                    }
                })
                console.log("approve Indexes", approveIndexes)
                const hashCallbackFn = (x) => {
                    console.log("hash callback", x)
                    dispatch(
                        sendClaimTxHash(
                            x,
                            memberTokenId,
                            approveIndexes,
                            contributions[0].voucher_uuid
                        )
                    )
                }

                console.log(
                    "contract voucher info",
                    proxyContract,
                    res.data?.data?.signed_voucher,
                    memberTokenId,
                    approveIndexes,
                    hashCallbackFn,
                    callbackOnSuccess
                )

                await claimContributionBadge(
                    proxyContract,
                    res.data?.data?.signed_voucher,
                    memberTokenId,
                    approveIndexes,
                    hashCallbackFn,
                    callbackOnSuccess
                )
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }
}

export const rejectContributionVoucher = (token_id, voucher_uuid) => {
    return async (dispatch, getState) => {
        console.log("in contributionBadgeClaim")
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.post(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/reject_voucher`}`,
                {
                    dao_uuid: uuid,
                    token_id,
                    voucher_uuid,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                console.log("res", res.data)
                dispatch(getContributionAsContributorApproved())
            }
        } catch (err) {
            console.error("err", err)
            return false
        }
    }
}

export const sendClaimTxHash = (
    tx_hash,
    membership_token_id,
    claimed_indexes,
    voucher_uuid
) => {
    return async (dispatch, getState) => {
        console.log("in sendClaimTxHash")
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.post(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/update/voucher`}`,
                {
                    dao_uuid: uuid,
                    voucher_uuid,
                    tx_hash,
                    membership_token_id,
                    claimed_indexes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                console.log("res", res.data)
                dispatch(getContributionAsContributorApproved())
            }
        } catch (err) {
            console.error("err", err)
            return false
        }
    }
}

export const setClaimLoading = (claimLoading) => {
    return async (dispatch, getState) => {
        dispatch(contributorAction.setClaimLoading({ claimLoading }))
    }
}

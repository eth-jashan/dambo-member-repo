// import axios from "axios"
import { ethers } from "ethers"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"

import apiClient from "../../utils/api_client"
import {
    claimContributionBadge,
    getAllMembershipBadges,
} from "../../utils/POCPServiceSdk"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
import { useSelector } from "react-redux"
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
                        count: res.data.data.contributions.length,
                    })
                )
            } else {
                return false
            }
        } catch (error) {
            dispatch(
                contributorAction.set_admin_contribution({
                    contribution: [],
                    count: 0,
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
        // const contrib_schema_id = getState().contributor.contributorSchemaId
        const data = {
            created_for: address,
            request: 1,
            dao_uuid: uuid,
            membership_id,
            contrib_schema_id: 1,
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

export const createContributionBadgeSchema = (schemaArray, id) => {
    return async (dispatch, getState) => {
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt

        const data = {
            dao_uuid: uuid,
            schema: schemaArray,
            version: id,
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
            console.error("error, on schema creation", error)
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

export const actionOnBadgesModal = (status) => {
    return (dispatch) => {
        dispatch(contributorAction.set_badges_mint_modal({ status }))
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

export const badgeSelectionMember = (address) => {
    return (dispatch) => {
        dispatch(contributorAction.set_badges_mint_address({ address }))
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

export const createContributionVouchers = (
    address,
    signed_voucher,
    details,
    metadata_hash
) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        // const address = getState().auth.address
        const uuid = getState().dao.currentDao?.uuid
        const contrib_schema_id = getState().contributor.contributorSchemaId
        const data = {
            created_for: address,
            request: false,
            dao_uuid: uuid,
            contrib_schema_id,
            signed_voucher,
            details,
            metadata_hash,
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

export const getPastContributions = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const address = getState().auth.address

        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.pastContributions}?dao_uuid=${uuid}&addr=${address}`,
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
                return res.data.data.contributions
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
                const tokens =
                    res.data?.data?.signed_voucher?.tokenUri?.split(",")
                const approveIndexes = []
                contributions.forEach((contribution) => {
                    if (contribution.isChecked) {
                        approveIndexes.push(
                            tokens.indexOf(contribution?.metadata_hash)
                        )
                    }
                })
                console.log("approve indexes", approveIndexes)
                console.log("member token Id", memberTokenId)

                const hashCallbackFn = (x) => {
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
                    "claiming badge",
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

export const rejectContributionVoucher = (
    token_id,
    voucher_uuid,
    contributions
) => {
    return async (dispatch, getState) => {
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
                // dispatch(getContributionAsContributorApproved())
                dispatch(removeClaimedContributionVoucher(contributions, true))
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

export const removeClaimedContributionVoucher = (
    claimedContributions,
    isReject
) => {
    return async (dispatch, getState) => {
        const approvedContributions =
            getState().contributor.contributionForContributorApproved

        const remainingContributionsInVoucher = claimedContributions.filter(
            (ele) => !ele.isChecked
        )

        const voucher = approvedContributions?.[0]
        const tempApprovedContributions = approvedContributions?.map((ele) => ({
            ...ele,
        }))
        //
        if (remainingContributionsInVoucher.length && !isReject) {
            for (const key in voucher) {
                if (voucher?.[key]?.contributions?.length) {
                    tempApprovedContributions[0][key].contributions =
                        remainingContributionsInVoucher
                }
            }
            dispatch(
                contributorAction.set_contributor_contribution_approved({
                    approved: tempApprovedContributions,
                })
            )
        } else {
            dispatch(
                contributorAction.set_contributor_contribution_approved({
                    approved: approvedContributions?.slice(1) || [],
                })
            )
        }
    }
}

export const getContributorStats = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const address = getState().auth.address
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/contrib/stats`}?dao_uuid=${uuid}&addr=${address}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                dispatch(
                    contributorAction.setContributorStats({
                        stats: res.data.data,
                    })
                )
            } else {
                return false
            }
        } catch (error) {
            // dispatch(
            //     contributorAction.set_contributor_schema({
            //         schema: [],
            //         id: 0,
            //     })
            // )
        }
    }
}

const wait = function (ms = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
export const getPastContributionsPolled = () => {
    return async (dispatch, getState) => {
        const pastContributionsCount =
            getState().contributor.contributionForContributorPast.length

        let pastContributions = await dispatch(getPastContributions())
        console.log(
            "result befoire while",
            pastContributions.length,
            pastContributionsCount
        )
        while (pastContributions.length <= pastContributionsCount) {
            await wait(2000)
            pastContributions = await dispatch(getPastContributions())
            console.log("result in while", pastContributions)
        }
        dispatch(setPastContributionsSyncing(false))
    }
}

export const setPastContributionsSyncing = (status) => {
    return async (dispatch, getState) => {
        dispatch(
            contributorAction.setPastContributionsSyncing({
                pastContributionsSyncing: status,
            })
        )
    }
}

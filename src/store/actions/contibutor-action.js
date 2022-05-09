// import axios from "axios"
import { ethers } from "ethers"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { contributorAction } from "../reducers/contributor-slice"

import apiClient from "../../utils/api_client"
import { daoAction } from "../reducers/dao-slice"

export const set_invite_id = (id) => {
    return (dispatch) => {
        dispatch(contributorAction.set_invite_code({ id }))
    }
}

export const setDiscordOAuth = (address, id, jwt) => {
    return (dispatch) => {
        localStorage.setItem("discord", JSON.stringify({ address, id, jwt }))
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
            `${api.drepute.dev.BASE_URL}${routes.dao.getRole}`,
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

export const createContributionrequest = (
    title,
    type,
    link,
    time,
    comments
) => {
    return async (dispatch, getState) => {
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt

        const data = {
            dao_uuid: uuid,
            stream: type,
            title,
            description: comments,
            link,
            time_spent: time,
        }
        try {
            const res = await apiClient.post(
                `${api.drepute.dev.BASE_URL}${routes.contribution.createContri}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.success) {
                // //console.log('suucessfully created !')
                return 1
            } else {
                return 0
            }
        } catch (error) {
            // //console.log('error....', error)
        }
    }
}

export const setContributionDetail = (item) => {
    return (dispatch) => {
        dispatch(contributorAction.set_contribution_detail({ item }))
    }
}

export const setBadgesAfterClaim = (
    claimer,
    approver,
    ipfs,
    tokenId,
    communityId
) => {
    return (dispatch, getState) => {
        const claimedToken = getState().contributor.claimed
        const unClaimedToken = getState().contributor.unclaimed
        const newClaimed = claimedToken.concat([
            {
                id: tokenId,
                approver,
                claimer,
                ipfsMetaUri: ipfs,
                community: communityId,
            },
        ])

        dispatch(
            daoAction.set_claimed_badges({
                claimedTokens: newClaimed,
                unclaimed: unClaimedToken.filter(
                    (x) => x.id !== tokenId.toString()
                ),
            })
        )
        dispatch(
            daoAction.set_unclaimed_badges({
                unclaimedToken: unClaimedToken.filter(
                    (x) => x.id !== tokenId.toString()
                ),
            })
        )
    }
}

export const getAllBadges = (address) => {
    return (dispatch, getState) => {
        // let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
        const all_claimed_badge = getState().dao.all_claimed_badge
        const all_approved_badge = getState().dao.all_approved_badge
        // //console.log()
        const communityId = useSelector((x) => x.dao.communityInfo)
        //console.log(all_approved_badge.filter((x) => x.identifier === "235"))
        const cid = getState().dao.contribution_id

        const claimed = all_claimed_badge.filter(
            (x) =>
                ethers.utils.hexlify(x.claimer) ===
                    ethers.utils.hexlify(address) &&
                x?.community?.id === communityId[0]?.id
        )
        const allApproved = all_approved_badge.filter(
            (x) => x?.community?.id === communityId[0]?.id
        )
        const claimed_identifier = []
        const unclaimed = []

        // filtering out current unclaimed token
        allApproved.map((x, i) => {
            const isClaimed = claimed.filter((y) => y.id === x?.id)
            if (isClaimed.length === 0) {
                cid.map((y, index) => {
                    if (y.id.toString() === x.identifier) {
                        unclaimed.push(x)
                    }
                })
            }
            claimed.filter((z) => {
                if (x.id === z.id) {
                    claimed_identifier.push({ ...z, identifier: x?.identifier })
                }
            })
        })

        dispatch(
            contributorAction.set_badges({
                claimed: claimed_identifier,
                unclaimed,
            })
        )
    }
}

export const setClaimLoading = (status, id) => {
    return (dispatch) => {
        dispatch(contributorAction.set_claim_loading({ status, id }))
    }
}

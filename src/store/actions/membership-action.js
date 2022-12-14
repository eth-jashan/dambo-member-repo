import apiClient from "../../utils/api_client"
import routes from "../../constant/routes"
import {
    claimVoucher,
    getMembershipBadgeFromTxHash,
    getAllMembershipBadges,
    createMembershipVoucher,
} from "../../utils/POCPServiceSdk"
import { membershipAction } from "../reducers/membership-slice"
import { toastAction } from "../reducers/toast-slice"
import { getAllDaowithAddress } from "./dao-action"

export const getAllMembershipBadgesList = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.getMembershipBadgesList}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            dispatch(
                membershipAction.setMembershipBadges({
                    membershipBadges: res?.data?.data?.memberships,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const getAllMembershipVouchers = (claimer) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}/membership/get_vouchers?dao_uuid=${uuid}&addr=${claimer}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            return res?.data?.data
        } catch (err) {
            console.error(err)
            return 0
        }
    }
}

export const getAllDaoMembers = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${"/dao/contributors"}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            dispatch(
                membershipAction.setDaoMembers({
                    allDaoMembers: res?.data?.data,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}
export const setAllDaoMember = (allDaoMembers) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${"/dao/contributors"}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            dispatch(
                membershipAction.setDaoMembers({
                    allDaoMembers,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}
export const getMembershipVoucher = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.getMembershipVoucher}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            dispatch(
                membershipAction.setMembershipVoucher({
                    membershipVoucher: res?.data?.data,
                })
            )
            if (res.data?.data?.length) {
                return 1
            }
            return 0
        } catch (err) {
            console.error(err)
            return 0
        }
    }
}

const poll = async function (fn, fnCondition, ms) {
    let result = await fn()
    while (fnCondition(result)) {
        await wait(ms)
        result = await fn()
    }
    return result
}

const wait = function (ms = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const claimMembershipVoucher = (membershipVoucherInfo, chainId) => {
    return async (dispatch, getState) => {
        const proxyContract = getState().dao.daoProxyAddress
        try {
            const claimerAddress = getState().auth.address
            const currentDao = getState().dao.currentDao
            // console.log(
            //     "claiming voucher",
            //     proxyContract,
            //     JSON.stringify(membershipVoucherInfo)
            // )
            await claimVoucher(
                proxyContract,
                membershipVoucherInfo?.signed_voucher,
                membershipVoucherInfo?.voucher_address_index,
                currentDao?.uuid,
                async (x) => {
                    dispatch(updateTxHash(x, "claim", null, chainId))
                },
                async (x) => {
                    const fetchNFT = () =>
                        getMembershipBadgeFromTxHash(
                            x.transactionHash,
                            currentDao?.uuid
                        )
                    const validate = (result) =>
                        !result?.data?.membershipNFTs?.length

                    dispatch(setTxHashFetched(true))

                    dispatch(
                        setClaimMembershipLoading({
                            status: true,
                            membership_uuid: membershipVoucherInfo.uuid,
                        })
                    )

                    dispatch(setShowMetamaskSignText(false))

                    dispatch(
                        setClaimTakingTime({
                            claimText:
                                "Takes around 20sec, please don???t leave the page",
                            claimColor: "#fff",
                        })
                    )

                    setTimeout(() => {
                        dispatch(
                            setClaimTakingTime({
                                claimText:
                                    "Oops, polygon seems to be a bit slow at the moment, please give it a bit longer",
                                claimColor: "#FFB22E",
                            })
                        )
                    }, 30000)

                    setTimeout(() => {
                        dispatch(
                            setClaimTakingTime({
                                claimText:
                                    "It???s taking longer than expected. Why not have some water in the mean time? ???? ",
                                claimColor: "#FF6262",
                            })
                        )
                    }, 90000)

                    const response = await poll(fetchNFT, validate, 3000)
                    const membershipNFT = response?.data?.membershipNFTs?.[0]
                    dispatch(
                        setMembershipBadgeClaimed({
                            ...membershipVoucherInfo,
                            contractAddress: membershipNFT?.contractAddress,
                            tokenID: membershipNFT?.tokenID,
                        })
                    )
                    dispatch(
                        getAllMembershipBadgesForAddress(
                            claimerAddress,
                            proxyContract
                        )
                    )
                    dispatch(
                        setClaimMembershipLoading({
                            status: false,
                            membership_uuid: null,
                        })
                    )
                    dispatch(setDisableClaimBtn(false))
                    // dispatch(getAllDaowithAddress(chainId))
                }
            )
            return 1
        } catch (err) {
            console.error("claiming signing error", err)
            dispatch(
                setClaimMembershipLoading({
                    status: false,
                    membership_uuid: null,
                })
            )
            dispatch(setClaimTakingTime(false))
            dispatch(setDisableClaimBtn(false))
            return 0
        }
    }
}

export const getAllMembershipBadgesForAddress = () => {
    return async (dispatch, getState) => {
        const proxyContract = getState().dao.daoProxyAddress
        const address = getState().auth.address
        const currentDao = getState().dao.currentDao
        const membershipVoucher = getState().membership.membershipVoucher
        const membership = getState().membership.membershipBadges

        try {
            const membershipBadges = await getAllMembershipBadges(
                address,
                proxyContract,
                currentDao?.uuid
            )

            dispatch(
                membershipAction.setMembershipBadgesForAddress({
                    membershipBadgesForAddress:
                        membershipBadges?.data?.membershipNFTs,
                })
            )
            if (membershipBadges?.data?.membershipNFTs.length > 0) {
                dispatch(
                    membershipAction.setMembershipUnclaimed({
                        unclaimedMembership: [],
                    })
                )
            } else {
                const vouchers = []

                membershipVoucher.forEach((x, i) => {
                    membership.forEach((badges, index) => {
                        if (x.membership_uuid === badges.uuid) {
                            vouchers.push({ ...x, ...badges })
                        }
                    })
                })

                dispatch(
                    membershipAction.setMembershipUnclaimed({
                        unclaimedMembership: vouchers,
                    })
                )
            }
        } catch (err) {
            console.error(err)
        }
    }
}

export const setMembershipBadgeClaimed = (membershipBadgeClaimed) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setMembershipBadgeClaimed({
                    membershipBadgeClaimed,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setClaimMembershipLoading = (loadingStatus) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setClaimMembershipLoading({
                    claimMembershipLoading: loadingStatus,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setClaimTakingTime = (claimTakingTimeInfo) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setClaimTakingTime({
                    claimTakingTime: claimTakingTimeInfo,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setDisableClaimBtn = (status) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setDisableClaimBtn({
                    disableClaimBtn: status,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setShowMetamaskSignText = (status) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setShowMetamaskSignText({
                    showMetamaskSignText: status,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setTxHashFetched = (status) => {
    return async (dispatch, getState) => {
        try {
            dispatch(
                membershipAction.setTxHashFetched({
                    txHashFetched: status,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const createMembershipBadges = (formData, memberships, isEditing) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const response = await apiClient.post(
                // `${process.env.REACT_APP_ARWEAVE_SERVER}${routes.arweave.membership}`,
                `https://test-staging.api.drepute.xyz/arweave_server/membership`,
                formData
            )
            if (response?.data?.success) {
                const arweaveHashArray = response.data?.data
                let arweaveArrayIndex = 0

                const membershipsUpdated = memberships.map(
                    (membership, index) => {
                        const image_url = membership?.file
                            ? arweaveHashArray[arweaveArrayIndex].media
                            : membership?.image_url

                        const metadata_hash = membership?.file
                            ? arweaveHashArray[arweaveArrayIndex].metadata
                            : membership?.metadata_hash

                        if (membership?.file) {
                            arweaveArrayIndex = arweaveArrayIndex + 1
                        }

                        const returnObj = {
                            description: membership.description,
                            image_url,
                            metadata_hash,
                            level: membership?.level || index + 1,
                            category: 1,
                            is_video: false,
                            name: membership.name,
                        }

                        if (isEditing && membership.uuid) {
                            returnObj.uuid = membership.uuid
                        }

                        return returnObj
                    }
                )

                let res
                if (isEditing) {
                    const oldMemberships = membershipsUpdated.filter(
                        (ele) => ele.uuid
                    )
                    const newMemberships = membershipsUpdated.filter(
                        (ele) => !ele.uuid
                    )
                    res = await apiClient.put(
                        `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.createMembershipBadges}`,
                        {
                            dao_uuid: uuid,
                            memberships: oldMemberships,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                    if (newMemberships?.length) {
                        res = await apiClient.post(
                            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.createMembershipBadges}`,
                            {
                                dao_uuid: uuid,
                                memberships: newMemberships,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${jwt}`,
                                },
                            }
                        )
                    }
                } else {
                    res = await apiClient.post(
                        `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.createMembershipBadges}`,
                        {
                            dao_uuid: uuid,
                            memberships: membershipsUpdated,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                }
                if (res.data.success) {
                    setMembershipCreateLoading(false)
                    dispatch(
                        toastAction.setToastInfo({
                            toastInfo: {
                                content: isEditing
                                    ? "Updated successfully"
                                    : "Created successfully",
                                toastType: "success",
                            },
                        })
                    )
                    dispatch(toastAction.setShowToast({ status: true }))
                    dispatch(getAllMembershipBadgesList())
                    dispatch(setShowMembershipCreateModal(false))
                }
            }
            // dispatch(showDefaultToastError())
        } catch (err) {
            console.error(err)
            dispatch(showDefaultToastError())
        }
    }
}

const showDefaultToastError = () => {
    return (dispatch) => {
        dispatch(
            toastAction.setToastInfo({
                toastInfo: {
                    content: "Something went wrong please try again",
                    toastType: "error",
                },
            })
        )
        dispatch(toastAction.setShowToast({ status: true }))
    }
}

export const setSelectedMember = (member) => {
    return (dispatch) => {
        dispatch(
            membershipAction.setSelectedMember({
                selectedMember: member,
            })
        )
    }
}

export const getSelectedMemberContributions = (memberAddress) => {
    return async (dispatch, getState) => {
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt

        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.pastContributions}?dao_uuid=${uuid}&addr=${memberAddress}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res?.data?.success) {
                const contributions = res.data.data.contributions
                const approvedContributions = contributions?.filter(
                    (ele) => ele.status === "APPROVED"
                )
                dispatch(
                    membershipAction.setSelectedMemberPastContributions({
                        selectedMemberPastContributions: approvedContributions,
                    })
                )
            }
        } catch (err) {
            console.error(err)
            dispatch(
                membershipAction.setSelectedMemberPastContributions({
                    selectedMemberPastContributions: [],
                })
            )
        }
    }
}

export const getCommunityMembers = () => {
    return async (dispatch, getState) => {
        const res = await apiClient.get(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.getCommunityMembers}`
        )
        if (res?.data?.success) {
            dispatch(
                membershipAction.setCommunityMembers({
                    communityMembers: res.data.communityMembers,
                })
            )
        }
    }
}

export const setSelectedNav = (selectedNav) => {
    return async (dispatch) => {
        dispatch(
            membershipAction.setSelectedNav({
                selectedNav,
            })
        )
    }
}

export const setShowMembershipChangeModal = (showMembershipChangeModal) => {
    return async (dispatch) => {
        dispatch(
            membershipAction.setShowMembershipChangeModal({
                showMembershipChangeModal,
            })
        )
    }
}

export const setMembershipCreateLoading = (membershipCreateLoading) => {
    return (dispatch) => {
        dispatch(
            membershipAction.setMembershipCreateLoading({
                membershipCreateLoading,
            })
        )
    }
}

export const setShowMembershipCreateModal = (showMembershipCreateModal) => {
    return (dispatch) => {
        dispatch(
            membershipAction.setShowMembershipCreateModal({
                showMembershipCreateModal,
            })
        )
    }
}

export const setShowMembershipMintingModal = (showMembershipMintingModal) => {
    return (dispatch) => {
        dispatch(
            membershipAction.setShowMembershipMintingModal({
                showMembershipMintingModal,
            })
        )
    }
}

export const mintBadges = (selectedMembershipBadge, addresses) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const proxyContract = getState().dao.daoProxyAddress
        const mapArr = addresses.reduce(
            (acc, curr) => {
                if (acc[acc.length - 1].length < 24) {
                    acc[acc.length - 1].push(curr)
                } else {
                    acc.push([curr])
                }
                return acc
            },
            [[]]
        )

        try {
            const mapArrWithSignedVoucher = await Promise.all(
                mapArr.map(async (ele) => {
                    // eslint-disable-next-line no-useless-catch
                    try {
                        const signedObject = await createMembershipVoucher(
                            proxyContract,
                            [selectedMembershipBadge?.level],
                            [selectedMembershipBadge?.category],
                            [],
                            ele,
                            `${selectedMembershipBadge?.metadata_hash},`,
                            uuid
                        )
                        return {
                            addresses: [...ele],
                            signed_voucher: signedObject,
                        }
                    } catch (error) {
                        throw error
                    }
                })
            )

            const arrWithApiCall = mapArrWithSignedVoucher.map((ele) =>
                apiClient.post(
                    `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.createMembershipVoucher}`,
                    {
                        addresses: ele.addresses,
                        signed_voucher: ele.signed_voucher,
                        membership_uuid: selectedMembershipBadge?.uuid,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                )
            )

            const res = await Promise.all(arrWithApiCall)
            if (res.data?.success) {
                dispatch(
                    toastAction.setToastInfo({
                        toastInfo: {
                            content: "Created successfully",
                            toastType: "success",
                        },
                    })
                )
                dispatch(toastAction.setShowToast({ status: true }))
            }
        } catch (err) {}
    }
}

export const updateTxHash = (txnHash, type, prevHash, chainId) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = await provider.getSigner()
        // const chainId = await signer.getChainId()
        const currentDao = getState().dao.currentDao
        const data = {
            txn_hash: txnHash,
            chain_id: chainId === 4 ? "80001" : "137",
            prev_txn_hash: type === "claim" ? null : prevHash,
            type,
            dao_uuid: currentDao?.uuid,
        }
        try {
            const res = apiClient.post(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${"/membership/membership_txn"}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            return 1
        } catch (error) {
            console.error("err", error)
            return 0
        }
    }
}

export const getAddressVouchers = (address) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.unclaimedVouchers}?addr=${address}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data?.success) {
                if (res.data?.data) {
                    dispatch(
                        membershipAction.setUnclaimedMembershipVouchersForAddress(
                            {
                                unclaimedMembershipVouchersForAddress:
                                    res.data.data,
                            }
                        )
                    )
                    return 1
                }
            }
            return 0
        } catch (error) {
            console.error("err", error)
            return 0
        }
    }
}

export const setMembershipBadgesForAddress = (membershipBadgesForAddress) => {
    return async (dispatch, getState) => {
        dispatch(
            membershipAction.setMembershipBadgesForAddress({
                membershipBadgesForAddress,
            })
        )
    }
}

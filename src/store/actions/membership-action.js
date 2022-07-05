import apiClient from "../../utils/api_client"
import routes from "../../constant/routes"
import {
    claimVoucher,
    getMembershipBadgeFromTxHash,
    getAllMembershipBadges,
    createMembershipVoucher,
} from "../../utils/POCPServiceSdk"
import { web3 } from "../../constant/web3"
import { membershipAction } from "../reducers/membership-slice"
import { toastAction } from "../reducers/toast-slice"
import { ethers } from "ethers"

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
            console.log("res.data is", res.data)
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
            console.log("res.data is", res.data)
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
            console.log("res.data is", res.data)
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
    console.log("result of polling fn", result)
    while (fnCondition(result)) {
        await wait(ms)
        result = await fn()
        console.log("result in while loop", result)
    }
    return result
}

const wait = function (ms = 1000) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const claimMembershipVoucher = (membershipVoucherInfo) => {
    return async (dispatch, getState) => {
        const proxyContract = getState().dao.daoProxyAddress
        try {
            const claimerAddress = getState().auth.address
            console.log(
                "claiming voucher",
                proxyContract,
                JSON.stringify(membershipVoucherInfo)
            )
            await claimVoucher(
                proxyContract,
                membershipVoucherInfo?.signed_voucher,
                membershipVoucherInfo?.voucher_address_index,
                async (x) => {
                    console.log("Tx emitted is", x)
                    dispatch(updateTxHash(x, "claim"))
                },
                async (x) => {
                    console.log("event emitted is", x)
                    const fetchNFT = () =>
                        getMembershipBadgeFromTxHash(x.transactionHash)
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
                                "Takes around 20sec, please don’t leave the page",
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
                                    "It’s taking longer than expected. Why not have some water in the mean time? 🚰 ",
                                claimColor: "#FF6262",
                            })
                        )
                    }, 90000)

                    const response = await poll(fetchNFT, validate, 3000)
                    console.log("fetched the badge", response)
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
                            web3.contractAddress
                        )
                    )
                    dispatch(
                        setClaimMembershipLoading({
                            status: false,
                            membership_uuid: null,
                        })
                    )
                    dispatch(setDisableClaimBtn(false))
                }
            )
            return 1
        } catch (err) {
            console.log("claiming signing error", err)
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

export const getAllMembershipBadgesForAddress = (address) => {
    return async (dispatch, getState) => {
        const proxyContract = getState().dao.daoProxyAddress
        console.log("Claim check!!", proxyContract, address)
        try {
            const membershipBadges = await getAllMembershipBadges(
                address,
                proxyContract
            )
            console.log(
                "membership badges are ",
                proxyContract,
                membershipBadges?.data?.membershipNFTs
            )
            dispatch(
                membershipAction.setMembershipBadgesForAddress({
                    membershipBadgesForAddress:
                        membershipBadges?.data?.membershipNFTs,
                })
            )
        } catch (err) {
            console.error(err)
        }
    }
}

export const setMembershipBadgeClaimed = (membershipBadgeClaimed) => {
    return async (dispatch, getState) => {
        try {
            console.log(
                "dispatching set membership badge claimed with ",
                membershipBadgeClaimed
            )
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
                `${process.env.REACT_APP_ARWEAVE_SERVER}${routes.arweave.membership}`,
                // `http://localhost:3000/arweave_server/membership`,
                formData
            )
            console.log("response is ", response.data)
            if (response?.data?.success) {
                const arweaveHashArray = response.data?.data
                let arweaveArrayIndex = 0

                const membershipsUpdated = memberships.map(
                    (membership, index) => {
                        const image_url = membership?.file
                            ? arweaveHashArray[index].media
                            : membership?.image_url

                        const metadata_hash = membership?.file
                            ? arweaveHashArray[index].metadata
                            : membership?.metadata_hash

                        if (membership?.file) {
                            arweaveArrayIndex = arweaveArrayIndex + 1
                        }

                        return {
                            // level:membership.level,
                            description: membership.description,
                            image_url,
                            metadata_hash,
                            level: membership?.level || index + 1,
                            category: 1,
                            is_video: false,
                            name: membership.name,
                        }
                    }
                )
                let res
                if (isEditing) {
                    res = await apiClient.put(
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
        // const uuid = getState().dao.currentDao?.uuid
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
                    console.log(ele, selectedMembershipBadge?.metadata_hash)
                    // eslint-disable-next-line no-useless-catch
                    try {
                        const signedObject = await createMembershipVoucher(
                            proxyContract,
                            [selectedMembershipBadge?.level],
                            [selectedMembershipBadge?.category],
                            [],
                            ele,
                            `${selectedMembershipBadge?.metadata_hash},`
                        )
                        console.log("member", JSON.stringify(signedObject))
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

export const updateTxHash = (txnHash, type, prevHash) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const chainId = await signer.getChainId()
        const data = {
            txn_hash: txnHash,
            chain_id: 137,
            prev_txn_hash: type === "claim" ? null : prevHash,
            type,
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
            console.log("res", res)
            return 1
        } catch (error) {
            return 0
        }
    }
}

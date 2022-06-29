import apiClient from "../../utils/api_client"
import routes from "../../constant/routes"
import {
    claimVoucher,
    getMembershipBadgeFromTxHash,
    getAllMembershipBadges,
} from "../../utils/POCPServiceSdk"
import { web3 } from "../../constant/web3"
import { membershipAction } from "../reducers/membership-slice"
import { toastAction } from "../reducers/toast-slice"

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
        try {
            const claimerAddress = getState().auth.address
            console.log("claiming voucher")
            await claimVoucher(
                web3.contractAddress,
                membershipVoucherInfo?.signed_voucher,
                membershipVoucherInfo?.voucher_address_index,
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
                    // const metadata = await axios.get(
                    //     // response?.data?.membershipNFTs?.[0]?.metadataUri
                    //     "http://arweave.net/Gtv0Tn-hW52C_9nIWDs6PM_gwKWsXbsqHoF8b4WzxGI"
                    // )
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

export const getAllMembershipBadgesForAddress = (address, contractAddress) => {
    return async (dispatch, getState) => {
        try {
            const membershipBadges = await getAllMembershipBadges(
                address,
                contractAddress
            )
            console.log(
                "membership badges are ",
                membershipBadges,
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

export const createMembershipBadges = (memberships, formData) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid

        try {
            const response = await apiClient.post(
                `http://localhost:3001/arweave_server/membership`,
                {
                    media: formData,
                    name: "test",
                }
            )
            console.log("response is ", response.data)
            if (response?.data?.success) {
                // const res = await apiClient.post(
                //     `${process.env.REACT_APP_DAO_TOOL_URL}${routes.membership.createMembershipBadges}`,
                //     {
                //         dao_uuid: uuid,
                //         memberships,
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${jwt}`,
                //         },
                //     }
                // )
                // if (res.data.success) {
                //     dispatch(
                //         toastAction.setToastInfo({
                //             toastInfo: {
                //                 content: "Created successfully",
                //                 toastType: "success",
                //             },
                //         })
                //     )
                //     dispatch(toastAction.setShowToast({ status: true }))
                //     dispatch(getAllMembershipBadgesList())
                // }
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

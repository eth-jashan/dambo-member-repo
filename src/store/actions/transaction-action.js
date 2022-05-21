import SafeServiceClient from "@gnosis.pm/safe-service-client"

import apiClient from "../../utils/api_client"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"

export const setTransaction = (item, ethPrice, isPOCPApproved = false) => {
    return (dispatch) => {
        dispatch(
            tranactionAction.set_current_transaction({
                data: item,
                price: ethPrice,
                isPOCPApproved,
            })
        )
    }
}

export const setEthPrice = (ethPrice) => {
    return (dispatch) => {
        dispatch(tranactionAction.set_current_Ethprice({ price: ethPrice }))
    }
}

export const setPayment = (item) => {
    return (dispatch) => {
        setTransaction(null)
        dispatch(tranactionAction.set_current_payment({ data: item }))
    }
}

export const resetApprovedRequest = () => {
    return async (dispatch) => {
        dispatch(tranactionAction.reset_approved_request())
    }
}

export const getPendingTransaction = () => {
    return async (dispatch, getState) => {
        const currentDao = getState().dao.currentDao
        const serviceClient = new SafeServiceClient(await getSafeServiceUrl())
        const pendingTxs = await serviceClient.getPendingTransactions(
            currentDao?.safe_public_address
        )
        if (pendingTxs.count > 0) {
            dispatch(
                tranactionAction.set_pendin_txs({ list: pendingTxs.results })
            )
        } else {
            dispatch(tranactionAction.set_pendin_txs({ list: [] }))
        }
    }
}

export const approveContriRequest = (
    payout,
    isExternal = false,
    feedback,
    mint_badge
) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const currentTransaction = getState().transaction.currentTransaction
        const contri_filter_key = getState().dao.contri_filter_key
        const contri_filter = getState().dao.contri_filter

        const newPayout = []
        if (isExternal) {
            dispatch(
                tranactionAction.set_approved_request({
                    item: { contri_detail: {}, payout },
                })
            )
        } else {
            dispatch(
                tranactionAction.set_approved_request({
                    item: {
                        contri_detail: currentTransaction,
                        payout,
                        feedback,
                    },
                })
            )
            payout.map((item, index) => {
                if (!item?.token_type) {
                    newPayout.push({
                        amount: item.amount,
                        usd_amount: item?.usd_amount,
                        address: item?.address,
                        details: {
                            name: "Ethereum",
                            symbol: "ETH",
                            decimals: "18",
                            logo_url:
                                "https://safe-transaction-assets.gnosis-safe.io/chains/4/currency_logo.png",
                            address: "",
                        },
                    })
                } else {
                    newPayout.push({
                        amount: item.amount,
                        usd_amount: item?.usd_amount,
                        address: item?.address,
                        details: {
                            name: item?.token_type?.token?.name,
                            symbol: item?.token_type?.token?.symbol,
                            decimals: item?.token_type?.token?.decimals,
                            logo_url: item?.token_type?.token?.logoUri,
                            address: item?.token_type?.tokenAddress,
                        },
                    })
                }
            })

            const data = {
                status: "APPROVED",
                tokens: newPayout,
                id: currentTransaction.id,
                feedback,
                mint_badge,
            }
            try {
                const res = await apiClient.post(
                    `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}/update`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${jwt}`,
                        },
                    }
                )
                if (res.data.success) {
                    const contri_request =
                        getState().dao.contribution_request.filter(
                            (x) => x.id !== currentTransaction.id
                        )
                    dispatch(
                        daoAction.set_contri_list({
                            list: contri_request,
                            key: contri_filter,
                            number: contri_filter_key,
                        })
                    )

                    return 1
                } else {
                    return 0
                }
            } catch (error) {
                // //console.log('error....', error)
            }
        }
    }
}

export const rejectContriRequest = (id) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        const data = {
            status: "REJECTED",
            tokens: [],
            id,
        }
        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}/update`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.success) {
                const currentList = getState().dao.contribution_request
                dispatch(
                    daoAction.set_after_claim({
                        list: currentList.filter((x) => x.id !== id),
                    })
                )
                return 1
            } else {
                return 0
            }
        } catch (error) {
            //console.log('error....', error)
        }
    }
}

export const rejectApproval = (id) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        const data = {
            status: "REQUESTED",
            tokens: [],
            id,
        }

        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}/update`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.success) {
                dispatch(tranactionAction.set_reject_request({ id }))
                return 1
            } else {
                return 0
            }
        } catch (error) {
            //console.log('error....', error)
        }
    }
}

export const setRejectModal = (status) => {
    return (dispatch) => {
        dispatch(tranactionAction.set_reject_modal({ status }))
    }
}

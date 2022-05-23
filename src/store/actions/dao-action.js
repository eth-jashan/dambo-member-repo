import SafeServiceClient from "@gnosis.pm/safe-service-client"
import apiClient from "../../utils/api_client"
import routes from "../../constant/routes"
import { authActions } from "../reducers/auth-slice"
import { daoAction } from "../reducers/dao-slice"
import { tranactionAction } from "../reducers/transaction-slice"
import { PocpGetters } from "pocp-service-sdk"
import { ethers } from "ethers"
import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"
import { getSelectedChainId } from "../../utils/POCPutils"

const currentNetwork = getSelectedChainId()
const serviceClient = new SafeServiceClient(getSafeServiceUrl())

export const setChainId = (chainId) => {
    return (dispatch) => {
        dispatch(daoAction.set_chainId({ chainId }))
    }
}

export const addSafeAddress = (safeAddress) => {
    return (dispatch) => {
        dispatch(daoAction.set_safeAdress({ safeAddress }))
    }
}

export const addOwners = (owners) => {
    return (dispatch) => {
        dispatch(daoAction.set_newSafeOwners({ owners }))
    }
}

export const addThreshold = (threshold) => {
    return (dispatch) => {
        dispatch(daoAction.set_newSafeThreshold({ threshold }))
    }
}

export const addDaoInfo = (name, email, discord, logo) => {
    return (dispatch) => {
        dispatch(daoAction.set_dainInfo({ email, name, discord, logo }))
    }
}

export const registerDao = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const owners = getState().dao.newSafeSetup.owners
        const safeAddress = getState().dao.newSafeSetup.safeAddress
        const threshold = getState().dao.newSafeSetup.threshold
        const name = getState().dao.newSafeSetup.dao_name
        const logo = getState().dao.newSafeSetup.dao_logo_url
        const discord = getState().dao.newSafeSetup.dao_discord
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const chainId = await signer.getChainId()
        console.log("chain id", chainId)
        const owner = []

        owners.map((item) =>
            owner.push({ public_address: item.address, name: item.name })
        )

        const data = {
            dao_name: name,
            safe_addr: safeAddress,
            by: address,
            signers: owner,
            signs_required: threshold,
            logo_url: logo,
            discord_link: discord,
            chain_id: chainId,
        }

        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.registerDao}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.success) {
                return { dao_uuid: res.data.data.dao_uuid, name, owners }
            } else {
                return 0
            }
        } catch (error) {
            console.log("error in registering.....", error)
        }
    }
}

export const getAllDaowithAddress = (chainId) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const address = getState().auth.address
        const lastSelected = getState().auth.lastSelection
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getDaoMembership}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            if (res.data.data.length > 0) {
                // console.log(res.data.data)
                const dao_details = []

                res.data.data.forEach((x) => {
                    if (x.dao_details.chain_id === chainId) {
                        console.log(x, chainId)
                        dao_details.push(x)
                    }
                })

                dispatch(
                    daoAction.set_dao_list({
                        list: dao_details,
                    })
                )
                let selectionIndex = 0

                if (lastSelected) {
                    const isLastSelection = lastSelected.filter(
                        (x) => x.address === address
                    )
                    dao_details.forEach((item, index) => {
                        if (
                            isLastSelection.length > 0 &&
                            item?.dao_details?.uuid ===
                                isLastSelection[0]?.dao_uuid
                        ) {
                            selectionIndex = index
                        } else {
                            // //console.log("last remember not there")
                        }
                    })
                }

                dispatch(
                    daoAction.set_current_dao({
                        dao: dao_details[selectionIndex].dao_details,
                        role: dao_details[selectionIndex].access_role,
                        community_role:
                            dao_details[selectionIndex].community_role,
                        account_mode: dao_details[selectionIndex].access_role,
                        index: selectionIndex,
                    })
                )
                return dao_details[selectionIndex].access_role
            } else {
                dispatch(
                    daoAction.set_dao_list({
                        list: [],
                    })
                )
                dispatch(
                    daoAction.set_current_dao({
                        dao: null,
                        role: null,
                        community_role: null,
                        account_mode: null,
                        index: 0,
                    })
                )
                return 0
            }
        } catch (error) {
            dispatch(
                daoAction.set_dao_list({
                    list: [],
                })
            )
            dispatch(
                daoAction.set_current_dao({
                    dao: null,
                    role: null,
                    community_role: null,
                    account_mode: null,
                    index: 0,
                })
            )
            return 0
        }
    }
}

export const set_contri_filter = (filter_key, number) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const url =
            getState().dao.role === "ADMIN"
                ? `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`
                : `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}?dao_uuid=${uuid}&contributor=1`
        try {
            const res = await apiClient.get(url, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            if (res.data.success) {
                if (filter_key === "APPROVED") {
                    dispatch(
                        daoAction.set_contribution_filter({
                            key: filter_key,
                            number: 2,
                            list: res.data?.data?.contributions?.filter(
                                (x) =>
                                    x.status === "APPROVED" &&
                                    x.payout_status === "REQUESTED"
                            ),
                        })
                    )
                } else if (filter_key === "ACTIVE") {
                    dispatch(
                        daoAction.set_contribution_filter({
                            key: filter_key,
                            number: 1,
                            list: res.data?.data?.contributions?.filter(
                                (x) =>
                                    x.payout_status === null &&
                                    x.status !== "REJECTED" &&
                                    x.tokens.length === 0
                            ),
                        })
                    )
                } else if (filter_key === "ALL") {
                    dispatch(
                        daoAction.set_contribution_filter({
                            key: filter_key,
                            number: 0,
                            list: res.data?.data?.contributions,
                        })
                    )
                } else if (filter_key === "PAID") {
                    dispatch(
                        daoAction.set_contribution_filter({
                            key: filter_key,
                            number: 2,
                            list: res.data?.data?.contributions?.filter(
                                (x) =>
                                    x.status === "APPROVED" &&
                                    x.payout_status === "PAID"
                            ),
                        })
                    )
                } else {
                    dispatch(
                        daoAction.set_contribution_filter({
                            key: filter_key,
                            number,
                            list: [],
                        })
                    )
                }
                // return 1
            } else {
                // dispatch(daoAction.set_contri_list({
                //   list:[]
                // }))
                dispatch(
                    daoAction.set_contribution_filter({
                        key: filter_key,
                        number,
                        list: [],
                    })
                )
                // return 0
            }
        } catch (error) {
            // //console.log("error...", error)
            dispatch(
                daoAction.set_contri_list({
                    list: [],
                    key: filter_key,
                    number,
                })
            )
            return 0
        }
    }
}

export const gnosisDetailsofDao = () => {
    return async (dispatch, getState) => {
        const currentDao = getState().dao.currentDao
        try {
            const balance = await serviceClient.getBalances(
                currentDao?.safe_public_address
            )

            const tokenType = []
            balance.forEach((item) => {
                if (item.tokenAddress === null) {
                    tokenType.push({
                        label: "ETH",
                        value: item,
                    })
                } else {
                    tokenType.push({
                        label: item.token.symbol,
                        value: item,
                    })
                }
            })
            dispatch(
                daoAction.set_gnosis_details({
                    balance: tokenType,
                })
            )
        } catch (error) {
            dispatch(
                daoAction.set_gnosis_details({
                    balance: null,
                })
            )
        }
    }
}

export const lastSelectedId = (dao_uuid) => {
    return async (dispatch, getState) => {
        const address = getState().auth.address
        dispatch(authActions.set_last_selection({ address, dao_uuid }))
    }
}

export const set_dao = (dao, index) => {
    return async (dispatch) => {
        dispatch(
            daoAction.set_current_dao({
                dao: dao.dao_details,
                role: dao.access_role,
                community_role: dao.community_role,
                account_mode: dao.access_role,
                index,
            })
        )
        gnosisDetailsofDao()
    }
}

export const set_active_nonce = (nonce) => {
    return (dispatch) => {
        dispatch(
            daoAction.setActive_nonce({
                nonce,
            })
        )
    }
}

export const getContriRequest = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        dispatch(tranactionAction.reset_approved_request())
        const url =
            getState().dao.role === "ADMIN"
                ? `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}?dao_uuid=${uuid}`
                : `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}?dao_uuid=${uuid}&contributor=1`
        try {
            const res = await apiClient.get(url, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })
            if (res.data.success) {
                // Approved Request without creating payout
                const cid = []
                res?.data?.data?.contributions?.forEach((item) => {
                    const payout = []
                    cid.push(item)
                    if (
                        item?.tokens?.length > 0 &&
                        item?.payout_status === null &&
                        item?.status === "APPROVED" &&
                        item?.gnosis_reference_id === ""
                    ) {
                        item?.tokens.forEach((x) => {
                            payout.push({
                                amount: x?.amount,
                                token_type: {
                                    token: x?.details,
                                },
                                address: x?.addr,
                                usd_amount: x?.usd_amount,
                            })
                        })
                        if (payout?.length > 0) {
                            dispatch(
                                tranactionAction.set_approved_request({
                                    item: {
                                        contri_detail: item,
                                        payout,
                                    },
                                })
                            )
                        }
                    }
                })

                dispatch(daoAction.set_contribution_id({ cid }))
                if (getState().dao.role === "ADMIN") {
                    dispatch(
                        daoAction.set_contri_list({
                            list: res.data?.data?.contributions.filter(
                                (x) =>
                                    (x.payout_status === null &&
                                        x.status !== "REJECTED" &&
                                        x.tokens.length === 0) ||
                                    x.status === "REQUESTED"
                            ),
                            number: 1,
                        })
                    )
                    return 1
                } else {
                    dispatch(
                        daoAction.set_contri_list({
                            list: res.data?.data?.contributions.filter(
                                (x) =>
                                    (x.payout_status === null ||
                                        x.payout_status === "REQUESTED" ||
                                        x.payout_status === "PAID") &&
                                    x.status !== "REJECTED" &&
                                    !x.claimed_tx &&
                                    x?.mint_badge
                            ),
                            number: 1,
                        })
                    )
                }
            } else {
                dispatch(
                    daoAction.set_contri_list({
                        list: [],
                        number: 1,
                    })
                )
                return 0
            }
        } catch (error) {
            // //console.log("error...", error)
            dispatch(
                daoAction.set_contri_list({
                    list: [],
                    number: 1,
                })
            )
            return 0
        }
    }
}

export const updateSingleTransaction = () => {}

export const addActivePaymentBadge = (status) => {
    return (dispatch) => {
        dispatch(daoAction.set_active_payment_notification({ status }))
    }
}

export const getPayoutRequest = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        const safe_address = getState().dao.currentDao?.safe_public_address
        const uuid = getState().dao.currentDao?.uuid

        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.payout}?dao_uuid=${uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )

            const pendingTxs = await serviceClient.getPendingTransactions(
                safe_address
            )

            const list_of_tx = []
            if (res.data.success) {
                // all payout from server
                dispatch(
                    daoAction.set_all_payout_request({
                        list: res.data?.data?.payouts,
                    })
                )
                // filtering out drepute pending txs from gnosis
                res.data?.data?.payouts.forEach((item) => {
                    pendingTxs.results.forEach((x) => {
                        if (item.gnosis_reference_id === x.safeTxHash) {
                            list_of_tx.push({ gnosis: x, metaInfo: item })
                        }
                    })
                })

                const tx = []
                const nonce_inserted = []

                // checking rejected tx and updated tx
                list_of_tx.forEach((item) => {
                    pendingTxs.results.forEach((x) => {
                        if (
                            item.gnosis.nonce === x.nonce &&
                            !item.metaInfo.is_executed
                        ) {
                            if (x.data === null && x.value === "0") {
                                if (!nonce_inserted.includes(x.nonce)) {
                                    tx.push({
                                        gnosis: x,
                                        metaInfo: item.metaInfo,
                                        status: "REJECTED",
                                    })
                                    nonce_inserted.push(x.nonce)
                                } else {
                                    // was approved and changed to rejected
                                    const same_nonce = tx.filter(
                                        (y) => y.gnosis.nonce === x.nonce
                                    )

                                    if (same_nonce[0].status === "APPROVED") {
                                        tx.forEach((item, index) => {
                                            if (item.gnosis.nonce === x.nonce) {
                                                tx[index] = {
                                                    gnosis: x,
                                                    metaInfo: item.metaInfo,
                                                    status: "REJECTED",
                                                }
                                            }
                                        })
                                    }
                                }
                            } else {
                                if (!nonce_inserted.includes(x.nonce)) {
                                    tx.push({
                                        gnosis: x,
                                        metaInfo: item.metaInfo,
                                        status: "APPROVED",
                                    })
                                    nonce_inserted.push(x.nonce)
                                }
                            }
                        }
                    })
                })

                const updateTx = []
                tx.forEach((item) => {
                    updateTx.push({
                        payout_id: item?.metaInfo?.id,
                        gnosis_reference_id: item?.gnosis?.safeTxHash,
                        is_executed: false,
                        status: item?.status,
                    })
                })
                dispatch(
                    daoAction.set_payout_list({
                        list: tx,
                    })
                )

                if (updateTx.length > 0) {
                    const data = {
                        dao_uuid: uuid,
                        data: updateTx,
                    }

                    try {
                        await apiClient.post(
                            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.updatePayout}`,
                            data,
                            {
                                headers: {
                                    Authorization: `Bearer ${jwt}`,
                                },
                            }
                        )
                    } catch (error) {
                        // console.log("error while updating gnosis", error)
                    }
                }
            } else {
                return 0
            }
        } catch (error) {
            return 0
        }
    }
}

export const syncTxDataWithGnosis = () => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const safe_address = getState().dao.currentDao?.safe_public_address
        const uuid = getState().dao.currentDao?.uuid
        const getAllPayout = getState().dao.all_payout_request
        try {
            const allTx = await serviceClient.getMultisigTransactions(
                safe_address
            )
            const updatedTX = []

            const nonce_inserted = []
            allTx.results.forEach((item) => {
                getAllPayout.forEach((x) => {
                    if (
                        x.nonce === item.nonce &&
                        (x.request_type === "APPROVED" ||
                            x.request_type === "REJECTED") &&
                        !x.is_executed
                    ) {
                        if (item.isExecuted) {
                            if (item.data === null && item.value === "0") {
                                // Rejected with isExecuted
                                if (!nonce_inserted.includes(item.nonce)) {
                                    nonce_inserted.push(item.nonce)
                                    updatedTX.push({
                                        payout_id: x.id,
                                        gnosis_reference_id: item.safeTxHash,
                                        is_executed: true,
                                        status: "REJECTED",
                                    })
                                }
                            } else {
                                // Approved with isExecuted
                                if (!nonce_inserted.includes(item.nonce)) {
                                    nonce_inserted.push(item.nonce)
                                    updatedTX.push({
                                        payout_id: x.id,
                                        gnosis_reference_id: item.safeTxHash,
                                        is_executed: true,
                                        status: "APPROVED",
                                    })
                                }
                            }
                        }
                    }
                })
            })
            if (updatedTX.length > 0) {
                const data = {
                    dao_uuid: uuid,
                    data: updatedTX,
                }

                try {
                    await apiClient.post(
                        `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.updatePayout}`,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${jwt}`,
                            },
                        }
                    )
                } catch (error) {
                    // console.log("error while updating gnosis", error)
                }
            }
        } catch (error) {
            return 0
        }
    }
}

export const set_payout_filter = (filter_key) => {
    return async (dispatch, getState) => {
        const safe_address = getState().dao.currentDao?.safe_public_address
        const getAllPayout = getState().dao.all_payout_request
        const pending_txs = getState().dao.payout_request

        if (pending_txs.length > 0) {
            dispatch(
                daoAction.set_active_payment_notification({ status: true })
            )
        } else {
            dispatch(
                daoAction.set_active_payment_notification({ status: false })
            )
        }

        if (filter_key === "PENDING") {
            dispatch(
                daoAction.set_filter_list({
                    key: filter_key,
                    number: 1,
                    list: pending_txs,
                })
            )
        } else if (filter_key === "APPROVED") {
            const pending = pending_txs.filter((x) => x.status === filter_key)

            dispatch(
                daoAction.set_filter_list({
                    key: filter_key,
                    number: 2,
                    list: pending,
                })
            )
        } else {
            try {
                const pendingTxs = await serviceClient.getMultisigTransactions(
                    safe_address
                )

                const list_of_tx = []

                // filtering out drepute txs from gnosis
                getAllPayout.forEach((item) => {
                    pendingTxs.results.forEach((x) => {
                        if (
                            item.gnosis_reference_id === x.safeTxHash &&
                            item.is_executed
                        ) {
                            list_of_tx.push({
                                gnosis: x,
                                metaInfo: item,
                                status: item.request_type,
                            })
                        }
                    })
                })

                if (filter_key === "ALL") {
                    const all_payout = pending_txs.concat(list_of_tx)

                    dispatch(
                        daoAction.set_filter_list({
                            key: filter_key,
                            number: 0,
                            list: all_payout,
                        })
                    )
                } else if (filter_key === "PAID") {
                    dispatch(
                        daoAction.set_filter_list({
                            key: filter_key,
                            number: 3,
                            list: list_of_tx,
                        })
                    )
                } else if (filter_key === "REJECTED") {
                    const rejectedInPending = pending_txs.filter(
                        (x) => x.status === filter_key
                    )
                    const rejectedInExecuted = list_of_tx.filter(
                        (x) => x.status === filter_key
                    )
                    const allReject =
                        rejectedInPending.concat(rejectedInExecuted)
                    dispatch(
                        daoAction.set_filter_list({
                            key: filter_key,
                            number: 4,
                            list: allReject,
                        })
                    )
                }
            } catch (error) {
                dispatch(
                    daoAction.set_filter_list({
                        list: [],
                        key: filter_key,
                        number: 0,
                    })
                )
                return 0
            }
        }
    }
}

export const updateListOnExecute = (id) => {
    return (dispatch, getState) => {
        const pendingTxs = getState().dao.payout_request
        console.log(
            pendingTxs.length,
            id,
            pendingTxs.filter((x) => x.metaInfo?.id !== id)
        )
        if (pendingTxs.length > 0) {
            dispatch(
                daoAction.set_active_payment_notification({ status: true })
            )
        } else {
            dispatch(
                daoAction.set_active_payment_notification({ status: false })
            )
        }
        dispatch(
            daoAction.set_filter_list({
                key: "PENDING",
                number: 1,
                list: pendingTxs.filter((x) => x.metaInfo?.id !== id),
            })
        )
    }
}

export const syncExecuteData = async (id, safeTxHash, status, jwt, uuid) => {
    const data = {
        dao_uuid: uuid,
        data: [
            {
                payout_id: id,
                gnosis_reference_id: safeTxHash,
                is_executed: true,
                status,
            },
        ],
    }
    // //console.log('updated data...', data)
    try {
        await apiClient.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.updatePayout}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
    } catch (error) {
        // console.log("error while updating gnosis", error)
    }
}

export const getNonceForCreation = async (safe_address) => {
    try {
        const pendingTxs = await serviceClient.getPendingTransactions(
            safe_address
        )
        return pendingTxs.countUniqueNonce
    } catch (error) {}
}

export const createPayout = (tranxid, nonce, isExternal = false) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        const transaction = getState().transaction.approvedContriRequest

        const contri_array = []

        transaction.forEach((item) => {
            contri_array.push(item?.contri_detail?.id)
        })

        const data = {
            contributions: contri_array,
            gnosis_reference_id: tranxid,
            dao_uuid: uuid,
            nonce,
        }
        const data_external = {
            gnosis_reference_id: tranxid,
            dao_uuid: uuid,
            nonce,
        }

        const res = await apiClient.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.payout}`,
            isExternal ? data_external : data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res.data.success) {
            return 1
        } else {
            return 0
        }
    }
}

export const createExternalPayment = (tranxid, nonce, payout, description) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt
        const uuid = getState().dao.currentDao?.uuid
        // const transaction = getState().transaction.approvedContriRequest

        const newPayout = []

        payout.forEach((item) => {
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
                        address: item?.token_type?.token?.tokenAddress,
                    },
                })
            }
        })

        const data = {
            gnosis_reference_id: tranxid,
            dao_uuid: uuid,
            nonce,
            tokens: newPayout,
            description,
        }

        const res = await apiClient.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.externalPayout}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res.data.success) {
            return 1
        } else {
            return 0
        }
    }
}

export const set_initial_setup = (status) => {
    return (dispatch) => {
        dispatch(daoAction.set_initial_setup({ status }))
    }
}

// create a voucher

export const filterRequests = (time, verticals, isContribution) => {
    return (dispatch, getState) => {
        const contribution_request = getState().dao.contribution_request
        // const payout_request = getState().dao.payout_request
        const contri_filter_key = getState().dao.contri_filter_key
        let new_array_contrib_time = []
        if (isContribution) {
            if (time === "1hr") {
                new_array_contrib_time = contribution_request.filter(
                    (x) => x.time_spent < 1
                )
            } else if (time === "1hr4") {
                new_array_contrib_time = contribution_request.filter(
                    (x) => x.time_spent > 1 && x.time_spent < 4
                )
            } else if (time === "4hr12") {
                new_array_contrib_time = contribution_request.filter(
                    (x) => x.time_spent > 4 && x.time_spent < 12
                )
            } else if (time === "12hr30") {
                new_array_contrib_time = contribution_request.filter(
                    (x) => x.time_spent > 12 && x.time_spent < 30
                )
            } else if (time === "30hr") {
                new_array_contrib_time = contribution_request.filter(
                    (x) => x.time_spent > 30
                )
            } else {
                new_array_contrib_time = contribution_request
            }
        }
        const new_array_contrib_veritcal = []
        if (verticals.length > 0) {
            verticals.forEach((x) => {
                new_array_contrib_time.forEach((y) => {
                    if (x.toUpperCase() === y.stream) {
                        new_array_contrib_veritcal.push(y)
                    }
                })
            })
        }
        dispatch(
            daoAction.set_contri_list({
                list:
                    verticals.length > 0
                        ? new_array_contrib_veritcal
                        : new_array_contrib_time,
                number: contri_filter_key,
            })
        )

        // verticals.map
    }
}

export const switchRole = (role) => {
    return (dispatch) => {
        dispatch(daoAction.switch_account_role({ role }))
    }
}

export const getContributorOverview = () => {
    return (dispatch, getState) => {
        const all_contribution = getState().dao.contribution_id
        const all_paid_contribution = []
        const type_of_token = []
        let token_info = []
        let totalAmount = 0
        all_contribution.forEach((item) => {
            if (item?.status === "APPROVED" && item?.payout_status === "PAID") {
                all_paid_contribution.push(item.id)
                item?.tokens?.forEach((y) => {
                    if (type_of_token?.includes(y?.details?.symbol)) {
                        const token = token_info.filter(
                            (x) => x.symbol === y?.details?.symbol
                        )
                        token[0].value =
                            token[0].value + y?.amount * y?.usd_amount
                        token[0].amount = token[0].amount + y?.amount
                        const new_token_list = token_info.filter(
                            (x) => x.symbol !== y?.details?.symbol
                        )
                        new_token_list.push(token[0])
                        token_info = new_token_list
                        totalAmount = totalAmount + y?.amount * y?.usd_amount
                    } else {
                        type_of_token.push(y?.details?.symbol)
                        totalAmount = totalAmount + y?.amount * y?.usd_amount
                        token_info.push({
                            symbol: y?.details?.symbol,
                            value: y?.amount * y?.usd_amount,
                            amount: y?.amount,
                        })
                    }
                })
            }
        })
        dispatch(
            daoAction.set_contribution_overview({
                token_info,
                all_paid_contribution,
                total_amount: totalAmount,
            })
        )
    }
}

export const getAllSafeFromAddress = (address) => {
    return async (dispatch, getState) => {
        const list = await serviceClient.getSafesByOwner(address)
        let daos = []
        for (let i = 0; i < list.safes.length; i++) {
            daos.push(`safe=${list.safes[i]}`)
        }
        daos = daos.toString()
        daos = daos.replace(/,/g, "&")
        const jwt = getState().auth.jwt
        const res = await apiClient.get(
            `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getOurSafes}?${daos}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        dispatch(daoAction.set_allSafe({ list: res.data.data }))
    }
}

export const setLoading = (loadingStatus, paymentId = null) => {
    return (dispatch) => {
        dispatch(
            daoAction.set_execute_payment_loading({
                loadingInfo: {
                    loadingStatus,
                    paymentId,
                },
            })
        )
    }
}

export const claimUpdate = (id) => {
    return (dispatch, getState) => {
        const currentList = getState().dao.contribution_request
        dispatch(
            daoAction.set_after_claim({
                list: currentList.filter((x) => x.id !== id),
            })
        )
    }
}

export const getCommunityId = () => {
    return async (dispatch, getState) => {
        const daoTxHash = getState().dao.currentDao?.tx_hash
        console.log(daoTxHash, currentNetwork)

        const pocpGetter = new PocpGetters(
            currentNetwork?.chainId === 4 ? 80001 : 137
        )

        const community = await pocpGetter.getCommunityIdOfHash(daoTxHash)
        console.log(community)
        dispatch(
            daoAction.set_community_info({
                communityInfo: community.data.communities,
            })
        )
    }
}

export const getAllApprovedBadges = () => {
    return async (dispatch, getState) => {
        const communityInfo = getState().dao.communityInfo
        console.log(communityInfo)
        const pocpGetter = new PocpGetters(
            currentNetwork?.chainId === 4 ? 80001 : 137
        )

        try {
            const approvedToken = await pocpGetter.getApproveBadges(
                communityInfo[0]?.id.toString()
            )

            // if (
            //     approvedToken.data.approvedTokens.length > approvedBadge.length
            // ) {
            dispatch(
                daoAction.set_approved_badges({
                    approvedTokens: approvedToken.data.approvedTokens,
                })
            )
            // }
        } catch (error) {
            console.log("error", error)
            dispatch(
                daoAction.set_approved_badges({
                    approvedTokens: [],
                })
            )
        }
    }
}

export const updateApprovedBadge = (tokenId, communityId, identifier) => {
    return async (dispatch, getState) => {
        const approvedBadge = getState().dao.all_approved_badge
        const newApprovedBadge = {
            id: tokenId,
            community: {
                id: communityId,
            },
            identifier,
        }
        const updatedList = approvedBadge.concat(newApprovedBadge)

        dispatch(daoAction.set_approved_badges({ approvedTokens: updatedList }))
    }
}

export const getAllClaimedBadges = () => {
    return async (dispatch, getState) => {
        const communityInfo = getState().dao.communityInfo
        const address = getState().auth.address
        // const pocpGetter = new PocpGetters(currentNetwork === 4 ? 137 : 137)
        const pocpGetter = new PocpGetters(
            currentNetwork?.chainId === 4 ? 80001 : 137
        )
        try {
            const claimedTokens = await pocpGetter.getClaimedBadgesOfClaimers(
                communityInfo[0]?.id.toString(),

                address
            )

            dispatch(
                daoAction.set_claimed_badges({
                    claimedTokens: claimedTokens.data.pocpTokens,
                })
            )
            console.log("claimed", claimedTokens.data.pocpTokens.length)
        } catch (error) {
            console.log("claimed", error)
            dispatch(
                daoAction.set_claimed_badges({
                    claimedTokens: [],
                })
            )
        }
    }
}

export const getAllUnclaimedBadges = () => {
    return async (dispatch, getState) => {
        const communityInfo = getState().dao.communityInfo
        // const pocpGetter = new PocpGetters(currentNetwork === 4 ? 137 : 137)
        const pocpGetter = new PocpGetters(
            currentNetwork?.chainId === 4 ? 80001 : 137
        )
        const uuid = getState().dao.currentDao?.uuid
        const jwt = getState().auth.jwt
        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.contribution.createContri}?dao_uuid=${uuid}&contributor=1`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                const unclaimedTokens = await pocpGetter.getUnclaimedBadges(
                    communityInfo[0]?.id.toString()
                )
                const unclaimedBadges = []
                res.data.data.contributions.forEach((contribution) => {
                    unclaimedTokens.forEach((badge) => {
                        if (contribution.id === parseInt(badge.identifier)) {
                            console.log(contribution.id)
                            unclaimedBadges.push(badge)
                        }
                    })
                })
                console.log(
                    "all unclaimed badges Fetched",
                    unclaimedTokens.length
                )
                dispatch(
                    daoAction.set_unclaimed_badges({
                        unclaimedToken: unclaimedBadges,
                    })
                )
            } else {
                dispatch(
                    daoAction.set_claimed_badges({
                        unclaimedToken: [],
                    })
                )
            }
        } catch (error) {
            console.log(error)
            dispatch(
                daoAction.set_claimed_badges({
                    unclaimedToken: [],
                })
            )
        }
    }
}

export const pocpRegistrationInfo = (dao_uuid, name, owner) => {
    return (dispatch) => {
        dispatch(daoAction.set_pocp_info({ info: { dao_uuid, name, owner } }))
    }
}

export const refreshContributionList = () => {
    return (dispatch) => {
        dispatch(
            daoAction.set_after_claim({
                list: [],
            })
        )
    }
}

export const contributorRefreshList = () => {
    return (dispatch) => {
        dispatch(daoAction.set_approved_badges({ approvedTokens: [] }))
        dispatch(
            daoAction.set_unclaimed_badges({
                unclaimedToken: [],
            })
        )
        daoAction.set_claimed_badges({
            claimedTokens: [],
        })
    }
}

export const connectDaoToDiscord = (daoUuid, guildId, discordId) => {
    return async (dispatch, getState) => {
        const data = {
            dao_uuid: daoUuid,
            guild_id: guildId,
            discord_user_id: discordId,
        }
        const jwt = getState().auth.jwt
        try {
            const res = await apiClient.post(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.discord.register}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                return 1
            } else {
                return 0
            }
        } catch (err) {
            return 0
        }
    }
}

export const getAllTokensOfSafe = () => {
    return async (dispatch, getState) => {
        const serviceClient = new SafeServiceClient(await getSafeServiceUrl())
        const currentDao = getState().dao.currentDao

        const tokensData = await serviceClient.getUsdBalances(
            currentDao?.safe_public_address
        )
        console.log("tokens are", tokensData)
    }
}

export const getAllNFTsOfSafe = () => {
    return async (dispatch, getState) => {
        const serviceClient = new SafeServiceClient(await getSafeServiceUrl())
        const currentDao = getState().dao.currentDao

        const collectiblesData = await serviceClient.getCollectibles(
            currentDao?.safe_public_address
        )
        console.log("collectibles are", collectiblesData)
    }
}

export const getAllTransactionsOfSafe = () => {
    return async (dispatch, getState) => {
        const serviceClient = new SafeServiceClient(await getSafeServiceUrl())
        const currentDao = getState().dao.currentDao

        const transactionsData = await serviceClient.getMultisigTransactions(
            currentDao?.safe_public_address
        )
        console.log("transactions are", transactionsData)
    }
}

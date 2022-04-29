import axios from "axios"
import api from "../constant/api"
import routes from "../constant/routes"

export const relayFunction = async (
    token,
    functionType,
    request,
    signature
) => {
    const data = {
        function: functionType,
        request_data: request,
        signature,
        callback_api: "https://staging.api.drepute.xyz/eth/callback",
    }
    try {
        const res = await axios.post(
            `https://staging.api.drepute.xyz:5001${routes.pocp.relay}`,
            data,
            {
                headers: {
                    "X-Authentication": token,
                },
            }
        )

        return res.data.data.hash
    } catch (error) {
        // //console.log('relay api error', error.toString())
    }
}

export const uplaodApproveMetaDataUpload = async (approveContri) => {
    const data = {
        contribution_meta_array: approveContri,
    }
    try {
        const res = await axios.post(
            "https://staging.api.drepute.xyz:3001/upload",
            // "http://localhost:3002/upload",
            data
        )
        if (res) {
            return 1
        }
    } catch (error) {
        // //console.log('error on uploading', error.toString())
    }
}

export const updatePocpRegister = async (jwt, tx_hash, dao_uuid) => {
    const data = { tx_hash, dao_uuid }

    try {
        const res = await axios.post(
            `${api.drepute.dev.BASE_URL}/dao/update/pocp`,
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
    } catch (error) {
        // //console.log('error in registering.....', error)
    }
}

export const updatePocpApproval = async (
    jwt,
    approval_tx_hash,
    contribution_ids
) => {
    const data = { approval_tx_hash, contribution_ids }

    // ////console.log('tx_hash...', data)

    try {
        const res = await axios.post(
            `${api.drepute.dev.BASE_URL}/contrib/update/pocp`,
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
    } catch (error) {
        // //console.log('error in registering.....', error)
    }
}

export const updatePocpClaim = async (jwt, claim_tx_hash, contribution_ids) => {
    const data = { claim_tx_hash, contribution_ids }

    // ////console.log('tx_hash...', data)

    try {
        const res = await axios.post(
            `${api.drepute.dev.BASE_URL}/contrib/update/pocp`,
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
    } catch (error) {
        // //console.log('error in registering.....', error)
    }
}

const buildQuery = (cid) => {
    const cid_and_array = []

    cid?.map((x, i) => {
        cid_and_array.push(`cid=${x}`.toString())
    })
    let queryString = cid_and_array.toString()
    queryString = queryString.replace(/,/g, "&")
    return queryString
}

export const getIpfsUrl = async (jwt, dao_uuid, cid) => {
    try {
        const query = buildQuery(cid)
        const res = await axios.get(
            `${api.drepute.dev.BASE_URL}/contrib/get/ipfs?${query}&dao_uuid=${dao_uuid}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res.data?.data?.contributions?.length > 0) {
            const cid = []
            const url = []
            let status = true
            res.data?.data?.contributions?.map((item, index) => {
                if (item?.ipfs_url === null) {
                    status = false
                } else {
                    cid.push(item?.id.toString())
                    url.push(`https://ipfs.infura.io/ipfs/${item?.ipfs_url}`)
                }
            })
            // //console.log('status...', status)
            return { cid, url, status }
        } else {
            return { cid, url: [], status: false }
        }
    } catch (error) {
        // //console.log('error', error.toString())
        return { cid, url: [], status: false }
    }
}

export const getMetaInfo = async (url) => {
    const res = await axios.get(url)
    if (res.status) {
        return res.data
    }
}

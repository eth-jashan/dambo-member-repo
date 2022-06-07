import axios from "axios"

export const uploadApproveMetaDataUpload = async (approveContri, jwt) => {
    const data = {
        contribution_meta_array: approveContri,
        callbackApi: `${process.env.REACT_APP_DAO_TOOL_URL}`,
    }
    try {
        const res = await axios.post(
            `https://test-staging.api.drepute.xyz/ipfs_server/upload`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )
        if (res) {
            return 1
        }
    } catch (error) {}
}

export const updatePocpRegister = async (jwt, tx_hash, dao_uuid) => {
    const data = { tx_hash, dao_uuid }

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}/dao/update/pocp`,
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
            `${process.env.REACT_APP_DAO_TOOL_URL}/contrib/update/pocp`,
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

    try {
        const res = await axios.post(
            `${process.env.REACT_APP_DAO_TOOL_URL}/contrib/update/pocp`,
            // "https://staging.api.drepute.xyz:3001/ipfs_server/upload",
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

    cid?.forEach((x) => {
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
            `${process.env.REACT_APP_DAO_TOOL_URL}/contrib/get/ipfs?${query}&dao_uuid=${dao_uuid}`,
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
            res.data?.data?.contributions?.forEach((item) => {
                if (item?.ipfs_url === null) {
                    status = false
                } else {
                    cid.push(item?.id.toString())
                    url.push(`https://ipfs.infura.io/ipfs/${item?.ipfs_url}`)
                }
            })

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

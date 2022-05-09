import { ethers } from "ethers"
import Pocp from "pocp-service-sdk"
import { web3 } from "../constant/web3"

import POCPProxy from "../smartContract/POCP_Contracts/POCP.json"

import {
    updatePocpApproval,
    updatePocpClaim,
    updatePocpRegister,
} from "./relayFunctions"

//processing registerdao function

export const processDaoToPOCP = async (
    name,
    owner,
    dao_uuid,
    jwt,
    eventCallbackFunction,
    errorCallback
) => {
    try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })

        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner()
        const pocp = new Pocp(signer, provider, {
            relayer_token: "f1960990-b217-4426-90fd-21802301363f",
        })
        await pocp.createInstance()
        const res = await pocp.registerDaoToPocp(
            name,
            owner,
            eventCallbackFunction
        )
        if (res) {
            await updatePocpRegister(jwt, res.hash, dao_uuid)
        }
    } catch (error) {
        errorCallback()
        console.log("register error", error)
        return false
    }
}

//processing badge approver function

export const processBadgeApprovalToPocp = async (
    communityId,
    to,
    cid,
    url,
    jwt,
    eventCallbackFunction,
    errorCallback
) => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)

        const signer = provider.getSigner()
        const pocp = new Pocp(signer, provider, {
            relayer_token: "f1960990-b217-4426-90fd-21802301363f",
        })
        await pocp.createInstance()
        const res = await pocp.approveBadgeToContributor(
            parseInt(communityId),
            to,
            url,
            cid,
            eventCallbackFunction
        )
        console.log(res)
        if (res) {
            await updatePocpApproval(jwt, res.hash, cid)
        }
    } catch (error) {
        errorCallback()
    }
}

//processing badge claim function

export const processClaimBadgeToPocp = async (
    tokenId,
    jwt,
    contributionId,
    eventCallbackFunction,
    errorCallback
) => {
    try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const pocp = new Pocp(signer, provider, {
            relayer_token: "f1960990-b217-4426-90fd-21802301363f",
        })
        await pocp.createInstance()
        const res = await pocp.claimBadgesByClaimers(
            [parseInt(tokenId)],
            eventCallbackFunction
        )
        if (res) {
            await updatePocpClaim(jwt, res.hash, [contributionId])
        }
    } catch (error) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
    }
}

//get claimed token URI

export const getTokenURI = async (signer, tokenId) => {
    const pocpProxy = new ethers.Contract(
        web3.POCP_Proxy,
        POCPProxy.abi,
        signer
    )

    const uri = await pocpProxy.tokenURI(tokenId)
    if (uri) {
        return uri
    }
}

export const checkClaimApprovedSuccess = (approved, id) => {
    const unclaimedList = approved || []
    const isTxSuccess = unclaimedList.filter(
        (x) => x.identifier === id.toString()
    )
    if (isTxSuccess.length === 1) {
        return true
    } else {
        return false
    }
}

export const isApprovedToken = (unclaimed, id) => {
    const unclaimedList = unclaimed || []
    const token = unclaimedList.filter((x) => x.identifier === id.toString())
    if (token.length > 0) {
        return { status: true, token }
    } else {
        return { status: false, token: [] }
    }
}

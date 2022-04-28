import { ethers } from "ethers"
import { web3 } from "../constant/web3"
import Forwarder from "../smartContract/POCP_Contracts/minimalForwarder.json"
import POCPProxy from "../smartContract/POCP_Contracts/POCP.json"
import { getAuthToken } from "../store/actions/auth-action"
import {
    relayFunction,
    updatePocpApproval,
    updatePocpClaim,
    updatePocpRegister,
} from "./relayFunctions"

//processing registerdao function

export const processDaoToPOCP = async (name, owner, address, dao_uuid, jwt) => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const { data, signature } = await registerDaoToPocp(
            signer,
            name,
            owner,
            address
        )
        const token = await getAuthToken(jwt)
        const txHash = await relayFunction(token, 0, data, signature)
        await updatePocpRegister(jwt, txHash, dao_uuid)
        if (txHash) {
            const startTime = Date.now()
            const interval = setInterval(async () => {
                if (Date.now() - startTime > 20000) {
                    clearInterval(interval)
                }
                const customHttpProvider = new ethers.providers.JsonRpcProvider(
                    web3.infura
                )
                const reciept = await customHttpProvider.getTransactionReceipt(
                    txHash
                )
                if (reciept?.status) {
                    clearTimeout(interval)
                    await provider.provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: web3.chainid.rinkeby }],
                    })
                    await provider.provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: web3.chainid.rinkeby }],
                    })
                    return true
                }
            }, 2000)
        }
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
        return false
    } catch (error) {
        // console.log(error.toString())
        // try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
        // } catch (error) {
        //     console.log("error")
        // }
        // return false
    }
}

//processing badge approver function

export const processBadgeApprovalToPocp = async (
    address,
    communityId,
    to,
    cid,
    url,
    jwt
) => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const { data, signature } = await approvePOCPBadge(
            signer,
            parseInt(communityId),
            address,
            to,
            cid,
            url
        )
        const token = await getAuthToken(jwt)
        const txHash = await relayFunction(token, 5, data, signature)
        if (txHash) {
            await updatePocpApproval(jwt, txHash, cid)
            const startTime = Date.now()
            const interval = setInterval(async () => {
                if (Date.now() - startTime > 10000) {
                    clearInterval(interval)
                    // console.log('failed to get confirmation')
                    await updatePocpApproval(jwt, txHash, cid)
                }
                const customHttpProvider = new ethers.providers.JsonRpcProvider(
                    web3.infura
                )
                const reciept = await customHttpProvider.getTransactionReceipt(
                    txHash
                )

                if (reciept?.status) {
                    clearTimeout(interval)
                    await provider.provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                chainId: web3.chainid.rinkeby,
                            },
                        ],
                    })
                    return true
                }
            }, 2000)
        } else {
            await provider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.chainid.rinkeby }],
            })
        }
    } catch (error) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
    }
}

//processing badge claim function

export const processClaimBadgeToPocp = async (
    address,
    tokenId,
    jwt,
    contributionId
) => {
    try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
        await web3Provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.polygon }],
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const { data, signature } = await claimPOCPBadges(signer, address, [
            parseInt(tokenId),
        ])
        const token = await getAuthToken(jwt)
        const txHash = await relayFunction(token, 3, data, signature)
        if (txHash) {
            await updatePocpClaim(jwt, txHash, [contributionId])
            return true
        } else {
            await web3Provider.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.chainid.rinkeby }],
            })
            return false
        }
    } catch (error) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.chainid.rinkeby }],
        })
        return false
    }
}

// signing function for registering dao
export const registerDaoToPocp = async (
    signer,
    name,
    ownerAddress,
    address
) => {
    const contract = new ethers.Contract(
        web3.POCP_Forwarder,
        Forwarder.abi,
        signer
    )
    const pocpProxy = new ethers.Contract(
        web3.POCP_Proxy,
        POCPProxy.abi,
        signer
    )
    const nonceBigNumber = await contract.getNonce(address.toString())
    const chainId = (await contract.provider.getNetwork()).chainId
    const nonce = parseInt(nonceBigNumber)

    const ForwardRequest = [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
    ]

    const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ]

    const typeSigningObject = {
        types: {
            ForwardRequest,
            //   EIP712Domain
        },
        domain: {
            name: "MinimalForwarder",
            version: "0.0.1",
            chainId,
            verifyingContract: contract.address,
        },
        primaryType: "ForwardRequest",
    }
    // await pocpProxy.register(name,ownerAddress)
    const data = {
        from: ownerAddress[0],
        to: pocpProxy.address,
        nonce,
        value: 0,
        gas: 1e6,
        data: pocpProxy.interface.encodeFunctionData("register", [
            name,
            ownerAddress,
        ]),
    }
    let signature
    try {
        signature = await signer._signTypedData(
            typeSigningObject.domain,
            typeSigningObject.types,
            data
        )
        return { data, signature }
    } catch (error) {
        // console.log("Error on signing register dao data", error)
    }
}

// signing function for approving badge
export const approvePOCPBadge = async (
    signer,
    communityId,
    address,
    claimers,
    cids,
    url
) => {
    // console.log('approver', communityId, address, claimers, cids, url)
    const contract = new ethers.Contract(
        web3.POCP_Forwarder,
        Forwarder.abi,
        signer
    )
    const pocpProxy = new ethers.Contract(
        web3.POCP_Proxy,
        POCPProxy.abi,
        signer
    )

    const nonceBigNumber = await contract.getNonce(address)
    const chainId = (await contract.provider.getNetwork()).chainId
    const nonce = parseInt(nonceBigNumber)

    const ForwardRequest = [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
    ]

    const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ]

    const typeSigningObject = {
        types: {
            ForwardRequest,
            //   EIP712Domain
        },
        domain: {
            name: "MinimalForwarder",
            version: "0.0.1",
            chainId,
            verifyingContract: contract.address,
        },
        primaryType: "ForwardRequest",
    }
    const data = {
        from: address,
        to: pocpProxy.address,
        nonce,
        value: 0,
        gas: 1e6,
        data: pocpProxy.interface.encodeFunctionData("approveBadge", [
            communityId,
            claimers,
            url,
            cids,
        ]),
    }
    let signature
    try {
        signature = await signer._signTypedData(
            typeSigningObject.domain,
            typeSigningObject.types,
            data
        )
        return { data, signature }
    } catch (error) {
        console.log("Error on signing approve contri  data", error)
    }
}

// signing function for claiming badges
export const claimPOCPBadges = async (signer, address, id) => {
    const contract = new ethers.Contract(
        web3.POCP_Forwarder,
        Forwarder.abi,
        signer
    )
    const pocpProxy = new ethers.Contract(
        web3.POCP_Proxy,
        POCPProxy.abi,
        signer
    )
    const nonceBigNumber = await contract.getNonce(address.toString())

    const chainId = (await contract.provider.getNetwork()).chainId

    const nonce = parseInt(nonceBigNumber)

    const ForwardRequest = [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "gas", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "data", type: "bytes" },
    ]

    const typeSigningObject = {
        types: {
            ForwardRequest,
        },
        domain: {
            name: "MinimalForwarder",
            version: "0.0.1",
            chainId,
            verifyingContract: contract.address,
        },
        primaryType: "ForwardRequest",
    }

    const data = {
        from: address,
        to: pocpProxy.address,
        nonce,
        value: 0,
        gas: 1e6,
        data: pocpProxy.interface.encodeFunctionData("claim", [id]),
    }
    let signature
    try {
        signature = await signer._signTypedData(
            typeSigningObject.domain,
            typeSigningObject.types,
            data
        )
        return { data, signature }
    } catch (error) {
        // console.log("Error on signing register dao data", error)
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
    console.log("uriiii", uri)
    if (uri) {
        return uri
    }
}

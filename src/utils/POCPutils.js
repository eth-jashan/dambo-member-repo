import axios from "axios";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { web3 } from "../constant/web3";
import Forwarder from '../smartContract/POCP_Contracts/minimalForwarder.json'
import POCPProxy from '../smartContract/POCP_Contracts/POCP.json'
import { getAuthToken } from "../store/actions/auth-action";

//signing function for registering dao
export const registerDaoToPocp = async(signer, name, ownerAddress, address) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
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
    ];

    const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ];

    const typeSigningObject = {
        types: {
          ForwardRequest,
        //   EIP712Domain
        },
        domain: {
          name: "MinimalForwarder",
          version: "0.0.1",
          chainId,
          verifyingContract:contract.address,
        },
        primaryType: "ForwardRequest",
    }
    // await pocpProxy.register(name,ownerAddress)
    const data = {
        from: ownerAddress[0],
        to: pocpProxy.address,
        nonce,
        value:0,
        gas:1e6,
        data: pocpProxy.interface.encodeFunctionData("register", [
            name,
            ownerAddress
        ]),
    }
    let signature
    try {
        signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);  
        return {data, signature} 
    } catch (error) {
        //console.log("Error on signing register dao data", error)
    }
    
}

//signing function for approving badge
export const approvePOCPBadge = async(signer, communityId, address, claimers, cids, url) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)

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
    ];

    const EIP712Domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ];

    const typeSigningObject = {
        types: {
          ForwardRequest,
        //   EIP712Domain
        },
        domain: {
          name: "MinimalForwarder",
          version: "0.0.1",
          chainId,
          verifyingContract:contract.address,
        },
        primaryType: "ForwardRequest",
    }
    const data = {
        from: address,
        to: pocpProxy.address,
        nonce,
        value:0,
        gas:1e6,
        data: pocpProxy.interface.encodeFunctionData("approveBadge", [
            communityId,
            claimers,
            url,
            cids
        ])
    }
    let signature
    try {
        signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);
        return {data, signature} 
    } catch (error) {
        //console.log("Error on signing register dao data", error)
    }
    
}

//signing function for claiming badges
export const claimPOCPBadges = async(signer, address, id) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
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
    ];

    const typeSigningObject = {
        types: {
          ForwardRequest,
        },
        domain: {
          name: "MinimalForwarder",
          version: "0.0.1",
          chainId,
          verifyingContract:contract.address,
        },
        primaryType: "ForwardRequest",
    }

    const data = {
        from: address,
        to: pocpProxy.address,
        nonce,
        value:0,
        gas:1e6,
        data: pocpProxy.interface.encodeFunctionData("claim", [
            id,
        ])
    }
    let signature
    try {
        signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);  
        return {data, signature} 
    } catch (error) {
        //console.log("Error on signing register dao data", error)
    }
    
}


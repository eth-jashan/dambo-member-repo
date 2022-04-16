import axios from "axios";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { web3 } from "../constant/web3";
import Forwarder from '../smartContract/POCP_Contracts/minimalForwarder.json'
import POCPProxy from '../smartContract/POCP_Contracts/POCP.json'
import { getAuthToken } from "../store/actions/auth-action";

//signing function for registering dao
export const registerDaoToPocp = async(signer, name, ownerAddress, address) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
    console.log('address',address)
    const nonceBigNumber = await contract.getNonce('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8')
    console.log('NONCE ===>', ethers.utils.formatEther( nonceBigNumber ))
    const chainId = (await contract.provider.getNetwork()).chainId
    console.log('Chain ID ===>', chainId)
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
        console.log("Error on signing register dao data", error)
    }
    console.log('signature for register dao', signature)
    
}

//signing function for approving badge
export const approvePOCPBadge = async(signer, communityId, address, claimers, cids) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)

    const nonceBigNumber = await contract.getNonce(address)
    console.log('NONCE ===>', ethers.utils.formatEther( nonceBigNumber ), address)
    const chainId = (await contract.provider.getNetwork()).chainId
    console.log('Chain ID ===>', chainId)
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
            [
              "https://bafybeifygcaberx6ei6xmrtflapevdqoeg2nkwdf4ozkavyrvafnv4snla.ipfs.infura-ipfs.io/",
            ],
            cids
        ])
    }
    let signature
    try {
        signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);
        return {data, signature} 
    } catch (error) {
        console.log("Error on signing register dao data", error)
    }
    console.log('signature for register dao', signature)
    
}

//signing function for claiming badges
export const claimPOCPBadges = async(signer, address) => {
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
    const userBadgeIds = await pocpProxy.userBadgeIds();
    const userBadge = await pocpProxy.userBadge(2);
    const nonceBigNumber = await contract.getNonce('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8')
    console.log('NONCE ===>', ethers.utils.formatEther( nonceBigNumber ))
    const chainId = (await contract.provider.getNetwork()).chainId
    console.log('Chain ID ===>', userBadge)
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

    // const data = {
    //     from: address,
    //     to: pocpProxy.address,
    //     nonce,
    //     value:0,
    //     gas:1e6,
    //     data: pocpProxy.interface.encodeFunctionData("claim", [
    //         // communityId,
    //         // claimers,
    //         [
    //             userBadgeIds[0],
    //         ],
    //     ])
    // }
    await pocpProxy.claim([2])
    // await pocpProxy.approveBadge(
    //     2,
    //     ['0x3ee2cf04a59fbb967e2b181a60eb802f36cf9fc8'],
    //     [
    //       "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzds",
    //     ],
    //     [1]
    // )
    // let signature
    // try {
    //     signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);  
    //     return {data, signature} 
    // } catch (error) {
    //     console.log("Error on signing register dao data", error)
    // }
    // console.log('signature for register dao', signature)
    
}


// create voucherToken for POCP badge
export const createVoucherSigning = async(claimer, voucher, signer) => {

    // All properties on a domain are optional
    const domain = {
        name: 'MinimalForwarder',
        version: '0.0.1',
        chainId: 4,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
    };

    // The named list of all type definitions
    const types = {
        NFTVoucher: [
            { name: "tokenId", type: "uint256[]" },
            { name: "communityId", type: "uint256" },
            { name: "uri", type: "string[]" },
            { name: "approvedFor", type: "address[]" },
            { name: "approvedBy", type: "address" },
        ],
    };
    
    const signature = await signer._signTypedData(domain, types, {tokenId:[1,2], communityId:1,uri:['https://ipfs.io/ipfs/Qmd3UnDWu3HKyXDqwnuvWv8Gg6rG1ppVkZKsYeMyYkrzHb','https://ipfs.io/ipfs/Qmd3UnDWu3HKyXDqwnuvWv8Gg6rG1ppVkZKsYeMyYkrzHb'], approvedFor:['0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8', '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'],approvedBy:"0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8"});
    console.log('signature ==>', signature)

    return {signature, voucher, claimer, types, domain}

    // async createVoucher(tokenId: any, uri: any, approvedFor: any, minPrice = 0) {
    //     const voucher = { tokenId, uri, minPrice, approvedFor };
    //     const domain = await this._signingDomain();
    //     const types = {
    //       NFTVoucher: [
    //         { name: "tokenId", type: "uint256" },
    //         { name: "minPrice", type: "uint256" },
    //         { name: "uri", type: "string" },
    //         { name: "approvedFor", type: "address" },
    //       ],
    //     };
    //     const signature = await this.signer._signTypedData(domain, types, voucher);
    //     return {
    //       // eslint-disable-next-line node/no-unsupported-features/es-syntax
    //       ...voucher,
    //       signature,
    //     };
    // }
    
}


export const createMetaTransactionSigning = async(signer) => {
    // let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    // let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
    // const nonceBigNumber = await contract.getNonce('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8')
    // console.log('NONCE ===>', ethers.utils.formatEther( nonceBigNumber ))
    // const chainId = (await contract.provider.getNetwork()).chainId
    // console.log('Chain ID ===>', chainId)
    // const nonce = parseInt(nonceBigNumber)
    // const communityId = await pocpProxy.totalCommunities();
    // console.log('community ', ethers.utils.formatEther( communityId ))
    

    // const typeSigningObject = {
    //     types: {
    //       ForwardRequest,
    //     },
    //     domain: {
    //       name: "MinimalForwarder",
    //       version: "0.0.1",
    //       chainId,
    //       verifyingContract:contract.address,
    //     },
    //     primaryType: "ForwardRequest",
    // }

    // const data = {
    //     from: '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8',
    //     to: pocpProxy.address,
    //     nonce,
    //     value:0,
    //     gas:1e6,
    //     data: pocpProxy.interface.encodeFunctionData("register", [
    //       "Drepute",
    //       "drepute.xyz",
    //       ["0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8","0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377"],
    //     ]),
    // }
    // pocpProxy.on("CommunityRegistered", (a, b, c, d) => {
    //     if(c === '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'){
    //         console.log("Registered Contract", a, b);
    //     }
    // })

    const decoded = '0x0c937a15a60c9893c79e2d47648755ab24ca3893'
    const encode = ethers.utils.defaultAbiCoder.decode(
        ['address'],
        decoded
    )
    console.log("Encode", encode)
    
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await (await provider.getTransaction('0xea8bee43f279e063e733f55822ed5353aad2d974419974cd7eab98832e0a28bf')).wait(x=>console.log(x))
    // console.log('transaction', tx)
    // const signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);
    // console.log('signature', signature, JSON.stringify(data))
    // return {signature}
    

}

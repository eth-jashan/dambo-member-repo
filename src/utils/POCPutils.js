import { ethers } from "ethers";
import { web3 } from "../constant/web3";
import Forwarder from '../smartContract/POCP_Contracts/minimalForwarder.json'
import POCPProxy from '../smartContract/POCP_Contracts/POCP.json'

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
            { name: "communityId", type: "uint256[]" },
            { name: "uri", type: "string[]" },
            { name: "approvedFor", type: "address[]" },
            { name: "approvedBy", type: "address" },
        ],
    };
    
    const signature = await signer._signTypedData(domain, types, voucher);
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
    let contract = new ethers.Contract(web3.POCP_Forwarder, Forwarder.abi, signer)
    let pocpProxy = new ethers.Contract(web3.POCP_Proxy, POCPProxy.abi, signer)
    const nonceBigNumber = await contract.getNonce('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8')
    console.log('NONCE ===>', ethers.utils.formatEther( nonceBigNumber ))
    const chainId = (await contract.provider.getNetwork()).chainId
    console.log('Chain ID ===>', chainId)
    const nonce = parseInt(nonceBigNumber)
    const communityId = await pocpProxy.totalCommunities();
    console.log('community ', ethers.utils.formatEther( communityId ))
      
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
        from: '0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8',
        to: pocpProxy.address,
        nonce,
        value:0,
        gas:1e6,
        data: pocpProxy.interface.encodeFunctionData("register", [
          "Drepute",
          "drepute.xyz",
          ["0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8","0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377"],
        ]),
    }
    // const res = await pocpProxy.register(
    //     parseInt(communityId).toString(),
    //     "Drepute",
    //     "drepute.xyz",
    //     ["0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377", "0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8"],
    // )

    // const decoded = '0xefc9a5d20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000074472657075746500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b647265707574652e78797a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000b6aeb5df6ff618a800536a5eb3a112200ff3c3770000000000000000000000003ee2cf04a59fbb967e2b181a60eb802f36cf9fc83ee2cf04a59fbb967e2b181a60eb802f36cf9fc8'
    // const encode = ethers.utils.defaultAbiCoder.decode(
    //     ['uint256', 'string', 'string', 'address[]'],
    //     ethers.utils.hexDataSlice(decoded, 4)
    // )
    // console.log("Encode", res)
    
    // const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // await (await provider.getTransaction('0xea8bee43f279e063e733f55822ed5353aad2d974419974cd7eab98832e0a28bf')).wait(x=>console.log(x))
    // console.log('transaction', tx)
    const signature = await signer._signTypedData(typeSigningObject.domain, typeSigningObject.types,data);
    console.log('signature', signature, JSON.stringify(data))
    // return {signature}
    

}
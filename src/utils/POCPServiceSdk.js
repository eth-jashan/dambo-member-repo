import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"
import { getSelectedChainId } from "./POCPutils"
import { web3 } from "../constant/web3"
const currentNetwork = getSelectedChainId()

let pocpInstance = null
// const pocpGetter = new PocpGetters(currentNetwork?.chainId === 4 ? 80001 : 137)
const pocpGetter = new PocpGetters(137)

export const initPOCP = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    pocpInstance = new Pocp(
        signer,
        provider,
        window.ethereum,
        // currentNetwork?.chainId === 4 ? 80001 : 137,
        137,
        {
            biconomyInstance: Biconomy,
            url: "",
            relayNetwork: currentNetwork?.chainId === 4 ? 80001 : 137,
            // relayNetwork: 137,
        }
    )

    await pocpInstance.createInstance()
}

export const claimVoucher = async (
    contractAddress,
    voucher,
    claimerAddressIndex,
    hashCallbackFn,
    callbackFn
) => {
    // const vouchers = {
    //     data: [257],
    //     end: [],
    //     to: ["0x0E4C5523f58F513C444535AB4ab2217E5D5DE942"],
    //     tokenUris: "bHBXZBbIc2-YZ-a7PzUpo_tYQTTuFOX9hSUuyLZOSJg,",
    //     signature:
    //         "0x3e24dbb85a135bdabbb976742f7088436daf2a17bdfe1c7bcc672d12d5e5dcab34202aa4ebf7294ed6c7b9afeb09753bf1b895f3ca515c9ea2ff58fb19e99fbe1c",
    // }
    console.log("Claiming details", pocpInstance, voucher, claimerAddressIndex)
    // console.log(vouchers, "0x9e00c9a53e71073cee827d54db9e32005d1b95ac")
    await pocpInstance.claimMembershipNft(
        contractAddress,
        voucher,
        0,
        async (x) => {
            console.log("Tranaction hash callback", x)
            await hashCallbackFn(x)
        },
        callbackFn
    )
}

export const upgradeMembershipNft = async (
    contractAddress,
    tokenId,
    level,
    category,
    metaDataHash,
    transactionHashCallback,
    callbackFunction
) => {
    await pocpInstance.upgradeMembershipNft(
        contractAddress,
        tokenId,
        level,
        category,
        metaDataHash,
        async (x) => {
            console.log("Tranaction hash callback", x)
            await transactionHashCallback(x)
        },
        callbackFunction
    )
}

export const deployDaoContract = async (
    daoName,
    daoSymbol,
    approverAddress,
    hashCallbackFn,
    confirmCallbackFn
) => {
    await pocpInstance.daoDeploy(
        daoName,
        daoSymbol,
        approverAddress,
        "0x083842b3F6739948D26C152C137929E0D3a906b9",
        "0xB9Acf5287881160e8CE66b53b507F6350d7a7b1B",
        hashCallbackFn,
        confirmCallbackFn
    )
}

export const getAllMembershipBadges = (accountAddress, contractAddress) => {
    return pocpGetter.membershipNftWithClaimerOfDao(
        accountAddress,
        contractAddress
    )
}

export const getMembershipBadgeFromTxHash = (txHash) => {
    return pocpGetter.getMembershipNftsForHash(txHash)
}

export const getInfoHash = async (txHash, currentDao) => {
    const res = await pocpGetter.getdaoInfoForHash(txHash)
    console.log("res", res, currentDao)
    return res
}

export const createMembershipVoucher = async (
    contractAddress,
    level,
    category,
    to,
    addresses,
    metadataHash
) => {
    console.log(
        "contract detail",
        contractAddress,
        level,
        category,
        to,
        addresses,
        metadataHash
    )
    try {
        return await pocpInstance.createMembershipVoucher(
            contractAddress,
            level,
            category,
            [],
            addresses,
            metadataHash
        )
    } catch (error) {
        console.log("error", error)
    }
}

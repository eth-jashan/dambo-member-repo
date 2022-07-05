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
    console.log(
        "Claiming details",
        pocpInstance,
        contractAddress === "0x3283620C58B0130020eb54B6Dec95298BfE42E8c",
        contractAddress,
        {
            data: [257],
            end: [],
            to: ["0xE46Acf7236056387B30D8180C547D2c2972807cF"],
            tokenUris: "PjK1v16DyILZtI1GpNKfKhP1vaNqax8RVL8BgB6w35s,",
            signature:
                "0xd649094da026b88694daf823f00d0bc77405555a690731080d22897282a1e46f565707d3b75b07c6ed0707e2ff4cfa6baedf8b3525244ddfc1e56a54c7a6daa81b",
        },
        claimerAddressIndex
    )
    const vouchers = {
        data: [257],
        end: [],
        to: ["0xE46Acf7236056387B30D8180C547D2c2972807cF"],
        tokenUris: "PjK1v16DyILZtI1GpNKfKhP1vaNqax8RVL8BgB6w35s,",
        signature:
            "0x9e5045e78264c41f438aaac4a310cb9780796fa7cd0307c474e6c004687ab2550cc6a1d876dcad144c8800255974e1d9775ecf1f7a97ffec7b383418378b43c41b",
    }
    console.log(vouchers)
    await pocpInstance.claimMembershipNft(
        "0x73A776bDF09B40e28e7d42318e8247FB3492AfB7",
        vouchers,
        claimerAddressIndex,
        (x) => {
            console.log("Tranaction hash callback", x)
            hashCallbackFn(x)
        },
        callbackFn
    )
}

export const deployDaoContract = async (
    daoName,
    daoSymbol,
    approverAddress,
    hashCallbackFn,
    confirmCallbackFn
) => {
    console.log(daoName, daoSymbol, approverAddress)
    await pocpInstance.daoDeploy(
        daoName,
        daoSymbol,
        approverAddress,
        "0x1f06C05EC5d69796CEF077369e50Ca347048CAC1",
        "0x36F7Fa526384D3471188bFAc93Db9d2C691C7fFA",
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
        web3.contractAddress,
        [1],
        [1],
        addresses,
        "PjK1v16DyILZtI1GpNKfKhP1vaNqax8RVL8BgB6w35s,",
        to
    )
    try {
        return await pocpInstance.createMembershipVoucher(
            web3.contractAddress,
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

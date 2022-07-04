import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"
import { getSelectedChainId } from "./POCPutils"
const currentNetwork = getSelectedChainId()

let pocpInstance = null
const pocpGetter = new PocpGetters(currentNetwork?.chainId === 4 ? 80001 : 137)
// const pocpGetter = new PocpGetters(137)

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
    callbackFn
) => {
    console.log(contractAddress, voucher, claimerAddressIndex)
    await pocpInstance.claimMembershipNft(
        contractAddress,
        voucher,
        claimerAddressIndex,
        (x) => {
            console.log("Tranaction hash callback", x)
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
        "0xDcc7133abBA15B8f4Bf155A372C17744E0941f28",
        "0x1C6D20042bfc8474051Aba9FB4Ff85880089A669",
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

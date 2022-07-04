import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"
import { getSelectedChainId } from "./POCPutils"
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
        contractAddress,
        voucher,
        claimerAddressIndex
    )
    await pocpInstance.claimMembershipNft(
        contractAddress,
        voucher,
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
    console.log("contract detail", contractAddress)
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

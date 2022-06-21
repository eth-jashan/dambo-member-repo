import POCP, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"

let pocpInstance = null
const pocpGetter = new PocpGetters(80001)

export const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    pocpInstance = new POCP(signer, provider, {
        biconomyInstance: Biconomy,
        url: "",
        relayNetwork: 80001,
    })

    console.log("creating instance")

    await pocpInstance.createInstance()
    console.log("created instance")
}

export const claimVoucher = (contractAddress, voucher, claimerAddressIndex) => {
    console.log("Pocp instance", pocpInstance)
    return pocpInstance.claimVoucher(
        contractAddress,
        voucher,
        claimerAddressIndex
    )
}

export const getAllMembershipBadges = (accountAddress) => {
    return pocpGetter.getMembershipNfts(accountAddress)
}

export const getMembershipBadgeFromTxHash = (txHash) => {
    return pocpGetter.getMembershipNftsForHash(txHash)
}

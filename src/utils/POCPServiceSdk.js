import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"

let pocpInstance = null
const pocpGetter = new PocpGetters(80001)

export const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    pocpInstance = new Pocp(signer, provider, window.ethereum, 80001, {
        biconomyInstance: Biconomy,
        url: "",
        relayNetwork: 80001,
    })

    await pocpInstance.createInstance()
}

export const claimVoucher = async (
    contractAddress,
    voucher,
    claimerAddressIndex,
    callbackFn
) => {
    await pocpInstance.claimMembershipNft(
        contractAddress,
        voucher,
        claimerAddressIndex,
        callbackFn
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

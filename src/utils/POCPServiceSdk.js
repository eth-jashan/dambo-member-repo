import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"
import { getSelectedChainId } from "./POCPutils"
const currentNetwork = getSelectedChainId()

let pocpInstance = null
const pocpGetter = new PocpGetters(currentNetwork?.chainId === 4 ? 80001 : 137)

export const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    pocpInstance = new Pocp(
        signer,
        provider,
        window.ethereum,
        currentNetwork?.chainId === 4 ? 80001 : 137,
        {
            biconomyInstance: Biconomy,
            url: "",
            relayNetwork: currentNetwork?.chainId === 4 ? 80001 : 137,
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

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
    const vouchers = {
        data: [257],
        end: [],
        to: ["0x0E4C5523f58F513C444535AB4ab2217E5D5DE942"],
        tokenUris: "bHBXZBbIc2-YZ-a7PzUpo_tYQTTuFOX9hSUuyLZOSJg,",
        signature:
            "0x3e24dbb85a135bdabbb976742f7088436daf2a17bdfe1c7bcc672d12d5e5dcab34202aa4ebf7294ed6c7b9afeb09753bf1b895f3ca515c9ea2ff58fb19e99fbe1c",
    }
    console.log("Claiming details", pocpInstance, vouchers, claimerAddressIndex)
    console.log(vouchers, "0x9e00c9a53e71073cee827d54db9e32005d1b95ac")
    await pocpInstance.claimMembershipNft(
        "0x9e00c9a53e71073cee827d54db9e32005d1b95ac",
        vouchers,
        0,
        async (x) => {
            console.log("Tranaction hash callback", x)
            await hashCallbackFn(x)
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
        level,
        category,
        [],
        addresses,
        "bHBXZBbIc2-YZ-a7PzUpo_tYQTTuFOX9hSUuyLZOSJg,"
    )
    try {
        return await pocpInstance.createMembershipVoucher(
            web3.contractAddress,
            level,
            category,
            [],
            addresses,
            "bHBXZBbIc2-YZ-a7PzUpo_tYQTTuFOX9hSUuyLZOSJg,"
        )
    } catch (error) {
        console.log("error", error)
    }
}

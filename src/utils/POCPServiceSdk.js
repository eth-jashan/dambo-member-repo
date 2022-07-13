import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import { ethers } from "ethers"
import { getSelectedChainId } from "./POCPutils"
import { web3 } from "../constant/web3"
const currentNetwork = getSelectedChainId()

let pocpInstance = null
// const pocpGetter = new PocpGetters(currentNetwork?.chainId === 4 ? 80001 : 137)

export const initPOCP = async (dao_uuid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    pocpInstance = new Pocp(
        signer,
        provider,
        window.ethereum,
        currentNetwork?.chainId === 4 ? 80001 : 137,
        currentNetwork?.chainId === 4
            ? web3.rep3Mumbai
            : dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? web3.rep3V1Matic
            : web3.rep3V2Matic,
        {
            biconomyInstance: Biconomy,
            apiKey:
                currentNetwork?.chainId === 4
                    ? "h3GRiJo5V.ea5e72c1-a3dd-44cf-824e-1bd77a681ff7"
                    : dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
                    ? "a1SusDqqY.24edf34d-6125-4026-af88-b156a96b7f85"
                    : "gD5tL5Hyt.caf51015-4e19-4873-9540-65443a4519e9",
            relayURL:
                currentNetwork?.chainId === 4
                    ? "https://polygon-mumbai.g.alchemy.com/v2/8zhyGM-aq1wJ4TFspyVp-dOAQ27TWozK"
                    : "https://polygon-mainnet.g.alchemy.com/v2/gBoo6ihGnSUa3ObT49K36yHG6BdtyuVo",
        }
    )

    await pocpInstance.createInstance()
}

export const claimVoucher = async (
    contractAddress,
    voucher,
    claimerAddressIndex,
    dao_uuid,
    hashCallbackFn,
    callbackFn
) => {
    await pocpInstance.claimMembershipNft(
        contractAddress,
        voucher,
        claimerAddressIndex,
        dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? "signTypedDatav1.0"
            : "signTypedDatav2.0",
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
        currentNetwork?.chainId === 4
            ? "0xDcc7133abBA15B8f4Bf155A372C17744E0941f28"
            : "0x083842b3F6739948D26C152C137929E0D3a906b9",
        currentNetwork?.chainId === 4
            ? "0x1C6D20042bfc8474051Aba9FB4Ff85880089A669"
            : "0xB9Acf5287881160e8CE66b53b507F6350d7a7b1B",
        hashCallbackFn,
        confirmCallbackFn
    )
}

export const getAllMembershipBadges = (
    accountAddress,
    contractAddress,
    uuid
) => {
    const pocpGetter = new PocpGetters(
        currentNetwork?.chainId === 4
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-mumbai"
            : uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/pocpv15-matic"
            : "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-matic"
    )
    return pocpGetter.membershipNftWithClaimerOfDao(
        accountAddress,
        contractAddress
    )
}

export const getMembershipBadgeFromTxHash = (txHash, uuid) => {
    const pocpGetter = new PocpGetters(
        currentNetwork?.chainId === 4
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-mumbai"
            : uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/pocpv15-matic"
            : "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-matic"
    )
    return pocpGetter.getMembershipNftsForHash(txHash)
}

export const getMembershipBadgeFromClaimer = (
    claimer,
    contractAddress,
    uuid
) => {
    const pocpGetter = new PocpGetters(
        currentNetwork?.chainId === 4
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-mumbai"
            : uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/pocpv15-matic"
            : "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-matic"
    )
    return pocpGetter.membershipNftWithClaimerOfDao(claimer, contractAddress)
}

export const getInfoHash = async (txHash, uuid) => {
    const pocpGetter = new PocpGetters(
        currentNetwork?.chainId === 4
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-mumbai"
            : uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? "https://api.thegraph.com/subgraphs/name/eth-jashan/pocpv15-matic"
            : "https://api.thegraph.com/subgraphs/name/eth-jashan/rep3-matic"
    )

    const res = await pocpGetter.getdaoInfoForHash(txHash)
    return res
}

export const createMembershipVoucher = async (
    contractAddress,
    level,
    category,
    to,
    addresses,
    metadataHash,
    dao_uuid
) => {
    try {
        return await pocpInstance.createMembershipVoucher(
            contractAddress,
            level,
            category,
            [],
            addresses,
            metadataHash,
            dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
                ? "signTypedDatav1.0"
                : "signTypedDatav2.0"
        )
    } catch (error) {
        console.log("error", error)
    }
}

import Pocp, { PocpGetters } from "pocp-service-sdk"
import { Biconomy } from "@biconomy/mexa"
import apiClient from "../utils/api_client"
import { getSelectedChainId } from "./wagmiHelpers"
import { web3 } from "../constant/web3"
import Web3 from "web3"
import axios from "axios"
const currentNetwork = getSelectedChainId()

let pocpInstance = null
// const pocpGetter = new PocpGetters(currentNetwork?.chainId === 4 ? 80001 : 137)

export const initPOCP = async (dao_uuid, provider, signer, chainId) => {
    const walletWeb3 = new Web3(provider)
    const walletProvider = walletWeb3.givenProvider

    pocpInstance = new Pocp(
        signer,
        provider,

        signer.provider.provider,

        chainId === 4 ? 80001 : 137,
        chainId === 4
            ? web3.rep3Mumbai
            : dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
            ? web3.rep3V1Matic
            : web3.rep3V2Matic,
        {
            biconomyInstance: Biconomy,
            apiKey:
                chainId === 4
                    ? "h3GRiJo5V.ea5e72c1-a3dd-44cf-824e-1bd77a681ff7"
                    : dao_uuid === "981349a995c140d8b7fb5c110b0d133b"
                    ? "a1SusDqqY.24edf34d-6125-4026-af88-b156a96b7f85"
                    : "gD5tL5Hyt.caf51015-4e19-4873-9540-65443a4519e9",
            relayURL:
                chainId === 4
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

export const getArrayOfMemberToken = async (
    arrayOfAddress,
    contractAddress
) => {
    // const tokenId = []
    const result = Promise.all(
        arrayOfAddress.map(async (x) => {
            const memberships = await getAllMembershipBadges(
                x,
                contractAddress,
                false
            )
            console.log(
                "memberships",
                memberships.data.membershipNFTs[0].tokenID
            )
            return parseInt(memberships.data.membershipNFTs[0].tokenID)
        })
    )
    return result
}

export const getArrayOfNounce = async (arrayOfMemberToken, dao_uuid, jwt) => {
    const result = Promise.all(
        arrayOfMemberToken.map(async (x) => {
            const res = await apiClient.get(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${`/membership/get_next_nonce`}?token_id=${x}&dao_uuid=${dao_uuid}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            if (res.data.success) {
                return res.data.data
            }
        })
    )
    return result
}

export const createContributionVoucher = async (
    contractAddress,
    arrayOfMemberTokenId,
    arrayofBadgeType,
    arrayOfTokenUri,
    arrayOfNounce,
    arrayOfData
) => {
    try {
        return await pocpInstance.createBadgeVoucher(
            contractAddress,
            arrayOfMemberTokenId,
            arrayofBadgeType,
            arrayOfTokenUri,
            arrayOfNounce,
            arrayOfData
        )
    } catch (error) {
        console.log("error", error)
    }
}

export const claimContributionBadge = async (
    contractAddress,
    voucher,
    memberTokenId,
    approveIndex,
    hashCallbackFn,
    callbackFn
) => {
    try {
        return await pocpInstance.claimContributionBadges(
            contractAddress,
            voucher,
            memberTokenId,
            approveIndex,
            hashCallbackFn,
            callbackFn
        )
    } catch (error) {}
}

export const createContributionMetadataUri = async (
    title,
    daoName,
    approveDate,
    logoUrl
) => {
    try {
        console.log(
            JSON.stringify({
                title,
                daoName,
                approveDate,
                logoUrl,
            })
        )
        const res = await axios.post(
            `https://test-staging.api.drepute.xyz/arweave_server/contribution-badge`,
            JSON.stringify({
                title,
                daoName,
                approveDate,
                logoUrl,
            })
        )
        if (res.data.success) {
            return res.data.data
        }
    } catch (error) {
        console.log("error ", error)
    }
}

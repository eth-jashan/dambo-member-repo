import React, { useEffect, useState } from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import {
    getAllTokensOfSafe,
    getAllNFTsOfSafe,
} from "../../store/actions/dao-action"
import DashboardSearchTab from "../DashboardSearchTab"
import PaymentCard from "../PaymentCard"
import { ethers } from "ethers"
import { getSelectedChainId } from "../../utils/POCPutils"
import TreasurySignersModal from "../Modal/TreasurySignersModal"

export default function TreasuryDetails() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const currentUserAddress = useSelector((x) => x.auth.address)
    const tokensBalanceInUsd = useSelector((x) => x.dao.tokensBalanceInUsd)
    const NFTs = useSelector((x) => x.dao.NFTs)
    const [selectedNav, setSelectedNav] = useState("tokens")
    const payout_request = useSelector((x) => x.dao.payout_filter)
    const [signer, setSigner] = useState()

    const dispatch = useDispatch()
    const currentChainId = getSelectedChainId().chainId
    const [isModalVisible, setIsModalVisible] = useState(false)

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleClose = () => {
        setIsModalVisible(false)
    }

    useEffect(() => {
        dispatch(getAllTokensOfSafe())
        dispatch(getAllNFTsOfSafe())
    }, [])

    const setProvider = async () => {
        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        )
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        setSigner(signer)
    }

    useEffect(() => {
        setProvider()
    }, [])

    const copySafeAddress = async () => {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(
                currentDao?.safe_public_address
            )
        } else {
            return document.execCommand(
                "copy",
                true,
                currentDao?.safe_public_address
            )
        }
    }

    const openTreasuryOnEtherscan = () => {
        const link = `https://${
            currentChainId === 4 ? "rinkeby." : ""
        }etherscan.io/address/${currentDao?.safe_public_address}`
        window.open(link)
    }

    const onNavLinkClick = (linkName) => {
        if (linkName === "tokens") {
            dispatch(getAllTokensOfSafe())
        } else {
            dispatch(getAllNFTsOfSafe())
        }
        setSelectedNav(linkName)
    }

    const getTokenBalance = (tokenDetails) => {
        if (tokenDetails.token) {
            return (
                tokenDetails.balance / Math.pow(10, tokenDetails.token.decimals)
            )
        } else {
            // this is in case of ethereum
            return tokenDetails.balance / Math.pow(10, 18)
        }
    }

    const openGnosisNft = () => {
        window.open(
            `https://gnosis-safe.io/app/${currentChainId === 4 ? "rin:" : ""}${
                currentDao?.safe_public_address
            }/balances/nfts`
        )
    }

    const gnosisSignerLink = `https://gnosis-safe.io/app/${
        currentChainId === 4 ? "rin:" : ""
    }${currentDao?.safe_public_address}/settings/owners`

    return (
        <div className="treasury-details-container">
            {isModalVisible && (
                <TreasurySignersModal
                    onClose={handleClose}
                    signers={currentDao?.signers}
                    gnosisSignerLink={gnosisSignerLink}
                />
            )}
            <div className="treasury-info-wrapper">
                <div className="safe-info-wrapper">
                    <div className="safe-details">
                        <div className="safe-name-and-avatar-wrapper">
                            <div className="safe-avatar">
                                {currentDao?.logo_url ? (
                                    <img
                                        src={currentDao?.logo_url}
                                        alt="logo"
                                    />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            <div className="safe-name-and-address">
                                <div className="safe-name">
                                    {currentDao?.name}
                                </div>
                                <div className="safe-address">
                                    eth:
                                    {currentDao?.safe_public_address?.slice(
                                        0,
                                        5
                                    )}
                                    ...
                                    {currentDao?.safe_public_address?.slice(-4)}
                                </div>
                            </div>
                        </div>
                        <div className="safe-links">
                            <div className="link" onClick={copySafeAddress}>
                                Copy address
                            </div>
                            <div className="separator">•</div>
                            <div
                                className="link"
                                onClick={openTreasuryOnEtherscan}
                            >
                                View on etherscan
                            </div>
                        </div>
                    </div>
                    <div className="safe-owner-details">
                        <div className="safe-owner-heading">
                            Multisig Signers
                        </div>
                        {currentDao?.signers.slice(0, 3).map((signer) => (
                            <div
                                className="owner-row"
                                key={signer.public_address}
                            >
                                <div className="owner-name">
                                    {currentUserAddress ===
                                    signer.public_address
                                        ? "You"
                                        : signer?.metadata?.name.slice(0, 8)}
                                </div>
                                <div className="owner-address">
                                    {signer.public_address.slice(0, 5)}...
                                    {signer.public_address.slice(-4)}
                                </div>
                            </div>
                        ))}
                        {currentDao?.signers.length > 3 ? (
                            <div className="more-signers" onClick={showModal}>
                                and {currentDao?.signers.length - 3} more
                            </div>
                        ) : (
                            <div className="manage-signers">
                                Visit{" "}
                                <a
                                    href={gnosisSignerLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Gnosis
                                </a>{" "}
                                to manage signers
                            </div>
                        )}
                    </div>
                </div>
                <div className="treasury-tokens-info">
                    <div className="treasury-tokens-nav">
                        <div
                            className={`nav-link ${
                                selectedNav === "tokens" && "active-link"
                            }`}
                            onClick={() => onNavLinkClick("tokens")}
                        >
                            Tokens ({tokensBalanceInUsd?.length || 0})
                        </div>
                        <div
                            className={`nav-link ${
                                selectedNav === "nfts" && "active-link"
                            }`}
                            onClick={() => onNavLinkClick("nfts")}
                        >
                            NFTs ({NFTs?.length || 0})
                        </div>
                    </div>
                    <div className="token-details-wrapper">
                        {selectedNav === "tokens" ? (
                            <>
                                <div className="token-details-header token-details-row">
                                    <div className="token-details-left">
                                        Asset
                                    </div>
                                    <div className="token-details-right">
                                        <div>Balance</div>
                                        <div>Value</div>
                                    </div>
                                </div>
                                <div className="token-details-usd-wrapper">
                                    {tokensBalanceInUsd.map(
                                        (tokenDetails, index) => (
                                            <div
                                                className="token-details-row"
                                                key={index}
                                            >
                                                <div className="token-details-left">
                                                    {tokenDetails.token
                                                        ? tokenDetails.token
                                                              .symbol
                                                        : "ETH"}
                                                </div>
                                                <div className="token-details-right">
                                                    <div>
                                                        {getTokenBalance(
                                                            tokenDetails
                                                        )}
                                                    </div>
                                                    <div>
                                                        {
                                                            tokenDetails.fiatBalance
                                                        }{" "}
                                                        USD
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                    <a
                                        href={`https://gnosis-safe.io/app/${
                                            currentChainId === 4 ? "rin:" : ""
                                        }${currentDao?.safe_public_address}`}
                                        target="_blank"
                                        className="view-on-gnosis"
                                        rel="noreferrer"
                                    >
                                        View on Gnosis
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="all-nfts-wrapper">
                                {NFTs.map((nft, index) => (
                                    <div
                                        className="nft"
                                        key={index}
                                        onClick={() => openGnosisNft()}
                                    >
                                        <img src={nft.imageUrl} alt="nft" />
                                        <div className="nft-name">
                                            {nft.tokenName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="scroll-shim"></div>
                    </div>
                </div>
            </div>
            <div className="treasury-transactions-wrapper">
                <DashboardSearchTab route="payments" />
                {payout_request.length > 0 ? (
                    <div>
                        <div className="payment-cards-wrapper">
                            {payout_request.map((item, index) => (
                                <PaymentCard
                                    signer={signer}
                                    item={item}
                                    key={index}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    )
}

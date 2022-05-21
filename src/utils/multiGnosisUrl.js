import { ethers } from "ethers"

export const getSafeServiceUrl = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = await provider.getSigner()
    const chainId = await signer.getChainId()
    switch (chainId) {
        case 4:
            return "https://safe-transaction.rinkeby.gnosis.io/"
        case 8001:
            return ""
        case 1:
            return "https://safe-transaction.mainnet.gnosis.io/"
        case 5:
            return "https://safe-transaction.goerli.gnosis.io/"
        case 137:
            return "https://safe-transaction.polygon.gnosis.io/"
        default:
            return false
    }
}

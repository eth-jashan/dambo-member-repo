import { getSelectedChainId } from "./wagmiHelpers"

export const getSafeServiceUrl = () => {
    const chainId = getSelectedChainId()?.chainId
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
        case 10:
            return "https://safe-transaction.optimism.gnosis.io/"
        default:
            return false
    }
}

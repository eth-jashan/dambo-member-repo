export const getSelectedChainId = () => {
    const chainId = JSON.parse(localStorage.getItem("chain_info"))
    return chainId
}

export const setChainInfoAction = (chainId) => {
    localStorage.setItem(
        "chain_info",
        JSON.stringify({
            chainId,
        })
    )
}

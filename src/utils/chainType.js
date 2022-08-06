export const chainType = (chainId) => {
    if (
        chainId === 1 ||
        chainId === 100 ||
        chainId === 137 ||
        chainId === 56 ||
        chainId === 246 ||
        chainId === 10 ||
        chainId === 43114 ||
        chainId === 1313161554
    ) {
        return "Mainnet"
    } else if (
        chainId === 4 ||
        chainId === 420 ||
        chainId === 73799 ||
        chainId === 80001 ||
        chainId === 5
    ) {
        return "Testnet"
    }
    // returning Nan so that it doesn't club all other chains as NaN === NaN is false
    return NaN
}

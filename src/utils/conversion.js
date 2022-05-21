import axios from "axios"

export const convertTokentoUsd = async (token) => {
    try {
        const res = await axios.get(
            `${process.env.REACT_APP_COINBASE_URL}${token}-USD/spot`
        )
        let amount = res.data.data.amount
        amount = parseFloat(amount).toFixed(2)
        return amount
    } catch (error) {
        return false
    }
}

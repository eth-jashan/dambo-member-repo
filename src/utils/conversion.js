import axios from "axios"
import api from "../constant/api"

export const convertTokentoUsd = async(token) => {
    try {
        const res = await axios.get(`${api.coinbase.prices}${token}-USD/spot`)
        let amount = res.data.data.amount
        amount = parseFloat(amount).toFixed(2)
        return amount
    } catch (error) {
        return false
    }
}

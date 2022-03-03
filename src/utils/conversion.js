import axios from "axios"
import api from "../constant/api"

export const convertTokentoUsd = async(token) => {
    try {
        const res = await axios.get(`${api.coinbase.prices}${token}-USD/spot`)
        console.log('res',res.data.data.amount)
        return res.data.data.amount
    } catch (error) {
        return ''
    }
}
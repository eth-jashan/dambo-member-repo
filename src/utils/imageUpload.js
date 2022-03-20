import axios from "axios"
import api from "../constant/api"

export const uploadImageToS3 = async(name, formData) => {
    try {
        const res = await axios.get(`${api.s3Uplaod.url}key=${name}`)
        const imageUrl = await axios.put(`${res.data.uploadURL}`,formData)
        console.log('image', imageUrl)
    } catch (error) {
        return false
    }
}

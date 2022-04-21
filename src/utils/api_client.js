import { message } from "antd"
import axios from "axios"
// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response
    },
    function (error) {
        // Do something with response error
        if (error.response.status === 401) {
            message.error("Token Expired")
            window.location.href = "/"
        }
        return Promise.reject(error)
    }
)

export default axios

import React, { useEffect } from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import { message } from "antd"
import { setShowToast } from "../../../store/actions/toast-action"

export default function AntdToast() {
    const toastInfo = useSelector((x) => x.toast.toastInfo)
    const showToast = useSelector((x) => x.toast.showToast)

    const dispatch = useDispatch()

    useEffect(() => {
        if (showToast) {
            switch (toastInfo.toastType) {
                case "success":
                    message.success(toastInfo.content)
                    break
                case "error":
                    message.error(toastInfo.content)
                    break
                default:
                    message.success(toastInfo.content)
                    break
            }
            setTimeout(() => {
                dispatch(setShowToast(false))
            }, 0)
        }
    }, [showToast])
    return <></>
}

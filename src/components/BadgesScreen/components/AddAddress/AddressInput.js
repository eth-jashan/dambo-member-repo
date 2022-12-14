import React, { useState } from "react"
import { assets } from "../../../../constant/assets"
import cross from "../../../../assets/Icons/cross.svg"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import {
    getAllMembershipBadges,
    getMembershipBadgeFromClaimer,
} from "../../../../utils/POCPServiceSdk"
import { ethers } from "@biconomy/mexa/node_modules/ethers"
import Lottie from "react-lottie"
import black_loader from "../../../../assets/lottie/Loader_Black_Lottie.json"
import { getAllMembershipVouchers } from "../../../../store/actions/membership-action"

const AddressInput = ({
    address,
    index,
    updateAddress,
    deleteAddress,
    updateStatus,
    type = "membership-voucher-check",
}) => {
    const [onFocus, setOnFocus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [addressStatus, setAddressStatus] = useState("not-validate")

    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const userAddress = useSelector((x) => x.auth.address)
    const currentDao = useSelector((x) => x.dao.currentDao)
    //get_voucher?dao_uuid=&addr=

    const dispatch = useDispatch()

    const getMembershipVoucher = async (address) => {
        const isAddress = ethers.utils.isAddress(address)
        if (isAddress) {
            setLoading(true)
            try {
                const res = await dispatch(getAllMembershipVouchers(address))
                setLoading(false)
                if (res.length > 0) {
                    setAddressStatus("fail")
                    updateStatus(false, index)
                } else {
                    setAddressStatus("success")
                    updateStatus(true, index)
                }
            } catch (error) {
                setLoading(false)
                setAddressStatus("fail")
                updateStatus(false, index)
            }
        }
    }

    const getClaimedBadge = async (address) => {
        const isAddress = ethers.utils.isAddress(address)
        if (isAddress) {
            setLoading(true)
            try {
                const res = await getAllMembershipBadges(address, proxyContract)
                setLoading(false)
                if (res.data.membershipNFTs.length > 0) {
                    setAddressStatus("success")
                    updateStatus(true, index)
                } else {
                    setAddressStatus("fail")
                    updateStatus(false, index)
                }
            } catch (error) {
                setLoading(false)
                setAddressStatus("fail")
                updateStatus(false, index)
            }
        }
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: black_loader,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const lottieLoader = () => (
        <Lottie
            options={defaultOptions}
            style={{ height: "1.5rem", width: "1.5rem" }}
        />
    )

    const getFunctionOnType = async (x) => {
        switch (type) {
            case "membership-voucher-check":
                return await getMembershipVoucher(x)
            case "membership-badge-claimed":
                return await getClaimedBadge(x)
            default:
                return null
        }
    }

    const getErrorTitle = () => {
        switch (type) {
            case "membership-voucher-check":
                return "Badge minted already"
            case "membership-badge-claimed":
                return "Badge not minted yet"
            default:
                return null
        }
    }
    return (
        <div>
            <div className="address-row" key={index}>
                <div className={!onFocus ? `input-div-address` : `input-div`}>
                    {addressStatus === "fail" && (
                        <div className="overlay-error">{getErrorTitle()}</div>
                    )}
                    <input
                        type="text"
                        onFocus={() => {
                            setOnFocus(true)
                            if (addressStatus === "fail") {
                                setAddressStatus("not-validate")
                                updateAddress("", index)
                            }
                        }}
                        onBlur={async () => {
                            setOnFocus(false)
                            if (addressStatus === "fail") {
                                setAddressStatus("not-validate")
                                updateAddress("", index)
                            }
                        }}
                        className="address-input"
                        value={address}
                        onChange={async (e) => {
                            updateAddress(e.target.value, index)
                            await getFunctionOnType(e.target.value)
                        }}
                        placeholder="Enter Address"
                    />
                    {loading && lottieLoader()}
                    {addressStatus === "success" && (
                        <img
                            className="check-icon"
                            src={assets.icons.checkIcon}
                        />
                    )}
                    {addressStatus === "fail" && (
                        <img
                            className="warning-icon"
                            src={assets.icons.redWarningIcon}
                        />
                    )}
                </div>
                <div
                    className="address-delete"
                    onClick={() => deleteAddress(index)}
                >
                    <img src={cross} alt="" />
                </div>
            </div>
        </div>
    )
}

export default AddressInput

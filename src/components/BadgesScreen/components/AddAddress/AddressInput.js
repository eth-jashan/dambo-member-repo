import React, { useState } from "react"
import { assets } from "../../../../constant/assets"
import cross from "../../../../assets/Icons/cross.svg"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { getMembershipBadgeFromClaimer } from "../../../../utils/POCPServiceSdk"
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
}) => {
    const [onFocus, setOnFocus] = useState(false)
    const [loading, setLoading] = useState(false)
    const [addressStatus, setAddressStatus] = useState("not-validate")

    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const userAddress = useSelector((x) => x.auth.address)
    const currentDao = useSelector((x) => x.dao.currentDao)
    //get_voucher?dao_uuid=&addr=

    const dispatch = useDispatch()

    const getMembershipNftForAddress = async (address) => {
        const isAddress = ethers.utils.isAddress(address)
        console.log(isAddress)
        if (isAddress) {
            setLoading(true)
            try {
                // const res = await getMembershipBadgeFromClaimer(
                //     address,
                //     proxyContract,
                //     currentDao?.uuid
                // )
                const res = await dispatch(getAllMembershipVouchers())
                console.log("Here", res)
                setLoading(false)
                // if (res.data.membershipNFTs.length > 0) {
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

    return (
        <div>
            <div className="address-row" key={index}>
                <div className={!onFocus ? `input-div-address` : `input-div`}>
                    {addressStatus === "fail" && (
                        <div className="overlay-error">
                            Badge minted already
                        </div>
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
                            await getMembershipNftForAddress(e.target.value)
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

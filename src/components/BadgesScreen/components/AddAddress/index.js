import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import upload_file_colored from "../../../../assets/Icons/upload_file_colored.svg"
import tick from "../../../../assets/Icons/tick.svg"
import right_arrow_white from "../../../../assets/Icons/right_arrow_white.svg"
import {
    getAllDaoMembers,
    mintBadges,
    setShowMembershipMintingModal,
} from "../../../../store/actions/membership-action"
import { useDispatch, useSelector } from "react-redux"

export default function AddAddress({ selectedMembershipBadge, closeModal }) {
    const [isBulkMinting, setIsBulkMinting] = useState(false)
    const [addresses, setAddresses] = useState([""])
    const [bulkMintingStep, setBulkMintingStep] = useState(0)
    const [isCsvUploaded, setIsCsvUploaded] = useState(false)
    const [bulkAddresses, setBulkAddresses] = useState([])
    const currentDao = useSelector((x) => x.dao.currentDao)

    const dispatch = useDispatch()

    const addAddress = () => {
        setAddresses((addresses) => [...addresses, ""])
    }

    const updateAddress = (value, index) => {
        const copyOfAddresses = [...addresses]
        copyOfAddresses[index] = value
        setAddresses(copyOfAddresses)
    }

    const deleteAddress = (deletingIndex) => {
        const copyOfAddressesAfterDelete = [...addresses].filter(
            (_, index) => index !== deletingIndex
        )
        setAddresses(copyOfAddressesAfterDelete)
    }

    const onFileChange = (e) => {
        const fileReader = new FileReader()

        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        fileReader.readAsText(files[0])

        fileReader.onload = (event) => {
            // csvFileToArray(text)
            console.log("event in file reader load ", event)
            const arr = event.target?.result?.split(",")
            setBulkAddresses(arr)
            setIsCsvUploaded(true)
        }
    }

    const increaseStep = async () => {
        if (bulkMintingStep >= 1) {
            setBulkMintingStep(1)
            await mintVouchers()
            // console.log("hhere")
            // dispatch(setShowMembershipMintingModal(false))
        } else {
            setBulkMintingStep((bulkMintingStep) => bulkMintingStep + 1)
        }
    }

    const mintVouchers = async () => {
        console.log("minting badges")
        const mintAddresses = isBulkMinting ? bulkAddresses : addresses
        try {
            await dispatch(mintBadges(selectedMembershipBadge, mintAddresses))
            await dispatch(getAllDaoMembers())
            dispatch(setShowMembershipMintingModal(false))
        } catch (error) {
            console.log("error on signinig", error.toString())
        }
    }

    const checkIsDisabled = () => {
        let isDisabled = false
        if (isBulkMinting) {
            bulkAddresses.forEach((address) => {
                if (!address) {
                    isDisabled = true
                }
            })
        } else {
            addresses.forEach((address) => {
                if (!address) {
                    isDisabled = true
                }
            })
        }
        return isDisabled
    }

    return (
        <div className="add-address-screen-container">
            <div className="close-minting-modal">
                <img src={cross} alt="" />
            </div>
            <div className="mint-membership-badge-header">
                <div className="mint-membership-badge-left">
                    <div>Minting</div>
                    <div>Membership badges</div>
                    <div className="mint-membership-badge-name">
                        {selectedMembershipBadge.name}
                    </div>
                </div>
                <div className="mint-membership-badge-right">
                    {currentDao?.uuid !== "93ba937e02ea4fdb9633c2cb27345200" ? (
                        <img src={selectedMembershipBadge.image_url} alt="" />
                    ) : (
                        <video
                            autoPlay
                            loop
                            // className={styles.badgeImage}
                            muted
                        >
                            <source src={selectedMembershipBadge?.image_url} />
                        </video>
                    )}
                </div>
            </div>
            {isBulkMinting ? (
                <div className="bulk-minting-wrapper">
                    <div className="bulk-minting-step-row">
                        <div className="bold">
                            Step {bulkMintingStep + 1} of 2 •
                        </div>
                        {bulkMintingStep === 0
                            ? "Upload Addresses"
                            : "Review Address"}
                    </div>
                    <div className="bulk-minting-uploader-wrapper">
                        {bulkMintingStep === 0 ? (
                            <>
                                <label htmlFor="upload-csv-file-input">
                                    <div className="csv-uploading-wrapper">
                                        <div className="csv-upload-icon">
                                            <img
                                                src={
                                                    isCsvUploaded
                                                        ? tick
                                                        : upload_file_colored
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="csv-heading">
                                            {isCsvUploaded
                                                ? "CSV Uploaded"
                                                : "Upload CSV"}
                                        </div>
                                        <div className="csv-description">
                                            All the addresses in the CSV will
                                            get badge minted on their wallet
                                        </div>
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    accept=".csv"
                                    id="upload-csv-file-input"
                                    className="upload-csv-file-input-hidden"
                                    onChange={(e) => onFileChange(e)}
                                />
                            </>
                        ) : (
                            <>
                                <div className="bulk-total-addresses">
                                    {bulkAddresses?.length} Addresses
                                </div>
                                {bulkAddresses?.map((address) => (
                                    <div
                                        key={address}
                                        className="bulk-address-row"
                                    >
                                        {address}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                    <div className="bulk-minting-btn">
                        <button
                            onClick={increaseStep}
                            disabled={checkIsDisabled()}
                        >
                            {bulkMintingStep === 0
                                ? "Review Addresses"
                                : "Mint Badges"}
                            <img src={right_arrow_white} alt="" />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mint-membership-badge-addresses-wrapper">
                        {addresses.map((address, index) => (
                            <div className="address-row" key={index}>
                                <input
                                    type="text"
                                    className="address-input"
                                    value={address}
                                    onChange={(e) =>
                                        updateAddress(e.target.value, index)
                                    }
                                    placeholder="Enter Address"
                                />
                                <div
                                    className="address-delete"
                                    onClick={() => deleteAddress(index)}
                                >
                                    <img src={cross} alt="" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="add-address" onClick={addAddress}>
                        <img src={plus_black} alt="" />
                        Add another Address
                    </div>
                    <div className="minting-buttons-wrapper">
                        <button
                            onClick={mintVouchers}
                            disabled={checkIsDisabled()}
                        >
                            Mint Badges • {addresses.length}
                        </button>
                        <div
                            onClick={() => setIsBulkMinting(true)}
                            className="bulk-minting-text"
                        >
                            Bulk Minting
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import upload_file_colored from "../../../../assets/Icons/upload_file_colored.svg"
import tick from "../../../../assets/Icons/tick.svg"
import right_arrow_white from "../../../../assets/Icons/right_arrow_white.svg"

export default function AddAddress({ selectedMembershipBadge }) {
    const [isBulkMinting, setIsBulkMinting] = useState(false)
    const [addresses, setAddresses] = useState([""])
    const [bulkMintingStep, setBulkMintingStep] = useState(0)
    const [isCsvUploaded, setIsCsvUploaded] = useState(false)
    const [bulkAddresses, setBulkAddresses] = useState([])

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

    const increaseStep = () => {
        if (bulkMintingStep >= 1) {
            setBulkMintingStep(1)
        } else {
            setBulkMintingStep((bulkMintingStep) => bulkMintingStep + 1)
        }
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
                    <img src={selectedMembershipBadge.imgUrl} alt="" />
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
                        <button onClick={increaseStep}>
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
                        <button>Mint Badges • {addresses.length}</button>
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
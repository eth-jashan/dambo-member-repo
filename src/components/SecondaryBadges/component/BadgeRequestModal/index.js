import React, { useState } from "react"
import { Input, Select } from "antd"
import "./style.scss"
import { assets } from "../../../../constant/assets"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import rightArrow from "../../../../assets/Icons/right_arrow_white.svg"
import {
    createContributionMetadataUri,
    createContributionVoucher,
    getAllMembershipBadges,
    getMembershipBadgeFromClaimer,
} from "../../../../utils/POCPServiceSdk"
import { useDispatch, useSelector } from "react-redux"
import { actionOnContributionRequestModal } from "../../../../store/actions/contibutor-action"
import Lottie from "react-lottie"
import white_loader from "../../../../assets/lottie/Loader_White_lottie.json"
const { TextArea } = Input
const { Option } = Select

export default function BadgeRequestModal({
    closeModal,
    type,
    badgeSchema,
    isEditing,
}) {
    const dismissModal = () => {
        closeModal()
    }

    const [address, setAddress] = useState([""])

    const onEdit = () => {}

    const updateAddress = (x, i) => {
        const copyOfAddresses = [...address]
        copyOfAddresses[i] = x
        setAddress(copyOfAddresses)
    }

    const addAddress = () => {
        setAddress((value) => [...value, ""])
    }
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const [loading, setLoading] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: white_loader,
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
    const dispatch = useDispatch()
    const addressInput = (address, index) => (
        <div className="address-input-div">
            <input
                className={
                    address.length >= 1
                        ? "address-input-request-letter"
                        : "address-input-request"
                }
                value={address}
                placeholder="Enter Address"
                onChange={(e) => updateAddress(e.target.value, index)}
            />
            <div className="cross-div"></div>
        </div>
    )

    const [schemaTemplate, setSchemaTemplate] = useState(badgeSchema)

    const onChangeText = (values, index) => {
        console.log("index", index)
        const newCopy = schemaTemplate.map((item, i) => {
            if (i === index) {
                return { ...item, value: values }
            } else {
                return item
            }
        })
        setSchemaTemplate(newCopy)
        console.log("After", newCopy)
    }

    const textFieldInput = (type, placeholder, index) => (
        <div className="text-field-div">
            <input
                value={schemaTemplate[index].value}
                onChange={(e) => onChangeText(e.target.value, index)}
                placeholder={placeholder}
                inputMode={type === "Numbers" && "numeric"}
                className={
                    schemaTemplate[index]?.value?.length > 0
                        ? "text-field-input-letter"
                        : "text-field-input"
                }
            />
        </div>
    )

    const multiTextInput = (placeholder, index) => (
        <div className="multi-field-div">
            <TextArea
                className={
                    schemaTemplate[index]?.value?.length > 0
                        ? "multi-field-input-letter"
                        : "multi-field-input"
                }
                onChange={(e) => onChangeText(e.target.value, index)}
                bordered={false}
                autoSize={false}
                rows={4}
                value={schemaTemplate[index]?.value}
                placeholder={placeholder}
                maxLength={6}
            />
        </div>
    )
    const handleChange = (value) => {
        console.log(value) // { value: "lucy", key: "lucy", label: "Lucy (101)" }
    }
    const contributionTypeOptions = [
        { value: "DESIGN", label: "DESIGN" },
        { value: "CODEBASE", label: "CODEBASE" },
        { value: "CONTENT", label: "CONTENT" },
    ]
    const multiSelect = () => (
        <div className="contribution-type-input-wrapper">
            {/* <div>
                <Select
                    classNamePrefix="select"
                    closeMenuOnSelect
                    //onChange={setContributionType}
                    isSearchable={false}
                    name="color"
                    options={contributionTypeOptions}
                    placeholder="Contribution Type"
                    //onFocus={() => setFocusOnSelect(true)}
                    //onBlur={() => setFocusOnSelect(false)}
                    // className={`select-input ${
                    //     !focusOnSelect && contributionType?.value
                    //         ? "selectDark"
                    //         : ""
                    // }`}
                />
            </div> */}
        </div>
    )

    const getInputField = (type, placeholder, index) => {
        switch (type) {
            case "Text Field":
                return textFieldInput(type, placeholder, index)
            case "Numbers":
                return textFieldInput(type, placeholder, index)
            case "Long text":
                return multiTextInput(placeholder, index)
        }
    }

    return (
        <div className="contribution-creation-modal-container">
            <div className="modal-backdrop">
                <div className="modal-div">
                    <img
                        onClick={() =>
                            dispatch(actionOnContributionRequestModal(false))
                        }
                        src={assets.icons.crossBlack}
                    />
                    <div className="modal-header-div">
                        <div>
                            New contribution
                            <br /> request
                        </div>
                    </div>
                    <div className="modal-title">{`${type} Details`}</div>
                    {address.map((x, i) => addressInput(x, i))}
                    {/* <div
                        className="add-address-request-modal"
                        onClick={addAddress}
                    >
                        <img src={plus_black} alt="" />
                        <div>Add another Address</div>
                    </div> */}
                    <div className="modal-title">{`${type} Details`}</div>
                    {badgeSchema.map((badge, index) =>
                        getInputField(badge.fieldType, badge.fieldName, index)
                    )}
                    {multiSelect()}
                    <div className="btn-wrapper-submit">
                        <button
                            onClick={async () => {
                                const uploadMetadata = []
                                schemaTemplate.forEach((x) => {
                                    if (x.value) {
                                        uploadMetadata.push({
                                            ...x,
                                        })
                                    }
                                })
                                console.log(
                                    "approved addresses for badges",
                                    schemaTemplate,
                                    uploadMetadata
                                )

                                try {
                                    setLoading(true)
                                    const metadata =
                                        await createContributionMetadataUri()
                                    const memberTokenId =
                                        await getAllMembershipBadges(
                                            address[0],
                                            proxyContract,
                                            [1]
                                        )
                                    createContributionVoucher(
                                        proxyContract,
                                        [
                                            parseInt(
                                                memberTokenId.data
                                                    .membershipNFTs[0].tokenID
                                            ),
                                        ],
                                        [1],
                                        [metadata],
                                        [1]
                                    )
                                    console.log(
                                        "signed message",
                                        metadata,
                                        proxyContract,

                                        [1]
                                    )
                                    setLoading(false)
                                    closeModal()
                                } catch (error) {
                                    console.log("error", error.toString())
                                    setLoading(false)
                                }
                            }}
                            className="badge-request-btn"
                        >
                            <div>Approve Badges • {address.length}</div>
                            {loading ? (
                                lottieLoader()
                            ) : (
                                <img src={rightArrow} alt="right" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

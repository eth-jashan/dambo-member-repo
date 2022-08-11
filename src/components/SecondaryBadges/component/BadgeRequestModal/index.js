import React, { useEffect, useState } from "react"
import { Input } from "antd"
import Select from "react-select"
import "./style.scss"
import { assets } from "../../../../constant/assets"
import plus_black from "../../../../assets/Icons/plus_black.svg"
import rightArrow from "../../../../assets/Icons/right_arrow_white.svg"
import {
    createContributionMetadataUri,
    createContributionVoucher,
    getAllMembershipBadges,
    getArrayOfNounce,
} from "../../../../utils/POCPServiceSdk"
import { useDispatch, useSelector } from "react-redux"
import {
    actionOnContributionRequestModal,
    createContributionVouchers,
} from "../../../../store/actions/contibutor-action"
import Lottie from "react-lottie"
import white_loader from "../../../../assets/lottie/Loader_White_lottie.json"
import { ethers } from "@biconomy/mexa/node_modules/ethers"
import dayjs from "dayjs"
import AddressInput from "../../../BadgesScreen/components/AddAddress/AddressInput"
const { TextArea } = Input

export default function BadgeRequestModal({ type, badgeSchema, isEditing }) {
    const badgeSelectionMember = useSelector(
        (x) => x.contributor.badgeSelectionMember
    )
    const [address, setAddress] = useState([""])
    const [addressStatus, setAddressStatus] = useState(false)
    const getClaimedMembershipNft = async (address) => {
        const isAddress = ethers.utils.isAddress(address)
        if (isAddress) {
            setLoading(true)
            try {
                const memberTokenId = await dispatch(
                    getAllMembershipBadges(address)
                )
                console.log(memberTokenId)
                setLoading(false)
                if (memberTokenId.data.membershipNFTs.length > 0) {
                    setAddressStatus(true)
                    // updateStatus(false, index)
                } else {
                    setAddressStatus(false)
                    // updateStatus(true, index)
                }
            } catch (error) {
                setLoading(false)
                setAddressStatus(false)
                // updateStatus(false, index)
            }
        }
    }
    useEffect(async () => {
        if (badgeSelectionMember) {
            console.log("fireeddd")
            await getClaimedMembershipNft(badgeSelectionMember)
            setAddress([badgeSelectionMember])
        }
    }, [badgeSelectionMember])
    const onEdit = () => {}

    const updateAddress = async (x, i) => {
        await getClaimedMembershipNft(x)
        const copyOfAddresses = [...address]
        copyOfAddresses[i] = x
        setAddress(copyOfAddresses)
    }

    const addAddress = () => {
        setAddress((value) => [...value, ""])
    }
    const currentDao = useSelector((x) => x.dao.currentDao)
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const jwt = useSelector((x) => x.auth.jwt)
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
            {/* <div className="cross-div"></div> */}
        </div>
    )

    const [schemaTemplate, setSchemaTemplate] = useState(badgeSchema)

    const onChangeText = (values, index) => {
        const newCopy = schemaTemplate?.map((item, i) => {
            if (i === index) {
                return { ...item, value: values }
            } else {
                return item
            }
        })
        setSchemaTemplate(newCopy)
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
                maxLength={200}
            />
        </div>
    )

    const onMultiTextChange = (values, index) => {
        const newCopy = schemaTemplate?.map((item, i) => {
            if (i === index) {
                return { ...item, value: values }
            } else {
                return item
            }
        })
        setSchemaTemplate(newCopy)
    }
    const [focusOnSelect, setFocusOnSelect] = useState(false)
    const buildMultiOptions = (options) => {
        const newOptions = []
        options.forEach((x) => {
            if (x !== null && x !== "" && x !== " ") {
                newOptions.push({ value: x, label: x })
            }
        })
        return newOptions
    }
    const [contributionType, setContributionType] = useState("")

    const selectInput = (placeholder, index) => (
        <div className="contribution-type-input-wrapper">
            <div>
                <Select
                    // isMulti
                    classNamePrefix="select"
                    closeMenuOnSelect
                    onChange={(x) => onMultiTextChange(x.value, index)}
                    isSearchable={false}
                    name="color"
                    options={buildMultiOptions(schemaTemplate[index].options)}
                    placeholder={placeholder}
                    onFocus={() => setFocusOnSelect(true)}
                    onBlur={() => setFocusOnSelect(false)}
                    className={`select-input ${
                        !focusOnSelect && contributionType?.value
                            ? "selectDark"
                            : ""
                    }`}
                />
            </div>
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
            case "Multiselect":
                return selectInput(placeholder, index)
        }
    }

    const approveBadge = async () => {
        if (address[0]) {
            const uploadMetadata = []
            schemaTemplate.forEach((x) => {
                if (x.value) {
                    uploadMetadata.push({
                        ...x,
                    })
                }
            })
            try {
                setLoading(true)
                const res = await createContributionMetadataUri(
                    schemaTemplate.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value,
                    currentDao?.name,
                    `22 July' 22`,
                    currentDao?.logo_url
                )

                if (res.metadata) {
                    const memberTokenId = await getAllMembershipBadges(
                        address[0],
                        proxyContract,
                        false
                    )
                    const arrayOfNounce = await getArrayOfNounce(
                        [memberTokenId.data.membershipNFTs[0].tokenID],
                        currentDao?.uuid,
                        jwt
                    )
                    const msg = await createContributionVoucher(
                        proxyContract,
                        [memberTokenId.data.membershipNFTs[0].tokenID],
                        [1],
                        [res.metadata],
                        arrayOfNounce,
                        [0]
                    )
                    if (msg) {
                        await dispatch(
                            createContributionVouchers(
                                address[0],
                                msg,
                                uploadMetadata,
                                res.metadata
                            )
                        )

                        setLoading(false)
                        dispatch(actionOnContributionRequestModal(false))
                    }
                }
            } catch (error) {
                console.error("error", error.toString())
                setLoading(false)
            }
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
                    {/* {address?.map((x, i) => addressInput(x, i))} */}
                    {address.map((x, i) => (
                        <AddressInput
                            index={i}
                            key={i}
                            address={x}
                            updateAddress={updateAddress}
                            deleteAddress={(x) => console.log(x)}
                            updateStatus={(x) => console.log(x)}
                            type="membership-badge-claimed"
                        />
                    ))}
                    {/* <div
                        className="add-address-request-modal"
                        onClick={addAddress}
                    >
                        <img src={plus_black} alt="" />
                        <div>Add another Address</div>
                    </div> */}
                    <div className="modal-title">{`${type} Details`}</div>
                    {badgeSchema?.map((badge, index) => (
                        <div key={index}>
                            {getInputField(
                                badge.fieldType,
                                badge.fieldName,
                                index
                            )}
                        </div>
                    ))}
                    <div className="btn-wrapper-submit">
                        <button
                            onClick={async () => {
                                const uploadMetadata = []
                                schemaTemplate.forEach((x) => {
                                    if (x.value) {
                                        uploadMetadata.push({
                                            trait_type: x.fieldName,
                                            value: x.value,
                                        })
                                    }
                                })

                                try {
                                    setLoading(true)
                                    const res =
                                        await createContributionMetadataUri(
                                            currentDao?.logo_url,
                                            currentDao?.name,
                                            schemaTemplate.find(
                                                (x) =>
                                                    x.fieldName ===
                                                    "Contribution Title"
                                            )?.value,
                                            schemaTemplate.find(
                                                (x) =>
                                                    x.fieldName ===
                                                    "Time Spent in Hours"
                                            )?.value,
                                            dayjs().format("D MMM YYYY"),
                                            schemaTemplate.find(
                                                (x) =>
                                                    x.fieldName ===
                                                    "Contribution Category"
                                            )?.value,
                                            "",
                                            uploadMetadata
                                        )

                                    if (res.metadata) {
                                        const memberTokenId =
                                            await getAllMembershipBadges(
                                                address[0],
                                                proxyContract,
                                                false
                                            )
                                        const arrayOfNounce =
                                            await getArrayOfNounce(
                                                [
                                                    memberTokenId.data
                                                        .membershipNFTs[0]
                                                        .tokenID,
                                                ],
                                                currentDao?.uuid,
                                                jwt
                                            )
                                        const msg =
                                            await createContributionVoucher(
                                                proxyContract,
                                                [
                                                    memberTokenId.data
                                                        .membershipNFTs[0]
                                                        .tokenID,
                                                ],
                                                [1],
                                                [res.metadata],
                                                arrayOfNounce,
                                                [0]
                                            )
                                        if (msg) {
                                            await dispatch(
                                                createContributionVouchers(
                                                    address[0],
                                                    msg,
                                                    schemaTemplate,
                                                    res.metadata
                                                )
                                            )

                                            setLoading(false)
                                            dispatch(
                                                actionOnContributionRequestModal(
                                                    false
                                                )
                                            )
                                        }
                                    }
                                } catch (error) {
                                    console.error("error", error.toString())
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

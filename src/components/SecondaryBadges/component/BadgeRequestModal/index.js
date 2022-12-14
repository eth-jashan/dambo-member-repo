import React, { useEffect, useState } from "react"
import { Input, message } from "antd"
import Select from "react-select"
import "./style.scss"
import { assets } from "../../../../constant/assets"
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
    getPendingContributions,
    raiseContributionRequest,
} from "../../../../store/actions/contibutor-action"
import Lottie from "react-lottie"
import white_loader from "../../../../assets/lottie/Loader_White_lottie.json"
import { ethers } from "@biconomy/mexa/node_modules/ethers"
import dayjs from "dayjs"
import AddressInput from "../../../BadgesScreen/components/AddAddress/AddressInput"
const { TextArea } = Input

export default function BadgeRequestModal({
    type,
    badgeSchema,
    isContributor = false,
    closeContributorModal = () => {},
}) {
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
    const contributorAddress = useSelector((x) => x.auth.address)

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

    const onMultiTextChange = (value, index) => {
        let newValue
        if (schemaTemplate[index].maxSelection > 1) {
            newValue = []
            value.forEach((x) => {
                newValue.push(x.value)
            })
        } else {
            newValue = value.value
        }
        const newCopy = schemaTemplate?.map((item, i) => {
            if (i === index) {
                return { ...item, value: newValue }
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

    const selectInput = (placeholder, index, value) => (
        <div className="contribution-type-input-wrapper">
            <div>
                <Select
                    isMulti={schemaTemplate[index].maxSelection > 1}
                    classNamePrefix="select"
                    closeMenuOnSelect
                    onChange={(x) => {
                        onMultiTextChange(x, index)
                    }}
                    isOptionDisabled={(option) =>
                        schemaTemplate[index].value?.length >=
                        schemaTemplate[index].maxSelection
                    }
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

    const getInputField = (type, placeholder, index, value) => {
        switch (type) {
            case "Text Field":
                return textFieldInput(type, placeholder, index)
            case "Numbers":
                return textFieldInput(type, placeholder, index)
            case "Long text":
                return multiTextInput(placeholder, index)
            case "Multiselect":
                return selectInput(placeholder, index, value)
        }
    }

    const onContributorSubmit = async () => {
        if (!loading) {
            setLoading(true)
            const memberTokenId = await getAllMembershipBadges(
                contributorAddress,
                proxyContract,
                false
            )

            try {
                await dispatch(
                    raiseContributionRequest(
                        parseInt(memberTokenId.data.membershipNFTs[0].tokenID),
                        schemaTemplate
                    )
                )
                setLoading(false)
                closeContributorModal()
                message.success("contribution created successfully")
                dispatch(getPendingContributions())
            } catch (error) {
                console.error("error", error)
                setLoading(false)
                message.error("something went wrong")
            }
        }
    }
    const onAdminSubmit = async () => {
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
            const res = await createContributionMetadataUri(
                currentDao?.logo_url,
                currentDao?.name,
                schemaTemplate.find((x) => x.fieldName === "Contribution Title")
                    ?.value,
                schemaTemplate.find(
                    (x) => x.fieldName === "Time Spent in Hours"
                )?.value,
                dayjs().format("D MMM YYYY"),
                schemaTemplate.find(
                    (x) => x.fieldName === "Contribution Category"
                )?.value,
                "",
                uploadMetadata
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
                            schemaTemplate,
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

    return (
        <div className="contribution-creation-modal-container">
            <div className="modal-backdrop">
                <div className="modal-div">
                    <img
                        onClick={() =>
                            isContributor
                                ? closeContributorModal()
                                : dispatch(
                                      actionOnContributionRequestModal(false)
                                  )
                        }
                        src={assets.icons.crossBlack}
                    />
                    <div className="modal-header-div">
                        <div>
                            New contribution
                            <br /> request
                        </div>
                    </div>
                    {!isContributor && (
                        <div className="modal-title">{`${type} Details`}</div>
                    )}

                    {!isContributor &&
                        address.map((x, i) => (
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
                                index,
                                badge.value
                            )}
                        </div>
                    ))}
                    <div className="btn-wrapper-submit">
                        <button
                            onClick={
                                isContributor
                                    ? async () => await onContributorSubmit()
                                    : async () => await onAdminSubmit()
                            }
                            className="badge-request-btn"
                        >
                            <div>Approve Badges ??? {address.length}</div>
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

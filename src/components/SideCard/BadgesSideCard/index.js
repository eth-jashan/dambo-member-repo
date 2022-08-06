import React, { useState } from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import cross_white from "../../../assets/Icons/cross_white.svg"
import {
    setSelectedMember,
    setShowMembershipChangeModal,
} from "../../../store/actions/membership-action"
import { assets } from "../../../constant/assets"
import { LinkOutlined } from "@ant-design/icons"
import { message } from "antd"
import dayjs from "dayjs"
import add_white from "../../../assets/Icons/add_white.svg"
import minus_white from "../../../assets/Icons/minus_white.svg"
import payment_grey from "../../../assets/Icons/payment_grey.svg"
import feedback_grey from "../../../assets/Icons/feedback_grey.svg"

const CommunitySideCard = ({ show }) => {
    const selectedMember = useSelector((x) => x.membership.selectedMember)
    const selectedNav = useSelector((x) => x.membership.selectedNav)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const selectedMemberPastContributions = useSelector(
        (x) => x.membership.selectedMemberPastContributions
    )
    const [showContributions, setShowContributions] = useState(false)

    const dispatch = useDispatch()

    const closeSideBar = () => {
        dispatch(setSelectedMember(null))
    }

    const openMembershipUpdateModal = () => {
        if (selectedMember.membership_txns.length > 0) {
            dispatch(setShowMembershipChangeModal(true))
        }
    }

    const changeLevel = () => (
        <div
            onClick={() => openMembershipUpdateModal()}
            className="change-level-container"
        >
            <div className="change-text">Change Level</div>
            {/* <img
                src={assets.icons.tuneIcon}
                style={{ height: "1.5rem", width: "1.5rem" }}
            /> */}
        </div>
    )
    const address = useSelector((x) => x.auth.address)
    async function copyTextToClipboard(textToCopy) {
        if ("clipboard" in navigator) {
            message.success("Copied Successfully")
            return await navigator.clipboard.writeText(textToCopy)
        } else {
            return document.execCommand("copy", true, address)
        }
    }

    const totalHours = selectedMemberPastContributions?.reduce(
        (acc, contri) => {
            return (
                acc +
                Number(
                    contri?.details?.find(
                        (x) => x.fieldName === "Time Spent in Hours"
                    )?.value
                )
            )
        },
        0
    )

    const uniqueContriTypes = selectedMemberPastContributions?.reduce(
        (acc, contri) => {
            const contriType = contri?.details?.find(
                (x) => x.fieldName === "Contribution Category"
            )?.value
            if (acc.indexOf(contriType) === -1) {
                acc.push(contriType)
            }
            return acc
        },
        []
    )
    return (
        <div
            className={`community-side-card-container ${
                !selectedMember && "not-selected-container"
            }`}
        >
            {selectedNav === "community" ? (
                selectedMember ? (
                    <>
                        <div className="selected-member-wrapper">
                            <img
                                src={cross_white}
                                alt=""
                                onClick={closeSideBar}
                            />
                            <div className="member-name">
                                {selectedMember?.name}
                            </div>
                            <div className="member-addr">
                                {selectedMember?.public_address?.slice(0, 4)}...
                                {selectedMember?.public_address?.slice(-3)}
                            </div>
                            <div className="membership-info">
                                {currentDao?.uuid !==
                                "93ba937e02ea4fdb9633c2cb27345200" ? (
                                    <img
                                        src={
                                            selectedMember?.memberships[0]
                                                ?.image_url
                                        }
                                        className="member-image"
                                    />
                                ) : (
                                    <video
                                        className="member-image"
                                        autoPlay
                                        loop
                                        muted
                                    >
                                        <source
                                            src={
                                                selectedMember?.memberships[0]
                                                    ?.image_url
                                            }
                                        />
                                    </video>
                                )}
                                <div className="badge-info">
                                    <div>
                                        <div className="level-name">
                                            {
                                                selectedMember.memberships[0]
                                                    ?.name
                                            }
                                        </div>
                                        <div className="level-time">
                                            {dayjs(
                                                selectedMember?.current_membership_created_at
                                            ).fromNow()}
                                        </div>
                                    </div>
                                    {changeLevel()}
                                </div>
                            </div>
                        </div>
                        {selectedMemberPastContributions?.length ? (
                            <div
                                className={`contribution-wrapper ${
                                    showContributions && "contribution-shown"
                                }`}
                            >
                                <div className="contribution-overview">
                                    <div className="overview-left">
                                        <div className="total-contri">
                                            {selectedMemberPastContributions?.length ||
                                                0}{" "}
                                            Contributions
                                        </div>
                                        <div>
                                            {totalHours} hour •{" "}
                                            {uniqueContriTypes[0]}{" "}
                                            {uniqueContriTypes?.length > 1
                                                ? `and ${
                                                      uniqueContriTypes?.length -
                                                      1
                                                  } more`
                                                : ""}
                                        </div>
                                    </div>
                                    <div
                                        className="overview-right"
                                        onClick={() =>
                                            setShowContributions(
                                                !showContributions
                                            )
                                        }
                                    >
                                        <img
                                            src={
                                                showContributions
                                                    ? minus_white
                                                    : add_white
                                            }
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="contributions-detailed">
                                    {selectedMemberPastContributions
                                        ?.slice(0, 3)
                                        ?.map((contri, index) => (
                                            <div
                                                className="contribution-row"
                                                key={index}
                                            >
                                                <div className="contri-row-left">
                                                    <div className="contri-title">
                                                        {
                                                            contri?.details?.find(
                                                                (x) =>
                                                                    x.fieldName ===
                                                                    "Contribution Title"
                                                            )?.value
                                                        }{" "}
                                                    </div>
                                                    <div className="contri-time">
                                                        {
                                                            contri?.details?.find(
                                                                (x) =>
                                                                    x.fieldName ===
                                                                    "Contribution Category"
                                                            )?.value
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            contri?.details?.find(
                                                                (x) =>
                                                                    x.fieldName ===
                                                                    "Time Spent in Hours"
                                                            )?.value
                                                        }{" "}
                                                        hr
                                                    </div>
                                                </div>
                                                <div className="contri-row-right">
                                                    {contri?.feedback && (
                                                        <img
                                                            src={feedback_grey}
                                                            alt=""
                                                        />
                                                    )}
                                                    {contri?.tokens?.length ? (
                                                        <img
                                                            src={payment_grey}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <div className="no-member-selected">
                        Select member to see details
                    </div>
                )
            ) : (
                <div className="no-member-container">
                    <div className="no-member-selected">
                        Select badge to see details
                    </div>
                    <div
                        onClick={() =>
                            copyTextToClipboard(
                                encodeURI(
                                    `${
                                        window.location.origin
                                    }/contributor/invite/${currentDao?.name.toLowerCase()}/${
                                        currentDao?.uuid
                                    }`
                                )
                            )
                        }
                        className="socialContainer"
                    >
                        <LinkOutlined
                            style={{ color: "white", fontSize: "14px" }}
                        />
                        <span className={"socialText"}>copy invite link</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CommunitySideCard

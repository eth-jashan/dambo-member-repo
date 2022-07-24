import React from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"

// import axios from "axios"
import { useNetwork } from "wagmi"
import { assets } from "../../../../constant/assets"
import { setContributionSelection } from "../../../../store/actions/contibutor-action"

export default function ContributionCardV2({
    item,
    isMinimum,
    index,
    selected,
}) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const dispatch = useDispatch()

    const contributionSelection = () => {
        console.log(item)
        dispatch(setContributionSelection(item))
    }

    return (
        <div
            style={{
                background: selected ? "#333333" : "#1F1F1F",
                borderRadius: index === 0 && "1rem 1rem 0rem 0rem",
            }}
            className="contributor-contribution-card-container"
        >
            {!isMinimum && (
                <div className="maximum-div">
                    <div
                        onClick={contributionSelection}
                        className="contri-info"
                    >
                        <div className="flex-div">
                            <img src={assets.icons.sentWhite} />
                            <div className="contri-meta">
                                <div className="contri-title">
                                    {
                                        item?.details?.find(
                                            (x) =>
                                                x.fieldName ===
                                                "Contribution Title"
                                        )?.value
                                    }
                                </div>
                                <div className="contri-type">
                                    design •{" "}
                                    {item?.details?.find(
                                        (x) =>
                                            x.fieldName === "Contribution Title"
                                    )?.value &&
                                        `${
                                            item?.details?.find(
                                                (x) =>
                                                    x.fieldName ===
                                                    "Time Spent in Hours"
                                            )?.value
                                        }hrs`}
                                </div>
                                <div className="submission-link">
                                    Submission link
                                </div>
                            </div>
                        </div>
                        <div className="contri-feedback">
                            “incredible work and really appreciate coming onver
                            the weekend, love you man, no homo”
                        </div>
                    </div>
                    <div className="action-btn">
                        <div className="claim-btn">
                            <div>Claim Badge</div>
                        </div>
                        <div className="reject-btn">
                            <div>Reject Badge</div>
                        </div>
                    </div>
                </div>
            )}
            {isMinimum && (
                <div className="minimum-div">
                    <div className="contri-left-min">
                        <div className="contri-title-min">
                            <img src={assets.icons.sentWhite} />
                            <div className="title-min">
                                Landing page UI explorations
                            </div>
                        </div>
                        <div className="contri-type-min">design • 40 hrs</div>
                    </div>
                    <div className="contri-incentive">
                        <div>Badge Available</div>
                    </div>
                </div>
            )}
        </div>
    )
}

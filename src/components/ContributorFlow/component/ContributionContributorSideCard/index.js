import React from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"

// import axios from "axios"
import { useNetwork } from "wagmi"
import { assets } from "../../../../constant/assets"
import { setContributionSelection } from "../../../../store/actions/contibutor-action"
import { Typography } from "antd"

export default function ContributionContributorSideCard({
    isMinimum,
    index,
    selected,
}) {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const dispatch = useDispatch()

    const contributorSelectionContribution = useSelector(
        (x) => x.contributor.contributorSelectionContribution
    )

    return (
        <div className="contributor-contribution-side-card-container">
            <div className="contri-title">
                {
                    contributorSelectionContribution?.details?.find(
                        (x) => x.fieldName === "Contribution Title"
                    )?.value
                }
            </div>
            <div className="contri-info">
                <div className="contributor-info">aviral • aviralsb.eth</div>
                <div className="contri-type">
                    Design •{" "}
                    {
                        contributorSelectionContribution?.details?.find(
                            (x) => x.fieldName === "Time Spent in Hours"
                        )?.value
                    }
                    hrs
                </div>

                <Typography.Paragraph
                    className={"contri-description"}
                    ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: (
                            <div className={"contri-description-more"}>
                                read more
                            </div>
                        ),
                    }}
                >
                    {
                        contributorSelectionContribution?.details?.find(
                            (x) => x.fieldName === "Additional Notes"
                        )?.value
                    }
                </Typography.Paragraph>
            </div>
            <div className="badge-sign-collapsable">
                <div className="closed-div">
                    <div>
                        <div className="title">Signed</div>
                    </div>
                    <img src={assets.icons.downWhite} />
                </div>
            </div>

            <div className="claim-bottom-btn">
                <div className="claim-btn">
                    <div className="btn-title">Claim badge</div>
                </div>
                <div className="reject-btn">Reject</div>
            </div>
        </div>
    )
}

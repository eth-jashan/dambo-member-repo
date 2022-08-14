import React, { useCallback, useEffect, useState } from "react"
import pocp_bg from "../../assets/POCP_background.svg"
// import { getMetaInfo } from "../../utils/relayFunctions"
import { useDispatch, useSelector } from "react-redux"
import { setContributionDetail } from "../../store/actions/contibutor-action"
import "./style.scss"
import ContributionBadgeBg from "../../assets/Icons/ContributionBadgeBg.png"
import dayjs from "dayjs"
import defaultPic from "../../assets/defaultPic.png"

const BadgeItem = ({ item, setupDisplay = false }) => {
    const currentDao = useSelector((x) => x.dao.currentDao)

    const [onHover, setHover] = useState(false)
    const dispatch = useDispatch()
    const onBadgeClick = () => {
        dispatch(setContributionDetail({ ...item }))
    }
    const contribution_detail = useSelector(
        (x) => x.contributor.contribution_detail
    )
    return (
        <div
            onClick={() => onBadgeClick()}
            onMouseLeave={() => setHover(false)}
            onMouseEnter={() => setHover(true)}
            style={{
                padding: "20px",
                border: !setupDisplay && "0.5px solid #C4C4C440",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTop: 0,
                background:
                    (onHover || contribution_detail?.uuid === item?.uuid) &&
                    !setupDisplay &&
                    "#292929",
            }}
            className="badge-item-container"
        >
            <div className="contri-badge">
                <img
                    src={ContributionBadgeBg}
                    alt=""
                    className="contri-badge-bg"
                />
                <div className="contri-badge-dao">
                    <img src={currentDao?.logo_url} alt="" />
                    {currentDao?.name}
                </div>
                <div className="contri-badge-contribution-info">
                    <div className="contri-badge-title">
                        {setupDisplay
                            ? "Contribution Title"
                            : item?.entity?.details?.find(
                                  (x) => x.fieldName === "Contribution Title"
                              )?.value}
                    </div>
                    <div className="contri-badge-bottom-row">
                        <div>
                            {setupDisplay
                                ? "Category"
                                : item?.entity?.details?.find(
                                      (x) =>
                                          x.fieldName ===
                                          "Contribution Category"
                                  )?.value}{" "}
                            •{" "}
                            {
                                item?.entity?.details?.find(
                                    (x) => x.fieldName === "Time Spent in Hours"
                                )?.value
                            }
                            hrs
                        </div>
                        <div>
                            {setupDisplay
                                ? `Date Of Creation`
                                : dayjs(item?.entity?.created_at).format(
                                      "DD MMM' YY"
                                  )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BadgeItem

import React, { useCallback, useEffect, useState } from "react"
import pocp_bg from "../../assets/POCP_background.svg"
// import { getMetaInfo } from "../../utils/relayFunctions"
import { useDispatch, useSelector } from "react-redux"
import { setContributionDetail } from "../../store/actions/contibutor-action"
import "./style.scss"
import ContributionBadgeBg from "../../assets/Icons/ContributionBadgeBg.png"
import dayjs from "dayjs"

const BadgeItem = ({ item }) => {
    // const [meta, setMeta] = useState()
    const allContribution = useSelector((x) => x.dao.contribution_id)
    const all_approved_badge = useSelector((x) => x.dao.all_approved_badge)
    const currentDao = useSelector((x) => x.dao.currentDao)
    // const role = useSelector((x) => x.dao.role)
    // const currentTransaction = useSelector(
    //     role === "ADMIN"
    //         ? (x) => x.transaction.currentTransaction
    //         : (x) => x.contributor.contribution_detail
    // )
    // const fetchMetaFromIpfs = useCallback(async () => {
    //     const res = await getMetaInfo(item?.ipfsMetaUri)
    //     setMeta(res)
    // }, [item?.ipfsMetaUri])
    // const activeSelection =
    //     `https://ipfs.infura.io/ipfs/${currentTransaction?.ipfs_url}` ===
    //     item?.ipfsMetaUri

    // useEffect(() => {
    //     fetchMetaFromIpfs()
    // }, [fetchMetaFromIpfs])

    const [onHover, setHover] = useState(false)
    const dispatch = useDispatch()
    const onBadgeClick = () => {
        dispatch(setContributionDetail({ ...item }))
    }

    return (
        <div
            onClick={() => onBadgeClick()}
            onMouseLeave={() => setHover(false)}
            onMouseEnter={() => setHover(true)}
            style={{
                padding: "20px",
                border: "0.5px solid #C4C4C440",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderTop: 0,
                background: onHover && "#292929",
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
                        {
                            item?.entity?.details?.find(
                                (x) => x.fieldName === "Contribution Title"
                            )?.value
                        }
                    </div>
                    <div className="contri-badge-bottom-row">
                        <div>
                            Design •{" "}
                            {
                                item?.entity?.details?.find(
                                    (x) => x.fieldName === "Time Spent in Hours"
                                )?.value
                            }
                            hrs
                        </div>
                        <div>
                            {dayjs(item?.entity?.created_at).format(
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

import React, { useState, useEffect } from "react"
import "./style.scss"
import { useSelector, useDispatch } from "react-redux"
import { getAllPastTransactions } from "../../../store/actions/dao-action"

export default function TreasurySideCard() {
    const dispatch = useDispatch()
    const [selectedFilter, setSelectedFilter] = useState("month")
    const pastContributions = useSelector((x) => x.dao.pastContributions)
    const [filteredContributions, setFilteredContributions] = useState([])

    const colors = ["#6852FF", "#FFB22E", "#1D7F60", "#1DA1F2", "#808080"]

    useEffect(() => {
        dispatch(getAllPastTransactions())
    }, [])

    useEffect(() => {
        let contributions = []
        if (selectedFilter === "allTime") {
            contributions = [...pastContributions]
        } else {
            const filterCriteria = {
                today: 1,
                week: 7,
                month: 30,
            }
            const contributionsAfterFilter = pastContributions.filter(
                (contribution) => {
                    const today = new Date()
                    const date_to_reply = new Date(contribution.created_at)
                    const timeInMiliSecond =
                        today.getTime() - date_to_reply.getTime()
                    const daysPassed = Math.ceil(
                        timeInMiliSecond / (1000 * 60 * 60 * 24)
                    )
                    return daysPassed <= filterCriteria[selectedFilter]
                }
            )
            contributions = contributionsAfterFilter
        }
        const contributionStreams = contributions.map(
            (contribution) => contribution.stream
        )
        const uniqueStreams = [...new Set(contributionStreams)]
        const counts = {}
        contributions.forEach((contribution) => {
            counts[contribution.stream] = counts[contribution.stream]
                ? counts[contribution.stream] + 1
                : 1
        })
        const uniqueStreamsWithCounts = uniqueStreams.map((stream) => {
            return {
                stream,
                count: counts[stream],
                percentage: (counts[stream] / contributions.length) * 100,
            }
        })
        uniqueStreamsWithCounts.sort((a, b) => b.count - a.count)
        const final = uniqueStreamsWithCounts.reduce((acc, stream, index) => {
            if (index <= 4) {
                return [...acc, stream]
            } else {
                const temp = acc.map((ele) => ({ ...ele }))
                temp[4].count += stream.count
                temp[4].percentage += stream.percentage
                temp[4].stream = `Other(${index + 1 - 4})`
                return temp
            }
        }, [])
        setFilteredContributions(uniqueStreamsWithCounts)
    }, [pastContributions, selectedFilter])

    return (
        <div className="treasury-side-card-container">
            <div className="heading">Payout Split</div>
            <div className="filters-wrapper">
                <div
                    className={`filter ${
                        selectedFilter === "today" && "activeFilter"
                    }`}
                    onClick={() => setSelectedFilter("today")}
                >
                    Today
                </div>
                <div className="separator">•</div>
                <div
                    className={`filter ${
                        selectedFilter === "week" && "activeFilter"
                    }`}
                    onClick={() => setSelectedFilter("week")}
                >
                    Week
                </div>
                <div className="separator">•</div>
                <div
                    className={`filter ${
                        selectedFilter === "month" && "activeFilter"
                    }`}
                    onClick={() => setSelectedFilter("month")}
                >
                    Month
                </div>
                <div className="separator">•</div>
                <div
                    className={`filter ${
                        selectedFilter === "allTime" && "activeFilter"
                    }`}
                    onClick={() => setSelectedFilter("allTime")}
                >
                    All time
                </div>
            </div>
            {filteredContributions.slice(0, 4).map((contribution, index) => (
                <div className="contribution-type-row" key={index}>
                    <div
                        className="contribution-background"
                        style={{
                            width: `${contribution.percentage}%`,
                            borderBottom: `2px solid ${
                                colors[index % colors.length]
                            }`,
                        }}
                    ></div>
                    <div className="contribution-type">
                        {contribution.stream.toLowerCase()}
                    </div>
                    <div className="value">{contribution.count}</div>
                </div>
            ))}
            {/* {filteredContributions.length > 4 && (
                <div className="contribution-type-row" key={index}>
                    <div
                        className="contribution-background"
                        style={{
                            width: `${getPer}%`,
                            background: `${colors[4]}`,
                        }}
                    ></div>
                    <div className="contribution-type">
                        {contribution.stream.toLowerCase()}
                    </div>
                    <div className="value">{contribution.count}</div>
                </div>
            )} */}
        </div>
    )
}

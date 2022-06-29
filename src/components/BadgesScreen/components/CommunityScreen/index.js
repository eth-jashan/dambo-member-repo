import React from "react"
import "./style.scss"

export default function CommunityScreen() {
    const contributions = [
        {
            name: "shaurya",
            contributions: 12,
            startDate: "Joined 1 month back",
            currentBadge: "Pioneer",
        },
    ]
    return (
        <div className="community-screen-container">
            {contributions.map((contribution) => (
                <div className="contribution-row" key={contribution.name}>
                    <div>{contribution.name}</div>
                    <div>
                        {contribution.contributions} Contributions •{" "}
                        {contribution.startDate}
                    </div>
                    <div>{contribution.currentBadge}</div>
                </div>
            ))}
        </div>
    )
}

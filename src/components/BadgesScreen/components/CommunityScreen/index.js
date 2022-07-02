import React from "react"
import "./style.scss"
import { setSelectedMember } from "../../../../store/actions/membership-action"
import { useDispatch } from "react-redux"

export default function CommunityScreen() {
    const members = [
        {
            name: "shaurya",
            contributions: 12,
            startDate: "Joined 1 month back",
            currentBadge: "Pioneer",
        },
    ]

    const dispatch = useDispatch()

    return (
        <div className="community-screen-container">
            {members.map((member) => (
                <div
                    className="member-row"
                    key={member.name}
                    onClick={() => dispatch(setSelectedMember(member))}
                >
                    <div>{member.name}</div>
                    <div className="member-info">
                        {member.contributions} members • {member.startDate}
                    </div>
                    <div className="member-badge">{member.currentBadge}</div>
                </div>
            ))}
        </div>
    )
}

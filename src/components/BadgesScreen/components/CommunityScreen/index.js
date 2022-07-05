import React from "react"
import "./style.scss"
import { setSelectedMember } from "../../../../store/actions/membership-action"
import { useDispatch } from "react-redux"

export default function CommunityScreen() {
    const members = [
        {
            public_address: "0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8",
            name: "Jashan Shetty",
            dao_uuid: "d35cbf33cfa74df1a5d9a8760cee2471",
            is_approver: true,
            is_member: false,
            access_role: "ADMIN",
            memberships_count: 0,
            membership_update: false,
            memberhips: [],
            membership_txns: [],
            contributions: [],
        },
        {
            public_address: "0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377",
            name: "Jashan Yo",
            dao_uuid: "d35cbf33cfa74df1a5d9a8760cee2471",
            is_approver: false,
            is_member: false,
            access_role: "CONTRIBUTOR",
            memberships_count: 0,
            membership_update: false,
            memberhips: [],
            membership_txns: [],
            contributions: [],
        },
        {
            public_address: "0xbC8e3391a0A0F51B1c6B72316cdc210e98F2d64A",
            name: "Yo Yo",
            dao_uuid: "d35cbf33cfa74df1a5d9a8760cee2471",
            is_approver: false,
            is_member: false,
            access_role: "CONTRIBUTOR",
            memberships_count: 0,
            membership_update: false,
            memberhips: [],
            membership_txns: [],
            contributions: [],
        },
        {
            public_address: "0x5730330A594640049113559A0021EcD7e624749e",
            name: "John Ropson",
            dao_uuid: "d35cbf33cfa74df1a5d9a8760cee2471",
            is_approver: false,
            is_member: false,
            access_role: "CONTRIBUTOR",
            memberships_count: 0,
            membership_update: false,
            memberhips: [],
            membership_txns: [],
            contributions: [],
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
                    <div className="member-name">
                        {member.name} • {member.public_address.slice(0, 5)}...
                        {member.public_address.slice(-3)}
                    </div>
                    {/* <div className="member-info">
                        {member.contributions} members • {member.startDate}
                    </div> */}
                    <div className="member-badge">
                        <div>{"Skywalker"}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

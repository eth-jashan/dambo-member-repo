import React from "react"
import "./style.scss"
import {
    setSelectedMember,
    getSelectedMemberContributions,
} from "../../../../store/actions/membership-action"
import { useDispatch, useSelector } from "react-redux"

export default function CommunityScreen() {
    const selectedMember = useSelector((x) => x.membership.selectedMember)

    const members = useSelector((x) => x.membership.allDaoMembers)

    const daoMember = []

    if (members) {
        members.dao_members.forEach((x, i) => {
            daoMember.push({ ...x, index: i })
        })

        members.non_claimers_addr.forEach((x, i) => {
            daoMember.push({
                public_address: x.address,
                index: daoMember?.length,
                non_claimers_addr: true,
                memberships: x.membership,
            })
        })
    }

    const dispatch = useDispatch()

    const selectCommunityMember = (member) => {
        dispatch(getSelectedMemberContributions(member?.public_address))
        dispatch(setSelectedMember(member))
    }

    return (
        <div className="community-screen-container">
            {daoMember?.length > 0 &&
                daoMember.map((member, index) => (
                    <div
                        style={{
                            background:
                                selectedMember?.index === member?.index &&
                                "#1e1e1f",
                            border:
                                selectedMember?.index === member?.index && 0,
                            borderRadius:
                                selectedMember?.index === member?.index &&
                                "1rem",
                        }}
                        className="member-row"
                        key={index}
                        onClick={() => selectCommunityMember(member)}
                    >
                        <div
                            style={{
                                color: member.non_claimers_addr
                                    ? "#737373"
                                    : "white",
                            }}
                            className="member-name"
                        >
                            {member?.name || "unclaimed"} •{" "}
                            {member?.public_address?.slice(0, 5)}
                            ...
                            {member?.public_address?.slice(-3)}
                        </div>
                        <div className="member-badge">
                            <div
                                style={{
                                    color: member?.non_claimers_addr
                                        ? "#999999"
                                        : "white",
                                }}
                            >{`${
                                member?.memberships?.length > 0
                                    ? member.memberships[0].name
                                    : "Jedi"
                            }`}</div>
                        </div>
                    </div>
                ))}
        </div>
    )
}

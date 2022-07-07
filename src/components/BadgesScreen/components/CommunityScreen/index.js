import React from "react"
import "./style.scss"
import { setSelectedMember } from "../../../../store/actions/membership-action"
import { useDispatch, useSelector } from "react-redux"

export default function CommunityScreen() {
    const selectedMember = useSelector((x) => x.membership.selectedMember)

    const members = useSelector((x) => x.membership.allDaoMembers)

    const daoMember = []

    if (members) {
        members.dao_members.forEach((x, i) => {
            // const newMemberships = {
            //     id: 13,
            //     uuid: "c28a3ea6-bc84-49bd-9df0-1f94aad9662b",
            //     level: 1,
            //     category: 1,
            //     name: "Member",
            //     description: null,
            //     image_url:
            //         "http://arweave.net/dCAUfkzCmOOZvBW-cF1-6AruMf9f7v53cpBnzhvhQg8",
            //     is_video: false,
            //     metadata_hash: "oeox8BZS7S937Q0xE6xZTJfRrjP8EKDJMsoIwbkpUvw",
            //     members_count: 0,
            // }
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
    // console.log(daoMember[1].memberships.name)

    return (
        <div className="community-screen-container">
            {daoMember?.length > 0 &&
                daoMember.map((member) => (
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
                        key={member?.name}
                        onClick={() =>
                            // !member.non_claimers_addr &&
                            dispatch(setSelectedMember(member))
                        }
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

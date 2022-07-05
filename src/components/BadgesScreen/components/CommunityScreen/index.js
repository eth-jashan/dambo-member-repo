import React from "react"
import "./style.scss"
import { setSelectedMember } from "../../../../store/actions/membership-action"
import { useDispatch, useSelector } from "react-redux"

export default function CommunityScreen() {
    const selectedMember = useSelector((x) => x.membership.selectedMember)

    const members = useSelector((x) => x.membership.allDaoMembers)
    // const members = {
    //     dao_members: [
    //         {
    //             public_address: "0xa0304EbBaE696e57e63fF682B57971065792A542",
    //             name: "Jashan",
    //             dao_uuid: "47ee81da17e5400b983824dc7697f86f",
    //             is_approver: true,
    //             is_member: false,
    //             access_role: "ADMIN",
    //             memberships_count: 0,
    //             membership_update: false,
    //             memberhips: [
    //                 {
    //                     id: 7,
    //                     uuid: "8127ece1-1c6a-4d57-a48f-68b544ad906b",
    //                     level: 1,
    //                     category: 1,
    //                     name: "Pioneer",
    //                     description: null,
    //                     image_url:
    //                         "http://arweave.net/EQFkLq6pdcH_9sHhXmo1x1YYs8thfNjCajNA2hTOpJ0",
    //                     is_video: false,
    //                     metadata_hash:
    //                         "Ha8oPTQwZ9oXr9W4ewUHZYIUHQ5orxfKgyM2qkLIkdk",
    //                     members_count: 0,
    //                 },
    //             ],
    //             membership_txns: [],
    //             contributions: [],
    //         },
    //     ],
    //     non_claimers_addr: ["0xE46Acf7236056387B30D8180C547D2c2972807cF"],
    // }

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

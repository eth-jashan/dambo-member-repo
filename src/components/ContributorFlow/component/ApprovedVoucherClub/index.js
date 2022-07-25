import React, { useState, useEffect } from "react"
import "./style.scss"
import ContributionCardV2 from "../ContributionCard"
import {
    contributionBadgeClaim,
    getContributionAsContributorApproved,
} from "../../../../store/actions/contibutor-action"
import { getAllMembershipBadges } from "../../../../utils/POCPServiceSdk"
import { useAccount } from "wagmi"
import { useDispatch, useSelector } from "react-redux"
import { message } from "antd"

export default function ApprovedVoucherClub({ voucher, isFirst }) {
    const [contributionsWithCheckbox, setContributionWithCheckbox] = useState(
        []
    )
    const { address } = useAccount()
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const dispatch = useDispatch()

    useEffect(() => {
        let contributions = []
        for (const key in voucher) {
            if (voucher?.[key]?.contributions?.length) {
                contributions = voucher[key]?.contributions
            }
        }
        const mappedContributions = contributions.map((ele) => ({
            ...ele,
            isChecked: true,
        }))
        setContributionWithCheckbox([...mappedContributions])
    }, [voucher])

    const updateCheckbox = (e, index) => {
        const tempContributions = contributionsWithCheckbox.map((ele, i) => {
            if (i === index) {
                return {
                    ...ele,
                    isChecked: !ele.isChecked,
                }
            }
            return ele
        })
        setContributionWithCheckbox([...tempContributions])
    }

    let totalSelected = 0
    contributionsWithCheckbox.forEach((ele) => {
        if (ele.isChecked) {
            totalSelected = totalSelected + 1
        }
    })

    const claimBadge = async () => {
        console.log("claim badge")

        const memberTokenId = await getAllMembershipBadges(
            address,
            proxyContract,
            false
        )
        console.log(
            "claim badge member token id",
            memberTokenId.data.membershipNFTs[0].tokenID
        )
        await dispatch(
            contributionBadgeClaim(
                contributionsWithCheckbox[0]?.uuid,
                memberTokenId.data.membershipNFTs[0].tokenID,
                [0],
                (x) => console.log("hash callback", x),
                (x) => {
                    console.log("success callback", x)
                    dispatch(getContributionAsContributorApproved())
                    message.success("Claimed Badge Successfully")
                },
                contributionsWithCheckbox
            )
        )
    }

    return (
        <div className="approved-voucher-club-container">
            {isFirst && (
                <div className="approved-voucher-first-header">
                    <div>
                        {contributionsWithCheckbox.length} badges available for
                        claim
                    </div>
                    <div className="approved-header-action-btns">
                        <button className="reject-outline-btn">
                            Reject all
                        </button>
                        <button onClick={claimBadge}>
                            Claim Badge • {totalSelected}
                        </button>
                    </div>
                </div>
            )}
            {contributionsWithCheckbox.map((contribution, index) => (
                <ContributionCardV2
                    key={index}
                    index={index}
                    isMinimum={true}
                    item={contribution}
                    isLast={index === contributionsWithCheckbox?.length - 1}
                    contributionType="approved"
                    isFirst={isFirst}
                    updateCheckbox={updateCheckbox}
                />
            ))}
        </div>
    )
}

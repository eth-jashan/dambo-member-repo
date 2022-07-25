import React, { useState, useEffect } from "react"
import "./style.scss"
import ContributionCardV2 from "../ContributionCard"
import {
    contributionBadgeClaim,
    getContributionAsContributorApproved,
    rejectContributionVoucher,
    setClaimLoading,
} from "../../../../store/actions/contibutor-action"
import { getAllMembershipBadges } from "../../../../utils/POCPServiceSdk"
import { useAccount } from "wagmi"
import { useDispatch, useSelector } from "react-redux"
import { message, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 24,
        }}
        spin
    />
)
export default function ApprovedVoucherClub({ voucher, isFirst }) {
    const [contributionsWithCheckbox, setContributionWithCheckbox] = useState(
        []
    )
    const { address } = useAccount()
    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)
    const claimLoading = useSelector((x) => x.contributor.claimLoading)
    const dispatch = useDispatch()

    useEffect(() => {
        let contributions = []
        let voucher_uuid = null
        for (const key in voucher) {
            if (voucher?.[key]?.contributions?.length) {
                contributions = voucher[key]?.contributions
                voucher_uuid = key
                console.log("voucher uuid is", key)
            }
        }
        const mappedContributions = contributions.map((ele) => ({
            ...ele,
            isChecked: true,
            voucher_uuid,
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
        dispatch(setClaimLoading(true))
        try {
            const memberTokenId = await getAllMembershipBadges(
                address,
                proxyContract,
                false
            )
            console.log(
                "claim badge member token id",
                memberTokenId.data.membershipNFTs[0].tokenID
            )
            const membership_token_id =
                memberTokenId.data.membershipNFTs[0].tokenID
            await dispatch(
                contributionBadgeClaim(
                    contributionsWithCheckbox[0]?.uuid,
                    membership_token_id,
                    (x) => {
                        console.log("success callback", x)
                        dispatch(getContributionAsContributorApproved())
                        dispatch(setClaimLoading(false))

                        message.success("Claimed Badge Successfully")
                    },
                    contributionsWithCheckbox
                )
            )
        } catch (err) {
            dispatch(setClaimLoading(false))
        }
    }

    const rejectVoucher = async () => {
        const memberTokenId = await getAllMembershipBadges(
            address,
            proxyContract,
            false
        )

        const membership_token_id = memberTokenId.data.membershipNFTs[0].tokenID
        dispatch(
            rejectContributionVoucher(
                membership_token_id,
                contributionsWithCheckbox[0]?.voucher_uuid
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
                        <button
                            className="reject-outline-btn"
                            onClick={rejectVoucher}
                        >
                            Reject all
                        </button>
                        <button onClick={claimBadge}>
                            Claim Badge • {totalSelected}
                            {claimLoading && <Spin indicator={antIcon} />}
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

import React, { useState, useEffect } from "react"
import "./style.scss"
import ContributionCardV2 from "../ContributionCard"
import {
    contributionBadgeClaim,
    getContributionAsContributorApproved,
    rejectContributionVoucher,
    setClaimLoading,
    removeClaimedContributionVoucher,
    getPastContributions,
    getPastContributionsPolled,
    setPastContributionsSyncing,
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
    const [rejectLoader, setRejectLoader] = useState(false)

    useEffect(() => {
        let contributions = []
        let voucher_uuid = null
        for (const key in voucher) {
            if (voucher?.[key]?.contributions?.length) {
                contributions = voucher[key]?.contributions
                voucher_uuid = key
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
        if (totalSelected) {
            dispatch(setClaimLoading(true))
            try {
                const memberTokenId = await getAllMembershipBadges(
                    address,
                    proxyContract,
                    false
                )

                const membership_token_id =
                    memberTokenId.data.membershipNFTs[0].tokenID
                await dispatch(
                    contributionBadgeClaim(
                        contributionsWithCheckbox[0]?.uuid,
                        membership_token_id,
                        (x) => {
                            // dispatch(getContributionAsContributorApproved())
                            dispatch(
                                removeClaimedContributionVoucher(
                                    contributionsWithCheckbox
                                )
                            )
                            // dispatch(getPastContributions())
                            dispatch(setClaimLoading(false))
                            message.success("Claimed Badge Successfully")
                            dispatch(setPastContributionsSyncing(true))
                            dispatch(getPastContributionsPolled())
                        },
                        contributionsWithCheckbox
                    )
                )
            } catch (err) {
                dispatch(setClaimLoading(false))
            }
        }
    }

    const rejectVoucher = async () => {
        if (totalSelected) {
            setRejectLoader(true)
            const memberTokenId = await getAllMembershipBadges(
                address,
                proxyContract,
                false
            )

            const membership_token_id =
                memberTokenId.data.membershipNFTs[0].tokenID
            await dispatch(
                rejectContributionVoucher(
                    membership_token_id,
                    contributionsWithCheckbox[0]?.voucher_uuid,
                    contributionsWithCheckbox
                )
            )
            setRejectLoader(false)
        }
    }

    return (
        <div className="approved-voucher-club-container">
            {isFirst && contributionsWithCheckbox?.length ? (
                <div className="approved-voucher-first-header">
                    <div>
                        {contributionsWithCheckbox.length} badges available for
                        claim
                    </div>
                    <div className="approved-header-action-btns">
                        <button
                            className="reject-outline-btn"
                            onClick={rejectVoucher}
                            disabled={!totalSelected}
                        >
                            Reject all
                            {rejectLoader && <Spin indicator={antIcon} />}
                        </button>
                        <button onClick={claimBadge} disabled={!totalSelected}>
                            Claim Badge • {totalSelected}
                            {claimLoading && <Spin indicator={antIcon} />}
                        </button>
                    </div>
                </div>
            ) : (
                ""
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

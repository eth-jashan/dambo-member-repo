import React, { useEffect, useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { LoadingOutlined } from "@ant-design/icons"
import apiClient from "../../utils/api_client"
import { chainType } from "../../utils/chainType"
import { useNetwork } from "wagmi"
import dayjs from "dayjs"

export default function ContributorBadgeScreen() {
    const [currentMembershipBadge, setCurrentMembershipBadge] = useState(false)

    const currentDao = useSelector((x) => x.dao.currentDao)
    const jwt = useSelector((x) => x.auth.jwt)
    const contributorClaimedDataBackend = useSelector(
        (x) => x.membership.contributorClaimedDataBackend
    )
    const membershipBadgesClaimed = useSelector(
        (x) => x.membership.contributorClaimedDataBackend
    )
    const [upgradedMembership, setUpgradedMembership] = useState(false)

    const getCurrentUpgradedBadgeUpdated = () => {
        if (membershipBadgesClaimed?.recentlyUpdate) {
            setUpgradedMembership({
                ...membershipBadgesClaimed.membership,
            })
        }
    }
    const { chain } = useNetwork()

    const membershipBadgesForAddress = useSelector(
        (x) => x.membership.membershipBadgesForAddress
    )
    const membershipBadges = useSelector((x) => x.membership.membershipBadges)

    const proxyContract = useSelector((x) => x.dao.daoProxyAddress)

    const updateUpgrade = async () => {
        try {
            await apiClient.post(
                `${
                    process.env.REACT_APP_DAO_TOOL_URL
                }${"/dao/update/dao_member"}?dao_uuid=${currentDao?.uuid}`,
                {
                    membership_update: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            setUpgradedMembership(false)
        } catch (error) {
            console.error("error", error)
        }
    }

    useEffect(async () => {
        await getCurrentUpgradedBadgeUpdated()
    }, [])

    const getCurrentBadgeUpdated = () => {
        const membershipInfo = []
        let highestDifference =
            dayjs().unix() - parseInt(membershipBadgesForAddress[0].time)
        let index = 0
        membershipBadgesForAddress?.forEach((item, i) => {
            if (highestDifference > dayjs().unix() - parseInt(item.time)) {
                highestDifference = dayjs().unix() - parseInt(item.time)
                index = i
            }
        })
        membershipBadges?.forEach((x) => {
            if (
                membershipBadgesForAddress[index].level ===
                contributorClaimedDataBackend?.membership.level.toString()
            ) {
                membershipInfo.push(contributorClaimedDataBackend?.membership)
            }
        })
        setCurrentMembershipBadge({
            ...membershipBadgesForAddress[index],
            ...membershipInfo[0],
        })
    }
    useEffect(() => {
        if (
            currentDao &&
            proxyContract &&
            contributorClaimedDataBackend?.membership &&
            membershipBadgesForAddress?.length > 0
        ) {
            getCurrentBadgeUpdated()
        } else {
            setCurrentMembershipBadge(false)
        }
    }, [currentDao, proxyContract, membershipBadgesForAddress])

    const claimMembershipLoading = useSelector(
        (x) => x.membership.claimMembershipLoading
    )

    const disableClaimBtn = useSelector((x) => x.membership.disableClaimBtn)

    const openseaLink = `https://${
        chainType(chain?.id) === "Testnet" ? "testnets." : ""
    }opensea.io/assets/${
        chainType(chain?.id) === "Testnet" ? "mumbai" : "matic"
    }/${currentMembershipBadge?.contractAddress?.id}/${
        currentMembershipBadge?.tokenID
    }`

    return (
        <div className="contributor-badge-upgrade-screen-container">
            {upgradedMembership && (
                <div className="newMembershipBadge">
                    <img src={upgradedMembership?.image_url} />
                    <div className="congratsAndClaim">
                        <div className="congratulationsText">
                            Congratulations
                        </div>
                        <div className="badgeName">
                            You upgraded to {upgradedMembership?.name} badge
                        </div>
                        <div className="claimBadgeBtnWrapper-badge">
                            <button
                                className={`claimBadgeBtn ${
                                    claimMembershipLoading.status && "pinkColor"
                                }`}
                                disabled={disableClaimBtn}
                            >
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${
                                        currentDao?.uuid ===
                                        "93ba937e02ea4fdb9633c2cb27345200"
                                            ? `I'm a Pioneer Member of @PonyFinance! %0A%0ACongrats to the team and partners @beefyfinance, @defipulse and @scalara_xyz on the launch. Now lets round up some omni-chain stablecoin yields!🐴🤠 %0A%0Ah/t @rep3gg %0A%0A ${openseaLink}`
                                            : `Hi all,%0A%0AI am now a member of ${currentDao?.name}, check out my membership badge. %0A%0Ah/t @rep3gg %0A%0A${openseaLink}`
                                    }`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "white" }}
                                >
                                    Share Badge
                                </a>
                            </button>
                            <button
                                className="shareButton"
                                onClick={async () => await updateUpgrade()}
                                disabled={disableClaimBtn}
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

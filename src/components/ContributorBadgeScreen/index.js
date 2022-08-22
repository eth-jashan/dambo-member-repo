import React, { useEffect, useState } from "react"
import "./style.scss"
import { useDispatch, useSelector } from "react-redux"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import apiClient from "../../utils/api_client"
import magic_button from "../../assets/Icons/magic_button.svg"
import etherscan_white from "../../assets/Icons/etherscan-white.svg"
import opensea_white from "../../assets/Icons/opensea-white.svg"
import cross from "../../assets/Icons/cross.svg"
import routes from "../../constant/routes"
// import { getSelectedChainId } from "../../utils/POCPutils"
// import axios from "axios"

export default function ContributorBadgeScreen() {
    const currentDao = useSelector((x) => x.dao.currentDao)
    const jwt = useSelector((x) => x.auth.jwt)
    const contributorClaimedDataBackend = useSelector(
        (x) => x.membership.contributorClaimedDataBackend
    )
    const membershipBadges = useSelector(
        (x) => x.membership.contributorClaimedDataBackend
    )
    const [upgradedMembership, setUpgradedMembership] = useState(false)

    const getCurrentBadgeUpdated = () => {
        if (membershipBadges?.recentlyUpdate) {
            setUpgradedMembership({
                ...membershipBadges.membership,
            })
        }
    }

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
        await getCurrentBadgeUpdated()
    }, [])

    const membershipBadgeClaimed = useSelector(
        (x) => x.membership.membershipBadgeClaimed
    )

    const claimMembershipLoading = useSelector(
        (x) => x.membership.claimMembershipLoading
    )

    const disableClaimBtn = useSelector((x) => x.membership.disableClaimBtn)

    const dispatch = useDispatch()

    const antIcon = (
        <LoadingOutlined
            style={{
                fontSize: 24,
            }}
            spin
        />
    )

    const openEtherscan = () => {
        window.open(
            `https://polygonscan.com/token/${membershipBadgeClaimed?.contractAddress?.id}?a=${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

    const openOpensea = () => {
        window.open(
            `https://opensea.io/assets/matic/${membershipBadgeClaimed?.contractAddress?.id}/${membershipBadgeClaimed?.tokenID}`,
            "_blank"
        )
    }

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
                                    href={`https://twitter.com/intent/tweet?text=I'm a Pioneer Member of @PonyFinance! %0A%0ACongrats to the team and partners @beefyfinance, @defipulse and @scalara_xyz on the launch. Now lets round up some omni-chain stablecoin yields!🐴🤠 %0A%0Ah/t @rep3gg %0A%0Ahttps://ponyfinance.xyz`}
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

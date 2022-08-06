import React from "react"
import styles from "./style.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import chevron_right from "../../../assets/Icons/chevron_right.svg"
import approver from "../../../assets/Icons/approver_icon.svg"
import contributor from "../../../assets/Icons/contributor_icon.svg"
import { useDispatch, useSelector } from "react-redux"
import {
    getAllClaimedBadges,
    switchRole,
} from "../../../store/actions/dao-action"
import { setLoadingState } from "../../../store/actions/toast-action"
import {
    getAllMembershipBadgesForAddress,
    getMembershipVoucher,
} from "../../../store/actions/membership-action"
import {
    getContributionAsAdmin,
    getContributionAsContributorApproved,
    getContributorStats,
    // getContributionAsContributorApproved,
    getPastContributions,
} from "../../../store/actions/contibutor-action"

const AccountSwitchModal = ({ onChange, route }) => {
    const dispatch = useDispatch()
    const address = useSelector((x) => x.auth.address)
    const contributionFlowAsContributor = async () => {
        await dispatch(getContributionAsContributorApproved())
        await dispatch(getPastContributions())
        await dispatch(getAllClaimedBadges())
        await dispatch(getContributorStats(address))
    }
    const contributionFlowAsAdmin = async () => {
        await dispatch(getContributionAsAdmin())
    }
    const changeRole = async (role) => {
        dispatch(switchRole(role))
        onChange(role)
        dispatch(setLoadingState(true))
        await dispatch(getAllMembershipBadgesForAddress(address))

        if (route === "contributions" && role === "ADMIN") {
            await contributionFlowAsAdmin()
        } else if (role !== "ADMIN") {
            await dispatch(getMembershipVoucher())
            await contributionFlowAsContributor()
        } else if (route !== "contributions" && role === "ADMIN") {
            // await dispatch(getPayoutRequest())
            // await dispatch(set_payout_filter("PENDING"))
            // await dispatch(syncTxDataWithGnosis())
        }
        dispatch(setLoadingState(false))
    }

    return (
        <div className={styles.modal}>
            <div
                onClick={() => changeRole("ADMIN")}
                className={styles.singleOption}
            >
                <div>
                    <img src={approver} alt="setting" className={styles.icon} />
                    <div className={textStyles.m_16}>Approval view</div>
                </div>
                <img
                    src={chevron_right}
                    alt="chevro_right"
                    className={styles.chevron}
                />
            </div>

            <div
                style={{ marginTop: "4px", width: "90%", alignSelf: "center" }}
                className={styles.divider}
            />

            <div
                onClick={() => changeRole("CONTRIBUTOR")}
                className={styles.singleOption}
            >
                <div>
                    <img
                        src={contributor}
                        alt="email"
                        className={styles.icon}
                    />
                    <div className={textStyles.m_16}>Contributor view</div>
                </div>
                <img
                    src={chevron_right}
                    alt="chevro_right"
                    className={styles.chevron}
                />
            </div>
        </div>
    )
}

export default AccountSwitchModal

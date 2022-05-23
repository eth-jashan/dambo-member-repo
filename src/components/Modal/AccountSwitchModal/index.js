import React from "react"
import styles from "./style.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import chevron_right from "../../../assets/Icons/chevron_right.svg"
import approver from "../../../assets/Icons/approver_icon.svg"
import contributor from "../../../assets/Icons/contributor_icon.svg"
import { useDispatch, useSelector } from "react-redux"
import {
    getAllApprovedBadges,
    getAllClaimedBadges,
    getAllUnclaimedBadges,
    getContributorOverview,
    getContriRequest,
    getPayoutRequest,
    refreshContributionList,
    set_payout_filter,
    switchRole,
    syncTxDataWithGnosis,
} from "../../../store/actions/dao-action"
import { setLoadingState } from "../../../store/actions/toast-action"

const AccountSwitchModal = ({ onChange, route }) => {
    const address = useSelector((x) => x.auth.address)
    const dispatch = useDispatch()
    const changeRole = async (role) => {
        dispatch(refreshContributionList())
        dispatch(switchRole(role))
        onChange()
        dispatch(setLoadingState(true))
        await dispatch(getAllApprovedBadges())
        await dispatch(getContriRequest())
        if (route === "contributions" && role === "ADMIN") {
            dispatch(setLoadingState(false))
            await dispatch(getPayoutRequest())
            await dispatch(set_payout_filter("PENDING"))
            await dispatch(syncTxDataWithGnosis())
            dispatch(setLoadingState(false))
        } else if (role !== "ADMIN") {
            await dispatch(getAllClaimedBadges())
            await dispatch(getAllUnclaimedBadges())
            dispatch(getContributorOverview())
            dispatch(setLoadingState(false))
        } else if (route !== "contributions" && role === "ADMIN") {
            await dispatch(getPayoutRequest())
            await dispatch(set_payout_filter("PENDING"))
            await dispatch(syncTxDataWithGnosis())
            dispatch(setLoadingState(false))
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

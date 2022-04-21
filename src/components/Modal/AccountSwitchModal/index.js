import React from "react"
import styles from "./style.module.css"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import chevron_right from "../../../assets/Icons/chevron_right.svg"
import approver from "../../../assets/Icons/approver_icon.svg"
import contributor from "../../../assets/Icons/contributor_icon.svg"
import { useDispatch, useSelector } from "react-redux"
import {
    getContributorOverview,
    getContriRequest,
    getDaoHash,
    getPayoutRequest,
    set_payout_filter,
    switchRole,
    syncAllBadges,
    syncTxDataWithGnosis,
} from "../../../store/actions/dao-action"
import { getAllBadges } from "../../../store/actions/contibutor-action"
import { setLoadingState } from "../../../store/actions/toast-action"

const AccountSwitchModal = ({ onChange, route, c_id, signer }) => {
    const address = useSelector((x) => x.auth.address)
    const currentDao = useSelector((x) => x.dao.currentDao)
    const pocp_dao_info = useSelector((x) => x.dao.pocp_dao_info)
    const community_id = pocp_dao_info.filter(
        (x) => x.txhash === currentDao?.tx_hash
    )
    const dispatch = useDispatch()
    const changeRole = async (role) => {
        dispatch(setLoadingState(true))
        dispatch(switchRole(role))
        onChange()
        // await Promise.all([
        await dispatch(getDaoHash())
        await dispatch(syncAllBadges())
        // ])
        dispatch(getContributorOverview())
        dispatch(getAllBadges(signer, address, community_id[0]?.id))
        if (route === "contributions" && role === "ADMIN") {
            await dispatch(getContriRequest())
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
        } else if (role !== "ADMIN") {
            await dispatch(getAllBadges(signer, address, c_id))
            await dispatch(getContriRequest())
            await dispatch(getAllBadges(signer, address, community_id[0]?.id))
            dispatch(getContributorOverview())
        } else if (route !== "contributions" && role === "ADMIN") {
            // await  dispatch(getContriRequest())
            await dispatch(getPayoutRequest())
            await dispatch(syncTxDataWithGnosis())
            await dispatch(set_payout_filter("PENDING", 1))
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

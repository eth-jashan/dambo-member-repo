import React, { useState } from "react"
import { Dropdown, Menu } from "antd"
import crossSvg from "../../assets/Icons/cross_white.svg"
import searchSvg from "../../assets/Icons/white_search.svg"
import search_inactive from "../../assets/Icons/search_inactive.svg"
import filter from "../../assets/Icons/filter.svg"
import styles from "./styles.module.css"
import textStyles from "../../commonStyles/textType/styles.module.css"
import { useDispatch, useSelector } from "react-redux"
import {
    set_contri_filter,
    set_payout_filter,
} from "../../store/actions/dao-action"

const DashboardSearchTab = ({ route }) => {
    const contribution_request = useSelector((x) => x.dao.contribution_request)
    const contri_filter_key = useSelector((x) => x.dao.contri_filter_key)
    const payout_filter_key = useSelector((x) => x.dao.payout_filter_key)
    const [contriFilter, setContriFilter] = useState(1)
    const [search, setSearch] = useState(false)
    const [filterShow, setFilterShow] = useState(false)
    const role = useSelector((x) => x.dao.role)

    const contri_filter = [
        "All requests",
        "Active requests",
        "Approved requests",
        "Paid requests",
    ]
    const payout_filter = [
        "All requests",
        "Pending Payment Request",
        "Approved requests",
        "Paid requests",
        "Rejected requests",
    ]
    const claim_filter = ["Unclaimed Badges", "Claimed Badges"]
    const [payoutFilter, setPayoutFilter] = useState(1)

    const dispatch = useDispatch()
    const onClick = ({ key }) => {
        if (key === "1") {
            setContriFilter(0)
            dispatch(set_contri_filter("ALL", 0))
        } else if (key === "2") {
            dispatch(set_contri_filter("ACTIVE", 1))
            setContriFilter(1)
        } else if (key === "3") {
            dispatch(set_contri_filter("APPROVED"), 2)
            setContriFilter(2)
        } else if (key === "4") {
            dispatch(set_contri_filter("PAID"), 4)
        }
    }

    const payoutOnClick = ({ key }) => {
        if (key === "1") {
            setPayoutFilter(0)
            dispatch(set_payout_filter("ALL", 0))
        } else if (key === "2") {
            dispatch(set_payout_filter("PENDING", 1))
            setPayoutFilter(1)
        } else if (key === "3") {
            dispatch(set_payout_filter("APPROVED", 2))
            setPayoutFilter(2)
        } else if (key === "4") {
            dispatch(set_payout_filter("PAID", 3))
            setPayoutFilter(3)
        } else if (key === "5") {
            dispatch(set_payout_filter("REJECTED", 4))
            setPayoutFilter(4)
        }
    }

    const contriMenu = (
        <Menu
            style={{
                borderRadius: "8px",
                width: "15.813rem",
                background: "#1F1F1F",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
            onClick={onClick}
        >
            <Menu.Item className={styles.menuContainer} key="1">
                <div className={styles.menu}>All requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="2">
                <div className={styles.menu}>Active requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="3">
                <div className={styles.menu}>Approved requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="4">
                <div className={styles.menu}>Paid requests</div>
            </Menu.Item>
        </Menu>
    )

    const payoutMenu = (
        <Menu
            style={{
                borderRadius: "8px",
                width: "15.813rem",
                background: "#1F1F1F",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
            // onClick={payoutOnClick}
        >
            <Menu.Item className={styles.menuContainer} key="1">
                <div className={styles.menu}>All requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="2">
                <div className={styles.menu}>Pending Payment Request</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="3">
                <div className={styles.menu}>Approved requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="4">
                <div className={styles.menu}>Paid requests</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="5">
                <div className={styles.menu}>Rejected requests</div>
            </Menu.Item>
        </Menu>
    )

    const claimMenu = (
        <Menu
            style={{
                borderRadius: "8px",
                width: "15.813rem",
                background: "#1F1F1F",
                paddingTop: "1rem",
                paddingBottom: "1rem",
            }}
            onClick={payoutOnClick}
        >
            <Menu.Item className={styles.menuContainer} key="1">
                <div className={styles.menu}>Unclaimed Badges</div>
            </Menu.Item>
            <Menu.Item className={styles.menuContainer} key="2">
                <div className={styles.menu}>Claimed Badges Request</div>
            </Menu.Item>
        </Menu>
    )

    const loadingState = useSelector((x) => x.toast.loading_state)
    const renderSearchBar = () => (
        <div className={styles.searchContainer}>
            <input placeholder="Search for requests" />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    alignItems: "center",
                }}
            >
                <img
                    onClick={() => setSearch(false)}
                    src={crossSvg}
                    alt="cross"
                    className={styles.crossIcon}
                />
                <div
                    style={{
                        width: "1px",
                        height: "100%",
                        background: "white",
                        opacity: 0.12,
                        marginLeft: "0.75rem",
                        marginRight: "0.75rem",
                    }}
                />
                <img
                    src={searchSvg}
                    alt="cross"
                    className={styles.searchIcon}
                />
            </div>
        </div>
    )

    const renderLoader = () => (
        <div style={{ flexDirection: "row", display: "flex" }}>
            <div
                style={{
                    width: "8.75rem",
                    height: "1.25rem",
                    background: "gray",
                    borderRadius: "1.25rem",
                    marginRight: "8px",
                }}
            ></div>
            <div
                style={{
                    height: "1.25rem",
                    width: "1.25rem",
                    borderRadius: "1.25rem",
                    background: "gray",
                }}
            />
        </div>
    )

    return (
        <div className={styles.container}>
            {!loadingState ? (
                <Dropdown
                    overlay={
                        route === "contributions"
                            ? contriMenu
                            : route === "payments" && role === "ADMIN"
                            ? payoutMenu
                            : claimMenu
                    }
                >
                    <div className={`${textStyles.m_16} ${styles.text}`}>
                        {route === "contributions"
                            ? `${contribution_request?.length} ${contri_filter[contri_filter_key]}`
                            : `${
                                  role === "ADMIN"
                                      ? payout_filter[payout_filter_key]
                                      : claim_filter[payout_filter_key]
                              }`}
                    </div>
                </Dropdown>
            ) : (
                renderLoader()
            )}
            <div style={{ display: "flex", flexDirection: "row" }}>
                {!search ? (
                    <div
                        onClick={() => setSearch(true)}
                        className={styles.icon}
                    >
                        <img
                            src={search_inactive}
                            alt="cross"
                            className={styles.searchIcon}
                        />
                    </div>
                ) : (
                    renderSearchBar()
                )}
                <div>
                    <div
                        className={`${styles.icon} ${
                            filterShow ? styles.filterOpen : ""
                        }`}
                        onClick={() => setFilterShow(true)}
                    >
                        <img
                            src={filter}
                            alt="cross"
                            className={`${styles.searchIcon} ${
                                filterShow ? styles.filterOpen : ""
                            }`}
                        />
                    </div>
                    {/* <FilterModal isContribution={route==='contributions'} onClose={() => setFilterShow(false)} show={filterShow} /> */}
                </div>
            </div>
        </div>
    )
}

export default DashboardSearchTab

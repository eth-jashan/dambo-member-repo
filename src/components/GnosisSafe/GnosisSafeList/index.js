import { Typography, Popover, message } from "antd"
import React, { useCallback, useEffect } from "react"
// import styles from "./style.module.css"
import "./style.scss"
import { MdOutlineAdd } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import chevron_right from "../../../assets/Icons/chevron_right.svg"
import info from "../../../assets/Icons/info.svg"
import plus from "../../../assets/Icons/plus_black.svg"
import textStyles from "../../../commonStyles/textType/styles.module.css"
import {
    addSafeAddress,
    getAllSafeFromAddress,
    connectDaoToDiscord,
} from "../../../store/actions/dao-action"

const GnosisSafeList = ({
    setStep,
    guildId,
    increaseStep,
    setHasMultiSignWallet,
    discordUserId,
}) => {
    // const [searchParams, _setSearchParams] = useSearchParams()
    const setCurrentStep = () => {
        setStep(2)
    }
    let safeList = useSelector((x) => x.dao.allSafeList)
    if (!guildId) {
        safeList = safeList?.filter((x) => x.name === "")
    }
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const setGnosisWallet = async (x) => {
        if (x.guild_id) return
        if (guildId && x.name) {
            const res = await dispatch(
                connectDaoToDiscord(x.uuid, guildId, discordUserId)
            )
            if (res) {
                message.success("Discord registered to dao successfully")
                navigate("/dashboard")
            } else {
                message.error("Something went wrong please try again later")
            }
        } else {
            dispatch(addSafeAddress(x.addr))
            if (x.name !== "") {
                navigate("/dashboard")
            } else {
                setHasMultiSignWallet(true)
                setCurrentStep()
            }
        }
    }
    const address = useSelector((x) => x.auth.address)
    const fetchAllSafe = useCallback(async () => {
        try {
            dispatch(getAllSafeFromAddress(address))
        } catch (error) {
            // //console.log('error on safe fetch.......', error)
        }
    }, [address, dispatch])

    useEffect(() => {
        fetchAllSafe()
    }, [fetchAllSafe])

    const popoverContent = () => {
        return (
            <div className="safeListPopoverContent">
                Discord bot is already enabled for this safe, go to DAO settings
                to change discord server of the bot.
            </div>
        )
    }

    const RenderSafe = ({ item }) => (
        <div
            onClick={() => setGnosisWallet(item)}
            className={`safeSingleItem ${item.guild_id ? "botRegistered" : ""}`}
        >
            <div>
                <Typography.Text className="safeAdress">
                    {guildId ? item.name || item.addr : item.addr}
                </Typography.Text>
            </div>
            {item.guild_id ? (
                <div className="botEnabled">
                    <div>bot enabled</div>
                    <Popover
                        content={popoverContent}
                        title="Drepute bot enabled"
                        placement="right"
                    >
                        <img src={info} alt="info" />
                    </Popover>
                </div>
            ) : (
                <img
                    src={chevron_right}
                    className="chevronIcon"
                    width="32px"
                    height="32px"
                    alt="cheveron-right"
                />
            )}
        </div>
    )

    const createNewMulti = () => {
        increaseStep()
        setHasMultiSignWallet(false)
    }

    const renderNoWallet = () => (
        <div onClick={() => createNewMulti()} className="noWaletItem">
            <div>
                <img alt="plus" src={plus} className="plus" />
                <Typography.Text className="noWalletText">
                    Create New Multisig
                </Typography.Text>
            </div>
            <img
                src={chevron_right}
                className="chevronIcon"
                width="32px"
                height="32px"
                alt="cheveron-right"
            />
        </div>
    )

    return (
        <div className="gnosisSafeListContainer layout">
            {safeList.length > 0 ? (
                <div className={`heading ${textStyles.ub_53}`}>
                    Select the safe you
                    <br /> want to continue with
                </div>
            ) : (
                <div className={`headingSecondary ${textStyles.ub_53}`}>
                    Couldn’t find multisig
                </div>
            )}
            {!safeList.length > 0 && (
                <div className={`headingSecondary greyHeading`}>
                    Create a new one
                </div>
            )}
            <div className="content">
                {safeList.length > 0 ? (
                    <div className="listContent">
                        {safeList.map((item, index) => (
                            <RenderSafe key={index} item={item} />
                        ))}
                    </div>
                ) : (
                    renderNoWallet()
                )}
                {safeList.length > 0 && (
                    <div
                        onClick={() => createNewMulti()}
                        className="multiSigCtn"
                    >
                        <MdOutlineAdd
                            color={"#6852FF"}
                            style={{ alignSelf: "center" }}
                        />
                        <div className="multiSigBtn">Create New Multisig</div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GnosisSafeList

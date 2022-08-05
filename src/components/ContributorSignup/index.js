import { message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import NextButton from "../NextButton"
import "./style.scss"
import {
    joinContributor,
    setAdminStatus,
    setContriInfo,
    signout,
} from "../../store/actions/auth-action"
import { useNavigate, useParams } from "react-router"
import InputText from "../InputComponent/Input"
import chevron_right from "../../assets/Icons/chevron_right.svg"
import plus_colored from "../../assets/Icons/plus_colored.svg"

const ContributorSignup = ({ discordUserId, onboardingStep }) => {
    const { id } = useParams()
    const [name, setName] = useState("")
    const dispatch = useDispatch()
    const [OnboardingStep, setOnboardingStep] = useState(onboardingStep || 0)
    const unclaimedMembershipVouchersForAddress = useSelector(
        (x) => x.membership.unclaimedMembershipVouchersForAddress
    )
    const inviteCode = useSelector((x) => x.contributor.invite_code)

    const [selectedDao, setSelectedDao] = useState(null)

    const [role, setRole] = useState()
    const navigate = useNavigate()
    const fetchRoles = useCallback(async () => {
        if (!id) {
            dispatch(signout())
        }
    }, [dispatch])

    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    const onSubmit = async () => {
        dispatch(setContriInfo(name, role))
        try {
            const res = await dispatch(
                joinContributor(
                    inviteCode ? id : selectedDao?.uuid,
                    discordUserId
                )
            )
            if (res) {
                navigate(`/dashboard`)
                message.success("You successfully joined as contributor")
                dispatch(setAdminStatus(true))
            }
        } catch (error) {
            message.error("Error on Joining")
        }
    }

    const selectVoucher = (dao) => {
        setSelectedDao(dao)
        setOnboardingStep(1)
    }

    const goToDaoOnboarding = () => {
        navigate("/onboard/dao")
    }

    return (
        <div className="contributor-signup-container">
            {OnboardingStep === 0 ? (
                <div className="layout">
                    <div>
                        <div className="heading">
                            gm gm, invites are waiting for you
                        </div>
                        <div className="dao-vouchers-wrapper">
                            {unclaimedMembershipVouchersForAddress.map(
                                (dao) => (
                                    <div
                                        className="dao-voucher-row"
                                        key={dao?.uuid}
                                        onClick={() => selectVoucher(dao)}
                                    >
                                        <div className="dao-details">
                                            <img
                                                src={dao?.logo_url}
                                                alt=""
                                                className="dao-image"
                                            />
                                            <div className="dao-name">
                                                {dao?.name}
                                            </div>
                                        </div>
                                        <div>
                                            <img src={chevron_right} alt="" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div
                            className="new-community"
                            onClick={goToDaoOnboarding}
                        >
                            <img src={plus_colored} alt="" />
                            Setup new community
                        </div>
                    </div>
                </div>
            ) : (
                <div className="layout">
                    <div style={{ flexDirection: "column", display: "flex" }}>
                        <div className="heading">Almost done</div>
                        <div className="greyHeading">
                            Please tell us a bit
                            <br />
                            about yourself
                        </div>

                        <div>
                            <div style={{ marginTop: "40px" }}>
                                {/* <Typography.Text className="helperText}>What should we call your DAO</Typography.Text> */}
                                <div>
                                    <InputText
                                        width={"60%"}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="What should we call you"
                                        className={
                                            name === "" ? "input" : "inputText"
                                        }
                                    />
                                </div>
                            </div>
                            {/* <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}> */}
                            {/* <div style={{ marginTop: "20px" }}> */}
                            {/* <Typography.Text className="helperTextSec}>How we can reach you</Typography.Text> */}
                            {/* <div>
                            <Select
                                // components={{Option: CustomOption}}
                                className="basic-single"
                                classNamePrefix="select"
                                closeMenuOnSelect
                                onChange={setRole}
                                styles={colourStyles}
                                isSearchable={false}
                                name="color"
                                options={roleOption}
                                placeholder="Role"
                            />
                        </div> */}
                            {/* </div> */}
                            {/* </Select> */}
                        </div>
                    </div>
                    <div className="nextBtn">
                        <NextButton
                            text="Review"
                            nextButtonCallback={onSubmit}
                            isDisabled={name === ""}
                            isContributor={true}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContributorSignup

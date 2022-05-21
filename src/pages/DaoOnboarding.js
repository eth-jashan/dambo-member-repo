import React, { useCallback, useEffect, useState } from "react"
import Layout from "../views/Layout"
import AddOwners from "../components/AddOwners"
import ApproveTransaction from "../components/ApproveTransaction"
import ConnectWallet from "../components/ConnectWallet"
import GnosisSafeList from "../components/GnosisSafe/GnosisSafeList"
import DaoInfo from "../components/DaoInfo"
import { useDispatch, useSelector } from "react-redux"
import {
    addSafeAddress,
    lastSelectedId,
    pocpRegistrationInfo,
    registerDao,
    connectDaoToDiscord,
} from "../store/actions/dao-action"
import { useSafeSdk } from "../hooks"
import { ethers } from "ethers"
import { useNavigate, useSearchParams } from "react-router-dom"
import { message } from "antd"
import POCPSignup from "../components/POCPSignup"
import DiscordRegister from "../components/DiscordRegister"
import OnboardingError from "../components/OnboardingError"

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0)
    const [hasMultiSignWallet, setHasMultiSignWallet] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [deploying, setDeploying] = useState(false)
    const [signer, setSigner] = useState()
    const [safeAddress, setSafeAddress] = useState()
    const { safeFactory } = useSafeSdk(signer, safeAddress)

    const owners = useSelector((x) => x.dao.newSafeSetup.owners)
    const threshold = useSelector((x) => x.dao.newSafeSetup.threshold)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const address = useSelector((x) => x.auth.address)
    const jwt = useSelector((x) => x.auth.jwt)
    const accounts = useSelector((x) => x.dao.dao_list)
    const isAdmin = useSelector((x) => x.auth.isAdmin)
    const [searchParams, _setSearchParams] = useSearchParams()
    const guildId = searchParams.get("guild_id")
    const discordUserId = searchParams.get("discord_user_id")

    const steps = [
        "connectWallet",
        "gnosisSafeList",
        "addOwners",
        "approveTransaction",
        "daoInfo",
        "pocpSignup",
    ]

    const preventGoingBack = useCallback(() => {
        window.history.pushState(null, document.title, window.location.href)
        window.addEventListener("popstate", () => {
            if (address && jwt) {
                if (accounts.length === 0) {
                    window.history.pushState(
                        null,
                        document.title,
                        window.location.href
                    )
                } else {
                    window.history.pushState(null, document.title, "/dashboard")
                    window.location.reload("true")
                }
            }
        })
    }, [address, jwt])

    useEffect(() => {
        preventGoingBack()
    }, [preventGoingBack])

    useEffect(() => {
        if (address) {
            setCurrentStep(1)
        } else {
            setCurrentStep(0)
        }
    }, [address])

    const deploySafe = useCallback(
        async (owners) => {
            if (!safeFactory) return
            setDeploying(true)
            const safeAccountConfig = { owners, threshold }
            let safe
            try {
                safe = await safeFactory.deploySafe(safeAccountConfig)
                message.success("A safe is successfully created !")
                setDeploying(false)
            } catch (error) {
                message.error(error.message)
                setDeploying(false)
                return
            }
            const newSafeAddress = ethers.utils.getAddress(safe.getAddress())
            console.log(newSafeAddress)
            setSafeAddress(newSafeAddress)
            dispatch(addSafeAddress(newSafeAddress))
            // setDeploying(true)
            const { dao_uuid, name } = await dispatch(registerDao())
            dispatch(lastSelectedId(dao_uuid))
            if (dao_uuid) {
                if (guildId) {
                    const res = await dispatch(
                        connectDaoToDiscord(dao_uuid, guildId, discordUserId)
                    )
                    if (res) {
                        message.success(
                            "Discord registered to dao successfully"
                        )
                    } else {
                        message.error(
                            "Something went wrong please try again later"
                        )
                    }
                }
                dispatch(pocpRegistrationInfo(dao_uuid, name, owners))
                setCurrentStep(currentStep + 1)
            } else {
                navigate(`/`)
            }
        },
        [address, dispatch, navigate, safeFactory, threshold]
    )

    const setProvider = async () => {
        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        )
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        setSigner(signer)
    }

    const increaseStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((currentStep) => currentStep + 1)
        } else {
            setCurrentStep(steps.length - 1)
        }
    }

    const createDao = async () => {
        if (hasMultiSignWallet) {
            const { dao_uuid, name, owners } = await dispatch(registerDao())
            const owner = [address]
            if (owners.length > 1) {
                owners.map((x, i) => {
                    if (x?.address !== address) {
                        owner.push(x?.address)
                    }
                })
            }
            dispatch(lastSelectedId(dao_uuid))
            if (dao_uuid) {
                if (guildId) {
                    const res = await dispatch(
                        connectDaoToDiscord(dao_uuid, guildId, discordUserId)
                    )
                    if (res) {
                        message.success(
                            "Discord registered to dao successfully"
                        )
                    } else {
                        message.error(
                            "Something went wrong please try again later"
                        )
                    }
                }
                dispatch(pocpRegistrationInfo(dao_uuid, name, owner))
                increaseStep()
            } else {
                navigate(`/onboard/dao`)
            }
        } else {
            try {
                try {
                    const owner = []
                    owners.map((item) => {
                        owner.push(item.address)
                    })
                    await deploySafe(owner)
                } catch (error) {
                    // console.log("error.... on deploying", error);
                }
            } catch (error) {
                // console.log("error.......", error);
            }
        }
    }

    const decreaseStep = () => {
        if (hasMultiSignWallet && steps[currentStep] === "daoInfo") {
            setCurrentStep(steps.indexOf("addOwners"))
        } else if (currentStep > 0) setCurrentStep(currentStep - 1)
    }

    const afterConnectWalletCallback = async (setAuth) => {
        setAuth(false)
        increaseStep()
    }

    const getComponentFromName = (name, hasMultiSignWallet = false) => {
        switch (name) {
            case "connectWallet": {
                return (
                    <ConnectWallet
                        increaseStep={increaseStep}
                        owners={owners}
                        afterConnectWalletCallback={afterConnectWalletCallback}
                        isAdmin={isAdmin}
                    />
                )
            }
            case "gnosisSafeList": {
                return (
                    <GnosisSafeList
                        setStep={(x) => setCurrentStep(x)}
                        increaseStep={increaseStep}
                        setHasMultiSignWallet={setHasMultiSignWallet}
                        guildId={guildId}
                        discordUserId={discordUserId}
                    />
                )
            }
            case "registerDiscord": {
                return <DiscordRegister increaseStep={increaseStep} />
            }
            case "addOwners": {
                return (
                    <AddOwners
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        setStep={(x) => setCurrentStep(steps.indexOf(x))}
                    />
                )
            }
            case "approveTransaction":
                return (
                    <ApproveTransaction
                        increaseStep={increaseStep}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        hasMultiSignWallet={hasMultiSignWallet}
                        setProvider={setProvider}
                    />
                )
            case "daoInfo":
                return (
                    <DaoInfo
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        deploying={deploying}
                        createDao={createDao}
                    />
                )
            case "pocpSignup":
                return (
                    <POCPSignup
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        deploying={deploying}
                    />
                )
            case "identifierExpired":
                return <OnboardingError text="This page has expired" />
            default: {
                return (
                    <ConnectWallet
                        increaseStep={increaseStep}
                        owners={owners}
                        afterConnectWalletCallback={afterConnectWalletCallback}
                    />
                )
            }
        }
    }

    return (
        <div>
            <Layout
                signer={signer}
                decreaseStep={decreaseStep}
                currentStep={currentStep}
                deploying={deploying}
                steps={steps}
            >
                {getComponentFromName(steps[currentStep], hasMultiSignWallet)}
            </Layout>
        </div>
    )
}

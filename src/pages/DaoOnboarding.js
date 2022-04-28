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
    addThreshold,
    lastSelectedId,
    pocpRegirationInfo,
    registerDao,
} from "../store/actions/dao-action"
import { useSafeSdk } from "../hooks"
import { ethers } from "ethers"
import { useNavigate } from "react-router"
import { message } from "antd"
import POCPSignup from "../components/POCPSignup"

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1)
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
            setSafeAddress(newSafeAddress)
            dispatch(addSafeAddress(newSafeAddress))
            setDeploying(true)
            const { dao_uuid, name } = await dispatch(registerDao())
            dispatch(lastSelectedId(dao_uuid))
            if (dao_uuid) {
                // await processDaoToPOCP(name, owners, address, dao_uuid, jwt)
                // navigate("/dashboard")
                dispatch(pocpRegirationInfo(dao_uuid, name, owners))
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

    const increaseStep = async () => {
        if (currentStep === 2) {
            setCurrentStep(currentStep + 1)
        } else if (currentStep === 3) {
            dispatch(addThreshold(selectedIndex + 1))
            setCurrentStep(currentStep + 1)
            if (!hasMultiSignWallet) {
                setProvider()
            }
        } else if (currentStep === 4) {
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
                    // await processDaoToPOCP(name, owner, address, jwt)
                    dispatch(pocpRegirationInfo(dao_uuid, name, owner))
                    setCurrentStep(currentStep + 1)
                } else {
                    navigate(`/onboard/dao`)
                }
            } else {
                try {
                    try {
                        const owner = []
                        owners.map((item, index) => {
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
        } else setCurrentStep(currentStep + 1)
    }

    const decreaseStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1)
        if (currentStep === 4) {
            if (hasMultiSignWallet) {
                setCurrentStep(2)
            } else {
                setCurrentStep(3)
            }
        } else if (currentStep === 2) {
            setCurrentStep(currentStep - 1)
        }
    }

    const getComponentFromStep = (step, hasMultiSignWallet = false) => {
        switch (step) {
            case 1: {
                return (
                    <GnosisSafeList
                        setStep={(x) => setCurrentStep(x)}
                        increaseStep={increaseStep}
                        setHasMultiSignWallet={setHasMultiSignWallet}
                    />
                )
            }
            case 2: {
                return (
                    <AddOwners
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        setStep={(x) => setCurrentStep(x)}
                    />
                )
            }
            case 3:
                return (
                    <ApproveTransaction
                        increaseStep={increaseStep}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                    />
                )
            case 4:
                return (
                    <DaoInfo
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        deploying={deploying}
                    />
                )
            case 5:
                return (
                    <POCPSignup
                        hasMultiSignWallet={hasMultiSignWallet}
                        increaseStep={increaseStep}
                        deploying={deploying}
                    />
                )
            default: {
                return (
                    <ConnectWallet
                        increaseStep={increaseStep}
                        owners={owners}
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
            >
                {getComponentFromStep(currentStep, hasMultiSignWallet)}
            </Layout>
        </div>
    )
}

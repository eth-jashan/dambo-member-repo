import React, { useState, useCallback } from "react"
import { useLocalStorage, useSafeSdk } from "../hooks"
import { ethers } from "ethers"
import { Button } from "antd"

export default function GnosisSafe({ userSigner, userAddress }) {
    const [safeAddress, setSafeAddress] = useLocalStorage("deployedSafe")
    const [deploying, setDeploying] = useState(false)
    const { safeSdk, safeFactory } = useSafeSdk(userSigner, safeAddress)
    const [owners, setOwners] = useState([userAddress])
    const [threshhold, setThreshhold] = useState(1)
    //console.log(userAddress)

    const OWNERS = [
        "0x34aA3F359A9D614239015126635CE7732c18fDF3",
        "0xa81a6a910FeD20374361B35C451a4a44F86CeD46",
    ]

    const deploySafe = useCallback(
        async (owners, threshold) => {
            if (!safeFactory) return
            setDeploying(true)
            const safeAccountConfig = { owners, threshold }
            let safe
            try {
                safe = await safeFactory.deploySafe(safeAccountConfig)
            } catch (error) {
                console.error(error)
                setDeploying(false)
                return
            }
            const newSafeAddress = ethers.utils.getAddress(safe.getAddress())
            setSafeAddress(newSafeAddress)
        },
        [safeFactory]
    )

    //console.log('safeAddress', safeAddress);

    return (
        <div style={{ padding: 32 }}>
            <Button
                loading={deploying}
                onClick={() => deploySafe(OWNERS, threshhold)}
                type={"primary"}
            >
                DEPLOY SAFE
            </Button>
        </div>
    )
}

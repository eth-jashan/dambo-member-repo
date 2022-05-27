import React from "react"
import "./style.scss"
import cross from "../../../assets/Icons/cross.svg"

export default function TreasurySignersModal({
    onClose,
    signers,
    gnosisSignerLink,
}) {
    const openGnosisSigner = () => {
        window.open(gnosisSignerLink)
    }
    return (
        <div className="treasury-signer-modal-container">
            <div className="treasury-signer-modal-backdrop" onClick={onClose}>
                <div
                    className="treasury-signer-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="close-icon" onClick={onClose}>
                        <img src={cross} alt="close" />
                    </div>
                    <div className="heading">Multisig Signers</div>
                    <div className="signers-info">
                        {signers.length} multisig signers
                    </div>
                    <div className="signers-wrapper">
                        {signers.map((signer, index) => (
                            <div className="signer-row" key={index}>
                                <div className="signer-name">
                                    {signer?.metadata?.name.slice(0, 8)}
                                </div>
                                <div className="signer-address">
                                    {signer?.public_address}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="footer-buttons">
                        <div className="okay-btn" onClick={onClose}>
                            Okay
                        </div>
                        <div className="gnosis-btn" onClick={openGnosisSigner}>
                            Visit Gnosis to manage signers
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

import React, { useState } from "react"
import "./style.scss"
import cross from "../../../../assets/Icons/cross.svg"
import plus_black from "../../../../assets/Icons/plus_black.svg"

export default function AddAddress({ selectedMembershipBadge }) {
    const [isBulkMinting, setIsBulkMinting] = useState(false)
    const [addresses, setAddresses] = useState([""])

    const addAddress = () => {
        setAddresses((addresses) => [...addresses, ""])
    }

    return (
        <div className="add-address-screen-container">
            <div className="close-minting-modal">
                <img src={cross} alt="" />
            </div>
            <div className="mint-membership-badge-header">
                <div className="mint-membership-badge-left">
                    <div>Minting</div>
                    <div>Membership badges</div>
                    <div className="mint-membership-badge-name">
                        {selectedMembershipBadge.name}
                    </div>
                </div>
                <div className="mint-membership-badge-right">
                    <img src={selectedMembershipBadge.imgUrl} alt="" />
                </div>
            </div>
            <div className="mint-membership-badge-addresses-wrapper">
                {addresses.map((address, index) => (
                    <div className="address-row" key={index}>
                        <input type="text" className="address-input" />
                        <div className="address-delete">
                            <img src={cross} alt="" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="add-address" onClick={addAddress}>
                <img src={plus_black} alt="" />
                Add another Address
            </div>
            <div className="minting-buttons-wrapper">
                <button>Mint Badges • {addresses.length}</button>
                <div>Bulk Minting</div>
            </div>
        </div>
    )
}

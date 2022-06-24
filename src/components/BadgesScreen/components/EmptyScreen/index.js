import React from "react"
import "./style.scss"

export default function EmptyScreen({ setShowModal }) {
    return (
        <div className="empty-screen-container">
            <div className="heading">No template found</div>
            <div className="sub-heading">
                Create badge to superpower
                <br /> your contributors
            </div>
            <div>
                <button onClick={() => setShowModal(true)}>
                    Copy Badge Template
                </button>
            </div>
        </div>
    )
}

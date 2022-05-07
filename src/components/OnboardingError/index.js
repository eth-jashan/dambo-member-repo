import React from "react"
import "./style.scss"
import { useNavigate } from "react-router-dom"

export default function OnboardingError({ text }) {
    const navigate = useNavigate()
    const goToHome = () => {
        navigate("/")
    }
    return (
        <div className="onboardingErrorContainer">
            <div className="onboardingErrorContent">
                <p>{text}</p>
                <button onClick={goToHome}>Go to HomePage</button>
            </div>
        </div>
    )
}

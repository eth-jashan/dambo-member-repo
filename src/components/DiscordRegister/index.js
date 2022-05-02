import React from "react"
import "./style.scss"
import NextButton from "../NextButton"

export default function DiscordRegister({ increaseStep }) {
    const onNext = () => {
        increaseStep()
    }
    return (
        <div className="discord-register-container">
            discord register page
            <NextButton
                text="Go next"
                nextButtonCallback={onNext}
                isDisabled={false}
            />
        </div>
    )
}

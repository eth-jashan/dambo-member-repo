import React from "react"
import Layout from "../../views/Layout"
import "./style.scss"

export default function MetamaskError() {
    return (
        <Layout>
            <div className="metamask-error-wrapper">
                <div className="heading">Something's wrong🤔</div>
                <div className="sub-heading">
                    Please ensure you're connected with your MetaMask wallet.
                </div>
            </div>
        </Layout>
    )
}

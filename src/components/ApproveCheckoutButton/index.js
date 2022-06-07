import React from "react"
import "./style.scss"
const ApproveCheckoutButton = ({
    totalPaymentAmount,
    paymentApproved,
    onModalOpen,
    badgeApproved,
}) => (
    <div
        onClick={() => onModalOpen()}
        className="container approve-checkout-btn"
    >
        <div className="approval-count-div">
            <div className="request-title">
                {paymentApproved.length + badgeApproved.length} Request approved
            </div>
            {badgeApproved.length > 0 && (
                <div className="contri-title">
                    • {badgeApproved.length} Contribution badge
                </div>
            )}

            {paymentApproved.length > 0 && (
                <div className="payout-title">
                    {badgeApproved.length > 0 && `|${" "}`}
                    {`${paymentApproved.length} payment request (${totalPaymentAmount} $)`}
                </div>
            )}
        </div>
        <div className="review-btn-cnt">
            <div className="review-btn-title">
                Review • {paymentApproved.length + badgeApproved.length}
            </div>
        </div>
    </div>
)

export default ApproveCheckoutButton

import React from "react"
import check from "../../../../assets/Icons/check.svg"
import upload_file_colored from "../../../../assets/Icons/upload_file_colored.svg"
import "./style.scss"
import NextButton from "../../../NextButton"

export default function MembershipCreationStep2({
    increaseStep,
    membershipBadges,
    setMembershipBadges,
}) {
    const checkIsDisabled = () => {
        let isDisabled = false
        membershipBadges.forEach((badge) => {
            if (!badge.name || !badge.image_url) {
                isDisabled = true
            }
        })
        return isDisabled
    }

    const onFileChange = (e, badgeIndex) => {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        const copyOfBadges = membershipBadges.map((ele) => ({ ...ele }))
        copyOfBadges[badgeIndex].image_url = URL.createObjectURL(files[0])
        copyOfBadges[badgeIndex].is_video = false
        if (files[0].type === "video/mp4") {
            copyOfBadges[badgeIndex].is_video = true
        }
        // const formData = new FormData()
        // formData.append("file", files[0])
        copyOfBadges[badgeIndex].file = files[0]
        setMembershipBadges(copyOfBadges)
    }

    return (
        <div className="membership-creation-step2-container">
            <div className="membership-heading">Membership creation</div>
            <div className="membership-content">
                <div className="membership-left">
                    <div className="left-bold">Upload Badge designs</div>
                    <div className="left-greyed">Step 2 of 2</div>
                </div>
                <div className="membership-right">
                    <div className="membership-images-wrapper">
                        {membershipBadges.map((badge, index) => (
                            <div className="badge-row" key={index}>
                                <div>
                                    {badge.image_url && (
                                        <img
                                            src={check}
                                            className="check-mark"
                                            alt="tick"
                                        />
                                    )}
                                    {badge.name}
                                    {badge.image_url && (
                                        <span className="badge-reupload-wrapper">
                                            {" "}
                                            &bull;{" "}
                                            <span className="reupload-btn">
                                                <label
                                                    htmlFor={`upload-file-input-${index}`}
                                                >
                                                    Reupload
                                                </label>
                                            </span>
                                        </span>
                                    )}
                                </div>
                                <div className="badge-image-wrapper">
                                    {badge.image_url ? (
                                        badge.is_video ? (
                                            <video autoPlay muted loop>
                                                <source src={badge.image_url} />
                                            </video>
                                        ) : (
                                            <img src={badge.image_url} alt="" />
                                        )
                                    ) : (
                                        <>
                                            <label
                                                htmlFor={`upload-file-input-${index}`}
                                            >
                                                <img
                                                    src={upload_file_colored}
                                                    alt="upload"
                                                    className="upload-btn"
                                                />
                                            </label>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/png, image/gif, image/jpeg, video/mp4, video/"
                                        id={`upload-file-input-${index}`}
                                        className="upload-file-input-hidden"
                                        onChange={(e) => onFileChange(e, index)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="next-btn-wrapper">
                        <NextButton
                            text="Upload Designs"
                            isDisabled={checkIsDisabled()}
                            nextButtonCallback={increaseStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

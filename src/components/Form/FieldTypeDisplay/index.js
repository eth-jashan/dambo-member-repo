import { Menu, Dropdown } from "antd"
import React, { useState } from "react"
import { assets } from "../../../constant/assets"
import "./style.scss"

export default function FormElementSelection({ item }) {
    // console.log("item", item)
    const renderFieldType = () => (
        <div
            className={
                item.fieldType === "Long text" ? "long-field-div" : "field-div"
            }
        >
            <div>{item.fieldName}</div>
        </div>
    )

    const renderMultiselectType = () => (
        <div className="multiselect-div">
            <div>{item.fieldName}</div>
            <div>
                {item.options.length > 0 && (
                    <div>
                        {item.options.map((option, index) => (
                            <div className="option-wrapper" key={index}>
                                <div className="option-circle" />
                                <div className="option-text" key={index}>
                                    {option}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div></div>
            </div>
        </div>
    )
    const renderImageUpload = () => (
        <div className="uploader-div">
            <div className="image-title">{item.fieldName}</div>
            <div className="image-uploader">
                <img src={assets.icons.uploadFile} />
                <div className="write-ups">
                    <div className="write-ups-heading">
                        Click here to upload a file
                    </div>
                    <div className="write-ups-sub-heading">
                        PNG, JPG, GIF up to 10MB (recommended size: 400px x
                        400px)
                    </div>
                </div>
            </div>
        </div>
    )

    const renderOnSelection = () => {
        switch (item.fieldType) {
            case "Numbers":
                return renderFieldType()
            case "Text Field":
                return renderFieldType()
            case "Long text":
                return renderFieldType()
            case "Multiselect":
                return renderMultiselectType()
            case "Media Upload":
                return renderImageUpload()
            default:
                return null
        }
    }

    return (
        <div className="form-element-type-display-container">
            {renderOnSelection(item.fieldType)}
        </div>
    )
}

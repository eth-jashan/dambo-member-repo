import { Menu, Dropdown, Input, message } from "antd"
import React, { useState } from "react"
import { assets } from "../../../constant/assets"
import MultiSelectOptions from "../MultiSelectOptions"
import plus_black from "../../../assets/Icons/plus_black.svg"
import "./style.scss"

export default function FormElementSelection({
    item,
    onChangeFeildValue,
    index,
    onChangeFeildType,
    onChangeOption,
    removeOptions,
    onMaxSelection,
    deleteFeild,
    schema,
}) {
    const [isEdited, setEdited] = useState(false)
    const [maxSelection, setMaxSelection] = useState(1)
    const [label, setLabel] = useState(item.fieldName)

    const addLevelMenu = (
        <Menu
            items={[
                {
                    key: "1",
                    label: (
                        <a
                            onClick={() =>
                                onChangeFeildType(index, "Text Field")
                            }
                        >
                            Text Field
                        </a>
                    ),
                },
                {
                    key: "2",
                    label: (
                        <a onClick={() => onChangeFeildType(index, "Numbers")}>
                            Number
                        </a>
                    ),
                },
                {
                    key: "3",
                    label: (
                        <a
                            onClick={() => {
                                onChangeFeildType(index, "Multiselect")
                                setEdited(true)
                                onChangeOption(index, 0, "", true)
                            }}
                        >
                            Multiselect
                        </a>
                    ),
                },
                {
                    key: "4",
                    label: (
                        <a
                            onClick={() =>
                                onChangeFeildType(index, "Long text")
                            }
                        >
                            Long text
                        </a>
                    ),
                },
                {
                    key: "5",
                    label: (
                        <a
                            onClick={() =>
                                onChangeFeildType(index, "Media Upload")
                            }
                        >
                            Media Upload
                        </a>
                    ),
                },
            ]}
        />
    )
    console.log("dsd", item)
    const renderSelectionCount = () => (
        <div className="selection-counter-div">
            <div
                onClick={() => {
                    if (maxSelection > 1) {
                        setMaxSelection(maxSelection - 1)
                        onMaxSelection(index, maxSelection - 1)
                    }
                }}
                style={{ opacity: maxSelection === 1 && 0.5 }}
                className="counter-minus"
            />
            <div className="counter-number">{maxSelection}</div>
            <img
                onClick={() => {
                    setMaxSelection(maxSelection + 1)
                    onMaxSelection(index, maxSelection + 1)
                }}
                src={plus_black}
                alt=""
            />
        </div>
    )

    const renderMultiSelect = () => (
        <div
            className={
                isEdited
                    ? "multiselect-wrapper-active"
                    : "multiselect-wrapper-inactive"
            }
        >
            <div className="multiselect-input-type-wrapper">
                <input
                    className="multiselect-input"
                    onChange={(e) => setLabel(e.target.value)}
                    value={label}
                    disabled={!isEdited}
                    placeholder="Type label here"
                />
                <Dropdown
                    trigger="click"
                    disabled={index < 3}
                    overlay={addLevelMenu}
                >
                    <div className="row-field-type">{item.fieldType}</div>
                </Dropdown>
            </div>
            {item.options.length > 0 && (
                <div className="options-wrapper">
                    {item.options.map((option, i) => (
                        <MultiSelectOptions
                            isEdit={isEdited}
                            options={option}
                            key={i}
                            index={i}
                            badgeIndex={index}
                            onChangeOption={onChangeOption}
                            removeOptions={removeOptions}
                            item={item}
                        />
                    ))}
                </div>
            )}
            {isEdited && (
                <div
                    onClick={() =>
                        onChangeOption(index, item.options.length + 1, "")
                    }
                    className="add-btn-options"
                >
                    <img src={plus_black} alt="" />
                    <div>Add another</div>
                </div>
            )}
            {isEdited && (
                <div className="max-selection-divider">
                    <div>Max Selection</div>
                    {renderSelectionCount()}
                </div>
            )}
            {!isEdited && (
                <div className="max-selection-number">
                    Max selection {item.maxSelection}
                </div>
            )}
        </div>
    )

    const renderSingleItem = () => (
        <div
            style={{ height: item.fieldType === "Long text" && "9.85rem" }}
            className={isEdited ? "element-row-edit" : "element-row-input"}
        >
            {isEdited ? (
                item.fieldType !== "Long text" ? (
                    <input
                        style={{
                            background: "transparent",
                            padding: 0,
                            border: 0,
                            margin: 0,
                            width: "60%",
                            height: item.fieldType === "Long text" && "9.85rem",
                        }}
                        className="contribution-right-input"
                        onChange={(e) => setLabel(e.target.value)}
                        value={label}
                        placeholder="Type label here"
                    />
                ) : (
                    <Input.TextArea
                        className="textArea"
                        style={{ width: "60%" }}
                        autoSize={{ maxRows: 3 }}
                        maxLength={200}
                        bordered={false}
                        onChange={(e) => setLabel(e.target.value)}
                        value={label}
                        placeholder="Type label here"
                    />
                )
            ) : (
                <div>
                    <div className="row-field-name">
                        {item.fieldName === ""
                            ? "Type label here"
                            : item.fieldName}
                    </div>
                </div>
            )}
            <Dropdown
                trigger="click"
                disabled={index < 3}
                overlay={addLevelMenu}
            >
                <div className="row-field-type">{item.fieldType}</div>
            </Dropdown>
        </div>
    )

    const renderImageUpload = () => (
        <div className="image-uploader">
            <img src={assets.icons.uploadFile} />
            <div className="write-ups">
                <div className="write-ups-heading">
                    Click here to upload a file
                </div>
                <div className="write-ups-sub-heading">
                    PNG, JPG, GIF up to 10MB (recommended size: 400px x 400px)
                </div>
            </div>
        </div>
    )

    return (
        <div className="form-element-selection-container">
            {isEdited ? (
                <div
                    onClick={() => {
                        deleteFeild(index)
                        setEdited(false)
                        if (schema.length - 1 > index) {
                            setLabel(schema[index + 1].fieldName)
                        }
                    }}
                    className="delete-div"
                >
                    <img src={assets.icons.deletePurple} />
                </div>
            ) : (
                <div className="delete-inactive" />
            )}
            <div className="option-div">
                {item.fieldType !== "Multiselect" && renderSingleItem()}
                {item.fieldType === "Media Upload" && renderImageUpload()}
                {item.fieldType === "Multiselect" && renderMultiSelect()}
            </div>
            <div>
                <div
                    onClick={() => {
                        if (index > 2) {
                            if (item.fieldType === "Multiselect") {
                                if (
                                    !item.options.includes("") &&
                                    !item.options.includes(" ") &&
                                    item.options.length > 0
                                ) {
                                    setEdited(!isEdited)
                                    onChangeFeildValue(index, label)
                                } else if (
                                    item.options.includes("") ||
                                    item.options.includes(" ") ||
                                    item.options.length === 0
                                ) {
                                    message.error("Options are empty")
                                }
                            } else {
                                setEdited(!isEdited)
                                onChangeFeildValue(index, label)
                            }
                        }
                    }}
                    className={isEdited ? "edit-icon-active" : "edit-icon"}
                >
                    {!isEdited ? (
                        <img
                            style={{ opacity: index < 3 && 0.5 }}
                            src={assets.icons.editBlack}
                        />
                    ) : (
                        <img
                            className="edit-tick"
                            src={assets.icons.tickPurple}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

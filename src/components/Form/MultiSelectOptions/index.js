import React from "react"
import "./style.scss"

export default function MultiSelectOptions({
    options,
    isEdit,
    index,
    onChangeOption,
    badgeIndex,
    removeOptions,
    item,
}) {
    return (
        <div className="multi-select-option-container">
            <div className="edit-wrapper">
                {!isEdit ? (
                    <div
                        onClick={() => {
                            if (isEdit && item.options.length > 1) {
                                removeOptions(badgeIndex, index)
                            }
                        }}
                        className={"bullets-circle"}
                    />
                ) : (
                    <div
                        onClick={() => {
                            if (isEdit && item.options.length > 1) {
                                removeOptions(badgeIndex, index)
                            }
                        }}
                        className={"remove-icon"}
                    >
                        <div />
                    </div>
                )}
                <input
                    className={
                        isEdit
                            ? "multi-option-input"
                            : "multi-option-input-inactive"
                    }
                    onChange={(e) =>
                        onChangeOption(badgeIndex, index, e.target.value)
                    }
                    value={options}
                    disabled={!isEdit}
                    placeholder="Type label here"
                />
                {/* <input className="multi-option-input" value={options} /> */}
            </div>
        </div>
    )
}

import React from "react"
import "./styles.scss"
import { Input } from "antd"
const MultiTextBox = ({ value = "", setValue, textLimit }) => {
    return (
        <div className="layout multi-text-box-body">
            <Input.TextArea
                placeholder="enter feedback"
                type="textarea'"
                className="input-box"
                bordered={false}
                autoSize={{ minRows: 4, maxRows: 6 }}
                value={value}
                maxLength={textLimit}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}

export default MultiTextBox

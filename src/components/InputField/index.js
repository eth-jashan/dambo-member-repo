import React from 'react'
import styles from './style.modules.css'
const InputField = ({value, setValue, placeholder}) => {

    

    return(
        // <div className={styles.inputContainer}>
            <input placeholder={placeholder} className={styles.inputContainer} />
        // </div>/
    )

}

export default InputField
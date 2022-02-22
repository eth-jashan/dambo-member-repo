import React, { useState } from 'react'
import styles from './styles.module.css'

const InputText = ({value, onChange, placeholder, width, disabled=false, multi}) => {
    const [onFocus, setOnFocus] = useState()

    const backGroundStatus = () => {
        if(value.length>0 && onFocus){
            return 'white'
        }else if(onFocus){
            return 'white'
        }else if(value.length>0 && !onFocus){
            return '#E1DCFF'
        }else{
            return 'white'
        }
    }

    return(
        <input 
            value={value} 
            onChange={(e)=>onChange(e)} 
            placeholder={placeholder} 
            //type={"textarea" }
            className={styles.textInput}
            onFocus={()=>setOnFocus(true)}
            onBlur={()=>setOnFocus(false)}
            disabled={disabled}
            style={{width:width, height:multi?multi:null, background:backGroundStatus()}}
        />
    )

}

export default InputText
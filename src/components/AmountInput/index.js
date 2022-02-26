
import React, { useState } from 'react'
import Select from 'react-select';
import styles from './style.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'

const { Option } = Select;

const AmountInput = ({value, onChange, updateTokenType}) => {

    const colourStyles = {
        control: (styles, { data, isDisabled, isFocused, isSelected }) => {
           return { ...styles, 
            backgroundColor:isFocused?'#B1A6FF':'#ECFFB8', 
            width: '100%',
            height:'3rem',
            margin:0,
            border:0,
            borderTopLeftRadius:'0.5rem', 
            borderBottomLeftRadius:'0.5rem',
            borderTopRightRadius:0,
            borderBottomRightRadius:0
        }
        },
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        //   const color = chroma(data.color);
          return {
            ...styles,
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'1rem',
            lineHeight:'1.rem',
            // width: '100%',
            // padding:0
          }
        },
        indicatorSeparator:(styles, state)=>({...styles, height:0, width:0}),
        dropdownIndicator:(styles, state)=>({...styles, color:'black'}),
        // indicatorsContainer:(styles, state)=>({...styles, height:'10px', width:'10px'}),
        menu:(styles)=>({...styles, width:'100%',backgroundColor:'#585858'}),
        input: (styles,{data,isDisabled, isFocused, isSelected}) => {
            return { ...styles,   
                fontFamily:'TelegrafMedium',
                fontStyle:'normal',
                fontWeight:'normal',
                fontSize:'16px',
                lineHeight:'24px',
                height:'100%',
            }
        },
        placeholder: (styles) => 
        ({ ...styles,
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'16px',
            lineHeight:'24px', }),
        singleValue: (styles, { data }) => 
        ({ ...styles, 
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'16px',
            lineHeight:'24px',
            width:'100%',
        }),
    };

    const colorOption = [{label:'ETH', value:'ETH'}, {label:'SOL', value:'SOL'}, {label:'BTC', value:'BTC'}, {label:'USD', value:'USD'}]
    const [role, setRole] = useState()
    const [onFocus, setOnFocus] = useState(false)

    return(
        <div className={styles.container}>
            <Select
                className="basic-single"
                classNamePrefix="select"
                closeMenuOnSelect
                onChange={(x)=>updateTokenType(x)}
                styles={colourStyles}
                isSearchable={false}
                name="color"
                options={colorOption}
                defaultValue={{label:'ETH', value:'ETH'}}
                menuPosition='fixed'
            />
            {/* <div style={{width:'50%', background:'red', padding:12}}/> */}
            <div style={{height:'3rem', width:'64%', background:onFocus?'#D3E5A6':'#ECFFB8', display:'flex', flexDirection:'row', alignItems:'center', borderBottomRightRadius:'0.5rem', borderTopRightRadius:'0.5rem'}}>
            <input 
                onFocus={()=>setOnFocus(true)} 
                onBlur={()=>setOnFocus(false)} 
                // value={value}
                onChange={onChange} 
                placeholder='Enter Amount' 
                className={styles.amountInput} 
            />
            {/* <div className={`${textStyles.m_16} ${styles.usdAmount}`}>
                {parseFloat(value)>0 && '$400'}
            </div> */}
            </div>
        </div>
    )

}

export default AmountInput
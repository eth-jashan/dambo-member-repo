
import React, { useState } from 'react'
import Select from 'react-select';
import styles from './style.module.css'
import { AiFillCaretDown } from 'react-icons/all'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useSelector } from 'react-redux';

const { Option } = Select;

const AmountInput = ({value, onChange, updateTokenType}) => {

    const colourStyles = {
        control: (styles, { data, isDisabled, isFocused, isSelected }) => {
           return { ...styles, 
            backgroundColor:isFocused?'#B1A6FF':'#ECFFB8', 
            width: '100%',
            height:'3rem',
            margin:0,
            borderTop:0,
            borderBottom:0,
            borderLeft:0,
            borderTopLeftRadius:'0.5rem', 
            borderBottomLeftRadius:'0.5rem',
            borderTopRightRadius:0,
            borderBottomRightRadius:0,
            borderRight:isFocused?0:'1px solid #A1AE7E',
            paddingRight:'1.25rem',
            outline:isFocused?'none':'none'
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
            lineHeight:'1rem',
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
                fontSize:'1rem',
                lineHeight:'1.5rem',
                height:'100%',
                outline:isFocused?'none':'none',
                border:0
            }
        },
        placeholder: (styles) => 
        ({ ...styles,
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'1rem',
            lineHeight:'1.5rem', }),
        singleValue: (styles, { data }) => 
        ({ ...styles, 
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'1rem',
            lineHeight:'1.5rem',
            width:'100%',
        }),
    };

    const token_available = useSelector(x=>x.dao.balance)
    const [role, setRole] = useState()
    const [onFocus, setOnFocus] = useState(false)

    const CustomDropDownIndicatior = () => (
        <AiFillCaretDown style={{alignSelf:'center'}} color='black' size={'1rem'}  />
    )

    return(
        <div className={styles.container}>
            <Select
                className="basic-single"
                classNamePrefix="select"
                closeMenuOnSelect
                components={{DropdownIndicator:CustomDropDownIndicatior}}
                onChange={(x)=>updateTokenType(x)}
                styles={colourStyles}
                isSearchable={false}
                name="color"
                options={token_available}
                defaultValue={{label:'ETH', value:'ETH'}}
                menuPosition='fixed'
            />
            {/* <div style={{width:'50%', background:'red', padding:12}}/> */}
            <div style={{height:'3rem', width:'70%', background:onFocus?'#D3E5A6':'#ECFFB8', display:'flex', flexDirection:'row', alignItems:'center', borderBottomRightRadius:'0.5rem', borderTopRightRadius:'0.5rem'}}>
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
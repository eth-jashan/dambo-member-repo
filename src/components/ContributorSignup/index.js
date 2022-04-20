import { message, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NextButton from '../NextButton';
import styles from './styles.module.css'
import Select from 'react-select';
import { getCommunityRole, joinContributor, setAdminStatus, setContriInfo } from '../../store/actions/auth-action';
import { useNavigate, useParams } from 'react-router';
import InputText from "../InputComponent/Input";


const ContributorSignup = ({increaseStep, decreaseStep}) => {
    const { id } = useParams();
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const colorOption = useSelector(x=>x.auth.community_roles)
    const [role, setRole] = useState()
    const navigate = useNavigate()
    const address = useSelector(x=>x.auth.address)
    const fetchRoles = useCallback( async() => {
        try {
            await dispatch(getCommunityRole())
            // await dispatch(getDao())
        } catch (error) {
            //console.log('error in fetching role.....')
        }
    },[dispatch])

    useEffect(()=>{
        fetchRoles()
    },[fetchRoles])

    const onSubmit = async() => {
        dispatch(setContriInfo(name, role))
        try {
         const res =  await dispatch(joinContributor(id))
         if(res){
            navigate(`/dashboard`)
            message.success('You successfully joined as contributor')
            dispatch(setAdminStatus(true))
         }
        } catch (error) {
            message.error('Error on Joining')
            //console.log('error on joining...', error)
        }
    }
    
    const colourStyles = {
        control: (styles, state) => {
           return { ...styles, 
            backgroundColor: 'white', 
            width: '60%',
            borderRadius:'0.5rem',
            padding:'0.5rem',
            border:(state.menuIsOpen|| state.isFocused) ?'1px solid #6852FF':'1px solid #eeeef0' 
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
            width: '100%'
          }
        },
        dropdownIndicator:(styles, state)=>({...styles, color:(state.menuIsOpen|| state.isFocused)?'#6852FF':'#e0e0e0'}),
        menu:(styles)=>({...styles, width:'60%'}),
        input: (styles,{data,isDisabled, isFocused, isSelected}) => {
            return { ...styles,   
                fontFamily:'TelegrafMedium',
                fontStyle:'normal',
                fontWeight:'normal',
                fontSize:'16px',
                lineHeight:'24px',
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
            width:'60%'
        }),
    };
    
    return(
        <div className={styles.layout}>
                <div style={{flexDirection:'column', display:'flex'}}>
                
                <div className={styles.heading}>
                Almost done
                </div>
                <div className={styles.greyHeading}>
                Please tell us a bit<br/>about yourself
                </div>

                <div>
                <div style={{marginTop:'40px'}}>
                    {/* <Typography.Text className={styles.helperText}>What should we call your DAO</Typography.Text> */}
                    <div>
                        <InputText width={'60%'} value={name} onChange={(e)=>setName(e.target.value)} placeholder='Your Name' className={name ===''?styles.input:styles.inputText} />
                    </div>
                </div>
                {/* <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}> */}
                <div style={{marginTop:'20px'}}>
                    {/* <Typography.Text className={styles.helperTextSec}>How we can reach you</Typography.Text> */}
                    <div>
                    <Select
                        // components={{Option: CustomOption}}
                        className="basic-single"
                        classNamePrefix="select"
                        closeMenuOnSelect
                        onChange={setRole}
                        styles={colourStyles}
                        isSearchable={false}
                        name="color"
                        options={colorOption}
                        placeholder='Role'
                    />
                    </div>
                </div>
                {/* </Select> */}
                </div>
            </div>
            <div className={styles.nextBtn}>
                <NextButton
                    text="Review"
                    increaseStep={onSubmit}
                    isDisabled={name === ''}
                    isContributor={true}
                />
            </div>
        </div>
    )
}

export default ContributorSignup
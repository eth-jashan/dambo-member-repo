import { Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NextButton from '../NextButton';
import styles from './styles.module.css'
import Select from 'react-select';
import { getCommunityRole, joinContributor, setAdminStatus, setContriInfo } from '../../store/actions/auth-action';
import { useNavigate, useParams } from 'react-router';
import { getDao } from '../../store/actions/gnosis-action';


const ContributorSignup = ({increaseStep, decreaseStep}) => {
    const { id } = useParams();
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const colorOption = useSelector(x=>x.auth.community_roles)
    const [role, setRole] = useState()
    const navigate = useNavigate()
    const fetchRoles = useCallback( async() => {
        try {
            await dispatch(getCommunityRole())
            await dispatch(getDao())
        } catch (error) {
            console.log('error in fetching role.....')
        }
    },[dispatch])

    useEffect(()=>{
        fetchRoles()
    },[fetchRoles])

    const onSubmit = async() => {
        dispatch(setContriInfo(name, role))
        try {
        console.log('start........')
         const res =  await dispatch(joinContributor(id))
         console.log('resss', res)
         if(res){
            navigate(`/dashboard/${id}`)
            dispatch(setAdminStatus(true))
         }
        } catch (error) {
            console.log('error on joining...', error)
        }
    }
    
    const colourStyles = {
        control: (styles, state) => {
           return { ...styles, backgroundColor: 'white', width: '60%',border:(state.menuIsOpen|| state.isFocused) ?'1px solid #6852FF':null }
        },
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        //   const color = chroma(data.color);
          return {
            ...styles,
            fontFamily:'TelegrafMedium',
            fontStyle:'normal',
            fontWeight:'normal',
            fontSize:'16px',
            lineHeight:'24px',
            width: '100%'
          }
        },
        dropdownIndicator:(styles, state)=>({...styles, color:(state.menuIsOpen|| state.isFocused)?'#6852FF':'#e0e0e0'}),
        menu:(styles)=>({...styles, width:'60%'}),
        input: (styles,{data,isDisabled, isFocused, isSelected}) => {
            return { ...styles,   
                // border:'1px solid #6852FF'
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
                
                <Typography.Text className={styles.heading}>
                Almost done
                </Typography.Text>
                <Typography.Text className={styles.greyHeading}>
                Please tell us a bit<br/>about yourself
                </Typography.Text>

                <div>
                <div style={{marginTop:'40px'}}>
                    {/* <Typography.Text className={styles.helperText}>What should we call your DAO</Typography.Text> */}
                    <div>
                        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder='Your Name' className={name ===''?styles.input:styles.inputText} />
                    </div>
                </div>
                {/* <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}> */}
                <div style={{marginTop:'20px'}}>
                    {/* <Typography.Text className={styles.helperTextSec}>How we can reach you</Typography.Text> */}
                    <div>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        closeMenuOnSelect
                        onChange={setRole}
                        styles={colourStyles}
                        isSearchable={false}
                        name="color"
                        options={colorOption}
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
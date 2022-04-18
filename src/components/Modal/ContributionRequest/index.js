import React, { useState } from 'react'
import styles from './styles.module.css'
import { MdChevronRight } from 'react-icons/all'
import cross from '../../../assets/Icons/cross.svg'
import InputText from '../../InputComponent/Input'
import { Input, message,Progress } from 'antd'
import { useDispatch } from 'react-redux'
import { createContributionrequest } from '../../../store/actions/contibutor-action'
const ContributionRequestModal = ({setVisibility}) => {

    const [title, setTile] = useState('')
    const [time, setTime] = useState('')
    const [link, setLink] = useState('')
    const [comments, setComments] = useState('')
    const [contributionType, setContributionType] = useState('')
    const [descriptionFocus, setDescriptionFocus] = useState('')

    const dispatch = useDispatch()

    const isValid = () => {
        if(title.length > 0 && time.length > 0 && link.length > 0 && comments.length > 0  ){
            return true
        }else{
            return false
        }
    }

    const onSubmit = async() => {
        const res = await dispatch(createContributionrequest(title, "DESIGN", link, time, comments))
        if(res){
            message.success('Request Submitted Successfully')
            setVisibility(false)
        }else{
            message.error('Try creating again')
        }
    }

    const textAreaProperty = () => {
        if(descriptionFocus){
            return{background:'white', border:'1px solid #6852FF'}
        }else if(!descriptionFocus && comments.length>0){
            return{background:'#E1DCFF', border:'1px solid #EEEEF0'}
        }else if(!descriptionFocus && comments.length===0){
            return{background:'white', border:'1px solid #EEEEF0'}
        }
    }

    return(
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <div style={{display:'flex', alignItems:'start', flexDirection:'column', width:'100%'}}>
                    <img 
                        onClick={()=>setVisibility(false)}
                        alt='cross' 
                        src={cross} 
                        className={styles.cross} 
                    />
                    <div className={`${styles.heading}`}>
                        New contribution<br/> request
                    </div>

                    <div style={{width:'100%'}}>
                    <InputText 
                        placeholder='Contribution Title' 
                        onChange={e=>setTile(e.target.value)} 
                        value={title} 
                        width={'100%'} 
                    />
                    </div>
                    
                    <div className={styles.rowInput}>
                    <div style={{width:'48%'}}>
                        <InputText 
                            placeholder='Time Spent' 
                            onChange={e=>setTime(e.target.value)} 
                            value={time} 
                            width={'100%'} 
                        />
                    </div>
                    <div style={{width:'48%'}}>
                        <InputText 
                            placeholder='External Link' 
                            onChange={e=>setLink(e.target.value)}   
                            value={link} 
                            width={'100%'} 
                        />
                    </div>
                    </div>

                    <div style={{width:'100%'}}>
                    <InputText 
                        placeholder='Contribution Type' 
                        onChange={e=>setContributionType(e.target.value)} 
                        value={contributionType} 
                        width={'100%'} 
                    />
                    </div>
                    
                    <div style={{height:'7.25rem', width:'100%', marginTop:'1rem', position:'relative', border:textAreaProperty()?.border, borderRadius:'0.5rem', background:textAreaProperty()?.background}}>
                        <Input.TextArea
                            placeholder='Write your feedback here'
                            className={styles.textArea}
                            onFocus={()=>setDescriptionFocus(true)}
                            onBlur={()=>setDescriptionFocus(false)}
                            autoSize={{ maxRows: 3}}
                            maxLength={200}
                            bordered={false}
                            value={comments}
                            onChange={(e)=>setComments(e.target.value)}
                        />
                        <Progress trailColor='#CCCCCC' strokeColor='#6852FF' strokeWidth={10} style={{ bottom:12, right:12, position:'absolute'}} width={20} type="circle" showInfo={false} percent={(comments.length/200)*100} />
                        
                    </div>
                </div>

                <div onClick={isValid()?()=>onSubmit():()=>{}} className={styles.buttonSubmit}>
                    <div className={isValid()?styles.validText:styles.gereyedText}>
                        Create Request
                    </div>
                    <MdChevronRight color={isValid()?'white':'#B4A8FF'} />
                </div>
                
                {/* </div> */}
            </div>
        {/* <div className={styles.opacity}/> */}
        </div>
    )
}

export default ContributionRequestModal
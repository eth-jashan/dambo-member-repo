import React, { useState } from 'react'
import styles from './styles.module.css'
import { MdChevronRight } from 'react-icons/all'
import cross from '../../../assets/Icons/cross.svg'
import InputText from '../../InputComponent/Input'
import { Input, message } from 'antd'
import { useDispatch } from 'react-redux'
import { createContributionrequest } from '../../../store/actions/contibutor-action'
const ContributionRequestModal = ({setVisibility}) => {

    const [title, setTile] = useState('')
    const [time, setTime] = useState('')
    const [link, setLink] = useState('')
    const [comments, setComments] = useState('')
    const [contributionType, setContributionType] = useState('')

    const dispatch = useDispatch()

    const isValid = () => {
        if(title.length > 0 && time.length > 0 && link.length > 0 && comments.length > 0  ){
            return true
        }else{
            return false
        }
    }

    const onSubmit = async() => {
        const res = await dispatch(createContributionrequest(title, 'DESIGN', link, time, comments))
        if(res){
            message.success('Request Submitted Successfully')
            setVisibility(false)
        }else{
            message.error('Try creating again')
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

                    <InputText 
                        placeholder='Contribution Title' 
                        onChange={e=>setTile(e.target.value)} 
                        value={title} 
                        width={'100%'} 
                    />
                    
                    <div className={styles.rowInput}>
                        <InputText 
                            placeholder='Time Spent' 
                            onChange={e=>setTime(e.target.value)} 
                            value={time} 
                            width={'48%'} 
                        />
                        <InputText 
                            placeholder='External Link' 
                            onChange={e=>setLink(e.target.value)}   
                            value={link} 
                            width={'48%'} 
                        />
                    </div>

                    <InputText 
                        placeholder='Contribution Type' 
                        onChange={e=>setContributionType(e.target.value)} 
                        value={contributionType} 
                        width={'100%'} 
                    />
                    
                    <div className={styles.multiInput}>
                    <InputText 
                        placeholder='Additional Comments' 
                        onChange={e=>setComments(e.target.value)} 
                        value={comments} 
                        width={'100%'} 
                        multi={'7.25rem'}
                    />
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
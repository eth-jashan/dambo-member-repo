import React, { useState } from 'react'
import styles from './styles.module.css'
import textStyles from '../../../commonStyles/text.modules.css'

import cross from '../../../assets/Icons/cross.svg'
import InputText from '../../Input'
const ContributionRequestModal = ({setVisibility}) => {

    const [title, setTile] = useState('')
    const [time, setTime] = useState('')
    const [link, setLink] = useState('')
    const [contributionType, setContributionType] = useState('')

    return(
        // <div className={styles.container}>
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                {/* <div style={{background:'red', width:'100%'}}> */}
                {/* <div> */}
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
                            onChange={e=>setTile(e.target.value)} 
                            value={time} 
                            width={'48%'} 
                        />
                        <InputText 
                            placeholder='External Link' 
                            onChange={e=>setTile(e.target.value)}   
                            value={link} 
                            width={'48%'} 
                        />
                    </div>

                    <InputText 
                        placeholder='Contribution Title' 
                        onChange={e=>setContributionType(e.target.value)} 
                        value={contributionType} 
                        width={'100%'} 
                    />
                    
                    <div className={styles.multiInput}>
                        <InputText 
                            placeholder='Additional Comments' 
                            onChange={e=>setTile(e.target.value)} 
                            value={title} 
                            width={'100%'} 
                            multi={'7.25rem'}
                        />
                    </div>
                {/* </div> */}

                {/* <div className={styles.buttonSubmit}>

                </div> */}
                
                {/* </div> */}
            </div>
        {/* <div className={styles.opacity}/> */}
        </div>
    )
}

export default ContributionRequestModal
import { Typography } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDaoInfo } from '../../store/actions/gnosis-action';
import InputField from '../InputField';
import NextButton from '../NextButton';
import styles from './styles.module.css'

const DaoInfo = ({increaseStep, decreaseStep}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const dispatch = useDispatch()

    const onSubmit = () => {
        console.log('namesss===>', name)
        dispatch(addDaoInfo(name, email))
        increaseStep()
    }

    return(
        <div className={styles.layout}>
            <div>
                <Typography.Text className={styles.heading}>
                Tell us a lil about<br/>your DAO
                </Typography.Text>

                <div>
                <div style={{marginTop:'90px'}}>
                    <Typography.Text className={styles.helperText}>What should we call your DAO</Typography.Text>
                    <div>
                        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder='DAO Name' className={name ===''?styles.input:styles.inputText} />
                    </div>
                </div>
                <div>
                    <Typography.Text className={styles.helperTextSec}>How we can reach you</Typography.Text>
                    <div>
                        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Your email address (optional)' className={email ===''?styles.input:styles.inputText} />
                    </div>
                </div>
                </div>
            </div>
            <div className={styles.nextBtn}>
                <NextButton
                    text="Review"
                    increaseStep={onSubmit}
                    isDisabled={name === ''}
                />
            </div>
        </div>
    )
}

export default DaoInfo
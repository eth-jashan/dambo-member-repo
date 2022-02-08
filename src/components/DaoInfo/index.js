import { Typography } from 'antd';
import React from 'react';
import NextButton from '../NextButton';
import styles from './styles.module.css'

const DaoInfo = ({increaseStep, decreaseStep}) => {
    
    return(
        <div className={styles.layout}>
            <Typography.Text className={styles.heading}>
            Tell us a lil about<br/>your DAO
            </Typography.Text>

            <div>
            <div>
                <Typography.Text className={styles.helperText}>What should we call your DAO</Typography.Text>
                <div>
                    <input placeholder='DAO Name' className={styles.input} />
                </div>
            </div>
            <div>
                <Typography.Text className={styles.helperText}>How we can reach you</Typography.Text>
                <div>
                    <input placeholder='Your email address (optional)' className={styles.input} />
                </div>
            </div>
            </div>
            <div className={styles.nextBtn}>
                <NextButton
                    text="Review"
                    increaseStep={increaseStep}
                />
            </div>
        </div>
    )
}

export default DaoInfo
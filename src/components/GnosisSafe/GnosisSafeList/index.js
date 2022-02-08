import { Divider, Typography,List, Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import styles from './style.module.css'
import { MdOutlineAdd } from 'react-icons/md'
import { BsChevronRight } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux';
import { addSafeAddress, getAllSafeFromAddress } from '../../../store/actions/gnosis-action';

const GnosisSafeList = (props) => {

    // const safeList = ['1','2','3','4','1','2','3','4']
    const setCurrentStep = () => {
        console.log('pressed====>')
        props.setStep(3)
    }
    const safeList = useSelector(x=>x.gnosis.allSafeList)

    const dispatch = useDispatch()

    const setGnosisWallet = (x) => {
        dispatch(addSafeAddress(x))
        setCurrentStep()
    }

    const fetchAllSafe = useCallback(async() => {
        try {
            dispatch(getAllSafeFromAddress('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'))
        } catch (error) {
            console.log('error on safe fetch.......', error)
        }
    },[dispatch])

    useEffect(()=>{
        fetchAllSafe()
    },[fetchAllSafe])


    const RenderSafe = ({item}) => (
        <div onClick={()=>setGnosisWallet(item)} className={styles.safeSingleItem}>
            {/* <Divider /> */}
            <div>
            {/* <Typography.Text className={styles.safeTitle}>
            IAN DAO
            </Typography.Text> */}
            <Typography.Text className={styles.safeAdress}>
            {item}
            </Typography.Text>
            </div>
            <BsChevronRight className={styles.chevronIcon} />
            {/* <Divider /> */}
        </div>
    )

    return(
        <div className={styles.layout}>
            <Typography.Text className={styles.heading}>
            Select the safe you<br/> want to continue with
            </Typography.Text>
            <div className={styles.content}>
                <div className={styles.listContent}>
                {safeList.map((item,index)=>(
                    <RenderSafe item={item} />
                ))}
                </div>
                <div onClick={()=>props.increaseStep()} className={styles.multiSigCtn}>
                   <MdOutlineAdd color={'#6852FF'} style={{alignSelf:'center'}} /> 
                   <div className={styles.multiSigBtn}>
                       Create New Multisig
                    </div>
                </div>
            </div>
            
        </div>
    )

}

export default GnosisSafeList
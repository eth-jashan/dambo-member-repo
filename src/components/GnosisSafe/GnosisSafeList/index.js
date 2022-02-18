import { Divider, Typography,List, Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import styles from './style.module.css'
import { MdOutlineAdd } from 'react-icons/md'
import { FaChevronRight } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { addSafeAddress, getAllSafeFromAddress } from '../../../store/actions/gnosis-action';
import { useNavigate } from 'react-router';
import chevron_right from '../../../assets/Icons/chevron_right.svg'

const GnosisSafeList = (props) => {

    const setCurrentStep = () => {
        console.log('pressed====>')
        props.setStep(2)
    }
    let safeList = useSelector(x=>x.gnosis.allSafeList)
    safeList = safeList?.filter(x=>x.name === '')

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const setGnosisWallet = (x) => {
        dispatch(addSafeAddress(x.addr))
        if(x.name !== ''){
            navigate('/dashboard')
        }else{
            props.setHasMultiSignWallet(true)
            setCurrentStep()
        }
    }
    const address = useSelector(x=>x.auth.address)
    console.log(address)
    const fetchAllSafe = useCallback(async() => {
        try {
            dispatch(getAllSafeFromAddress(address))
        } catch (error) {
            console.log('error on safe fetch.......', error)
        }
    },[address, dispatch])

    useEffect(()=>{
        fetchAllSafe()
    },[fetchAllSafe])


    const RenderSafe = ({item}) => (
        <div onClick={()=>setGnosisWallet(item)} className={styles.safeSingleItem}>
            <div>
            <Typography.Text className={styles.safeAdress}>
            {item.addr}
            </Typography.Text>
            </div>
            <img src={chevron_right} className={styles.chevronIcon} width='32px' height='32px' alt='cheveron-right'/>
        </div>
    )

    return(
        <div className={styles.layout}>
            <div className={styles.heading}>
            Select the safe you<br/> want to continue with
            </div>
            <div className={styles.content}>
                <div className={styles.listContent}>
                {safeList.map((item,index)=>(
                    <RenderSafe key={index} item={item} />
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
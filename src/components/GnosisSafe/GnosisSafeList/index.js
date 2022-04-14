import { Divider, Typography,List, Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import styles from './style.module.css'
import { MdOutlineAdd } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import chevron_right from '../../../assets/Icons/chevron_right.svg'
import plus from '../../../assets/Icons/plus_black.svg'
import textStyles from '../../../commonStyles/textType/styles.module.css'
import { addSafeAddress, getAllSafeFromAddress } from '../../../store/actions/dao-action';

const GnosisSafeList = (props) => {

    const setCurrentStep = () => {
        props.setStep(2)
    }
    let safeList = useSelector(x=>x.dao.allSafeList)
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

    const createNewMulti = () => {
        props.increaseStep()
        props.setHasMultiSignWallet(false)
    }
    
    const renderNoWallet = () => (
        <div 
            onClick={()=>createNewMulti()} 
            className={styles.noWaletItem}
        >
            <div>
            <img alt='plus' src={plus} className={styles.plus} />
            <Typography.Text className={styles.noWalletText}>
                Create New Multisig
            </Typography.Text>
            </div>
            <img src={chevron_right} className={styles.chevronIcon} width='32px' height='32px' alt='cheveron-right'/>
        </div>
    )
    
    return(
        <div className={styles.layout}>
            {safeList.length>0? 
            <div className={`${styles.heading} ${textStyles.ub_53}`}>
                Select the safe you<br/> want to continue with
            </div>:
            <div className={`${styles.headingSecondary} ${textStyles.ub_53}`}>
                Couldn’t find multisig
            </div>}
            {!safeList.length>0&&
            <div className={`${styles.headingSecondary} ${styles.greyHeading}`}>
                Create a new one
            </div>}
            <div className={styles.content}>
                {safeList.length>0?
                <div className={styles.listContent}>
                {safeList.map((item,index)=>(
                    <RenderSafe key={index} item={item} />
                ))}
                </div>:
                renderNoWallet()
                }
                {safeList.length>0&&
                <div onClick={()=>createNewMulti()} className={styles.multiSigCtn}>
                    <MdOutlineAdd color={'#6852FF'} style={{alignSelf:'center'}} /> 
                    <div className={styles.multiSigBtn}>
                       Create New Multisig
                    </div>
                </div>}
            </div>
            
        </div>
    )

}

export default GnosisSafeList
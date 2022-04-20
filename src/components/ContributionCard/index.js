import React, { useState } from 'react'
import styles from './style.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setTransaction } from '../../store/actions/transaction-action'
import { convertTokentoUsd } from '../../utils/conversion'
import three_dots from "../../assets/Icons/three_dots.svg";
import { getAllBadges, setContributionDetail } from '../../store/actions/contibutor-action'
import { ethers } from 'ethers'
import { web3 } from '../../constant/web3'
import { claimPOCPBadges } from '../../utils/POCPutils'
import { getAuthToken } from '../../store/actions/auth-action'
import { relayFunction } from '../../utils/relayFunctions'
import { getContributorOverview } from '../../store/actions/dao-action'

export default function ContributionCard({item, signer,community_id}) {
    const address = item?.requested_by?.public_address;
    const dispatch = useDispatch()
    const contri_filter_key = useSelector(x=>x.dao.contri_filter_key)
    const role = useSelector(x=>x.dao.role)
    const onContributionPress = async() => {
        if(role==='ADMIN'){
            const ethPrice = await convertTokentoUsd('ETH')
            if(ethPrice && contri_filter_key !== 0 ){
                dispatch(setTransaction(item, ethPrice))
            }else if (contri_filter_key === 0){
                dispatch(setTransaction(item, ethPrice))
            }
        }else{
            dispatch(setContributionDetail(item))
        }
    }

    const [onHover, setOnHover] = useState(false)

    const getStatusProperty = () => {
        if(item.status === 'APPROVED' && item.payout_status==='REQUESTED'){
            return {color:'#A2FFB7', title:'approved'}
        }if(item.status === 'REQUESTED'){
            return {color:'#FFC664', title:'active'}
        }
        else if (item.status === 'REJECTED'){
            return {color:'#808080', title:'rejected'}
        }else if(item.status === 'APPROVED' && item.payout_status === 'PAID'){
            return {color:'#808080', title:'paid'}
        }
    }
    const unclaimed = useSelector(x=>x.contributor.unclaimed)
    const isApprovedToken = () => {
        const token = unclaimed.filter(x=>x.identifier === item?.id.toString())
        if(token.length>0){
          return {status:true, token:token}
        }else{
          return {status:false, token:[]}
        }
      }

    const getContributionStatus = () => {
        if(item.status === 'REQUESTED'){
            return{title:'waiting for approval', color:'#FFC664'}
          }
          else if(item.status === 'REJECTED'){
            return{title:'rejected', color:'red'}
          }
          else if (item.status === 'APPROVED'&&item?.payout_status !== 'PAID'){
            return{title:'waiting for signing', color:'#FFC664'}
          }
          if(item?.status==='APPROVED'&&item?.payout_status==='PAID'){
            return{title:'executed', color:'white'}
          }
    }
    
    const [load, setLoad] = useState(false)

    const claimBadges = async() => {
        if(!load){
            setLoad(true)
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          await web3Provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.polygon}]
          })
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
          const {data, signature} = await claimPOCPBadges(signer,address,[parseInt(isApprovedToken().token[0].id)])
          const token = await dispatch(getAuthToken())
          const tx_hash = await relayFunction(token,3,data,signature)
          if(tx_hash){
          const startTime = Date.now()
          const interval = setInterval(async()=>{
              if(Date.now() - startTime > 30000){
              clearInterval(interval)
              //console.log('failed to get confirmation')
              }
              var customHttpProvider = new ethers.providers.JsonRpcProvider(web3.infura);
              const reciept = await customHttpProvider.getTransactionReceipt(tx_hash)
              if(reciept?.status){
              //console.log('done', reciept)
              clearTimeout(interval)
              //console.log('successfully registered')
              await web3Provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.rinkeby}],
              })
              }
              //console.log('again....')
          },2000)
          }else{
          //console.log('error in fetching tx hash....')
              await web3Provider.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.chainid.rinkeby}],
              })
          }
      } catch (error) {
          //console.log(error.toString())
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.rinkeby}],
          })
        }
        }
        setLoad(false)
        await dispatch(getAllBadges(signer,address,community_id))
        await dispatch(getContributorOverview())
        
    }

    return(
        <div 
            onMouseEnter={()=>setOnHover(true)} 
            onMouseLeave={()=>setOnHover(false)} 
            onClick={()=>onContributionPress()} 
            className={styles.container}
        >
            <div className={styles.titleContainer}>
                <div style={{fontFamily:onHover&&'TelegrafBolder'}} className={`${textStyles.m_16} ${styles.title}`}>{item?.title}</div>
            </div>
            <div className={styles.statusContainer}>
                {contri_filter_key && role!=='ADMIN'?null:<div className={textStyles.m_16} style={{color:getStatusProperty()?.color, textAlign:'start'}}>{getStatusProperty()?.title}</div>}
            </div>
            <div className={styles.descriptionContainer}>
                <div style={{color:onHover&&'white'}} className={`${textStyles.m_16} ${styles.description}`}>{`${item?.requested_by?.metadata?.name?.toLowerCase()}  •  ${item?.stream?.toLowerCase()}  •  ${item?.time_spent} hrs`}</div>
            </div>
            {role==='ADMIN'?null:
            <div onClick={()=>claimBadges()} className={styles.statusContributorContainer}>
                <div className={textStyles.m_16} style={{color:getContributionStatus()?.color, textAlign:'start'}}>{getContributionStatus()?.title}</div>
                {item?.status==='APPROVED'&&item?.payout_status==='PAID'&&isApprovedToken()?.status&&<div style={{color:'#ECFFB8'}} className={textStyles.m_16}> • {load?'claiming..':'claim badge'}</div> }
            </div>}
            {/* <img className={styles.menuIcon} alt='menu' src={three_dots} /> */}
        </div>
    )
    
}
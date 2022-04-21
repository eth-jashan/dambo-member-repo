import React, { useCallback, useEffect, useState } from 'react'
import styles from './style.module.css'
import pocp_bg from '../../assets/POCP_background.svg'
import { getMetaInfo } from '../../utils/relayFunctions'
import { useDispatch, useSelector } from 'react-redux'
import { setContributionDetail } from '../../store/actions/contibutor-action'

const BadgeItem = ({item}) => {
    //console.log('item', item)
    const [meta, setMeta] = useState()
    const allContribution = useSelector(x=>x.dao.contribution_id)
    const currentDao = useSelector(x=>x.dao.currentDao)

    const fetchMetaFromIpfs = useCallback( async() => {
        const res = await getMetaInfo(item?.ipfsMetaUri)
        setMeta(res)
    },[item?.ipfsMetaUri])

    useEffect(()=>{
        fetchMetaFromIpfs()
    },[fetchMetaFromIpfs])

    const [onHover, setHover] = useState(false)
    const dispatch = useDispatch()
    const onBadgeClick = () => {
        const contribution = allContribution.filter(x=>x.id.toString() === item?.identifier) 
        dispatch(setContributionDetail({...contribution[0],isClaimed:true}))
    }

    return(
        <div onClick={()=>onBadgeClick()} onMouseLeave={()=>setHover(false)} onMouseEnter={()=>setHover(true)} style={{padding:'20px', border:'0.5px solid #C4C4C440', display:'flex', alignItems:'center', justifyContent:'center', borderTop:0, background:onHover&&'#292929'}}>
        <div style={{background:onHover?'#292929':'black'}} className={styles.container}>
                <div style={{width:'3.75rem', height:'3.8rem', position:'absolute', right:'0.4rem', top:'1.05rem', background:'black',backgroundRepeat: 'no-repeat',backgroundPosition: 'center',backgroundSize: 'cover', backgroundImage: `url(${currentDao?.logo_url?currentDao?.logo_url:"https://s3uploader-s3uploadbucket-q66lac569ais.s3.amazonaws.com/1694805252.jpg"})` }}>
                <div style={{height:0, width:0, borderBottom:onHover?'16px solid #292929':'16px solid black',borderRight:'16px solid transparent', bottom:0, position:'absolute'}}/>
                <div style={{height:0, width:0, borderBottom:'20px solid transparent',borderRight:onHover?'20px solid #292929':'20px solid black', top:0, position:'absolute', right:0}}/>
                </div>
            <img alt='pocp_bg' src={pocp_bg} style={{position:'absolute', width:'100%', height:'17.5rem',top:0, right:0}} />
            <div style={{fontSize:'0.625rem',  color:'white', fontFamily:'SFMono',left:0, position:'absolute', top:'1rem'}}>{meta?.attributes[0]?.value}</div>

            <div style={{width:'70%',position:'absolute', background:'red'}}>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'2.5rem', fontWeight:'400', lineHeight:'1.688rem', color:'#F5A60B', textAlign:'start'}}>{meta?.name}</div>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'4.125rem', fontWeight:'400', lineHeight:'1.688rem', color:'black', textAlign:'start'}}>{meta?.description}</div>
            </div>

            
                <div style={{display:'flex', flexDirection:'row', position:'absolute', top:'8.125rem', left:18}}>

                    <div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono', textAlign:'start'}}>To</div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>From</div>
                    </div>

                    <div style={{marginLeft:'0.5rem'}}>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>{`${item?.claimer?.slice(0,5)}...${item?.claimer?.slice(-3)}`}</div>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>{`${item?.approver?.slice(0,5)}...${item?.approver?.slice(-3)}`}</div>
                    </div>

                </div>
                <div style={{display:'flex', flexDirection:'row', position:'absolute', bottom:18, left:60, justifyContent:'space-between', right:30, alignItems:'center'}}>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'#767676', fontFamily:'SFMono'}}>DREP-1</div>
                    <div style={{fontWeight:'500', fontSize:'0.563rem', color:'black', fontFamily:'SFMono'}}>PROOF OF CONTRIBUTION</div>
                </div>
        </div>
        </div>
    )
}

export default BadgeItem
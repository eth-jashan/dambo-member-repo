import React from 'react'
import styles from './style.module.css'
import pocp_bg from '../../assets/POCP_background.svg'

const POCPBadge = ({dao_name, title, to, from, date, doa_url}) => {
    
    return(
        <div className={styles.container}>
                <div style={{width:'4rem', height:'4.1rem', position:'absolute', right:'0.4rem', top:'0.5rem', background:'black',backgroundRepeat: 'no-repeat',backgroundPosition: 'center',backgroundSize: 'cover', backgroundImage: `url(${doa_url})` }}>
                <div style={{height:0, width:0, borderBottom:'16px solid black',borderRight:'16px solid transparent', bottom:0, position:'absolute'}}/>
                <div style={{height:0, width:0, borderBottom:'20px solid transparent',borderRight:'20px solid black', top:0, position:'absolute', right:0}}/>
                </div>
            <img alt='pocp_bg' src={pocp_bg} style={{position:'absolute', width:'100%', height:'17.5rem',top:0, right:0}} />
            <div style={{fontSize:'0.625rem',  color:'white', fontFamily:'SFMono',left:0, position:'absolute', top:'0.3rem'}}>{date}</div>

            <div style={{width:'70%',position:'absolute'}}>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'2.5rem', fontWeight:'400', lineHeight:'1.688rem', color:'#F5A60B', textAlign:'start'}}>{dao_name}</div>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'4.125rem', fontWeight:'400', lineHeight:'1.688rem', color:'black', textAlign:'start'}}>{title}</div>
            </div>

            
                <div style={{display:'flex', flexDirection:'row', position:'absolute', top:'8.125rem', left:18}}>

                    <div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono', textAlign:'start'}}>To</div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>From</div>
                    </div>

                    <div style={{marginLeft:'8px'}}>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>{to}</div>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>{from}</div>
                    </div>

                </div>
                <div style={{display:'flex', flexDirection:'row', position:'absolute', bottom:18, left:60, justifyContent:'space-between', right:30, alignItems:'center'}}>
                    {/* <div style={{fontWeight:'500', fontSize:'0.75rem', color:'#767676', fontFamily:'SFMono'}}>DREP-1</div> */}
                    <div style={{fontWeight:'500', fontSize:'0.563rem', color:'black', fontFamily:'SFMono'}}>PROOF OF CONTRIBUTION</div>
                </div>
        </div>
    )
}

export default POCPBadge
import React from 'react'
import styles from './style.module.css'
// import Hexagon from 'react-hexagon'
import pocp_bg from '../../assets/POCP_background.svg'

const BadgeItem = ({name}) => {
    return(
        <div style={{padding:'20px', border:'0.5px solid gray', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div className={styles.container}>
                <div style={{width:'3.75rem', height:'3.8rem', position:'absolute', right:'0.4rem', top:'1rem', background:'black',backgroundRepeat: 'no-repeat',backgroundPosition: 'center',backgroundSize: 'cover', backgroundImage: `url("https://s3uploader-s3uploadbucket-q66lac569ais.s3.amazonaws.com/1694805252.jpg")` }}>
                <div style={{height:0, width:0, borderBottom:'16px solid black',borderRight:'16px solid transparent', bottom:0, position:'absolute'}}/>
                <div style={{height:0, width:0, borderBottom:'20px solid transparent',borderRight:'20px solid black', top:0, position:'absolute', right:0}}/>
                </div>
            <img alt='pocp_bg' src={pocp_bg} style={{position:'absolute', width:'100%', height:'17.5rem',top:0, right:0}} />
            <div style={{fontSize:'0.625rem',  color:'white', fontFamily:'SFMono',left:0, position:'absolute', top:'1rem'}}>25 Apr 2021</div>

            {/* <div style={{width:'70%',position:'absolute', background:'red'}}>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'2.5rem', fontWeight:'400', lineHeight:'1.688rem', color:'#F5A60B', textAlign:'start'}}>Superteam DAO</div>
                <div style={{fontSize:'1.513rem', fontFamily:'TelegrafMedium',left:18, position:'absolute', top:'4.125rem', fontWeight:'400', lineHeight:'1.688rem', color:'black', textAlign:'start'}}>Superteam LP Video Tutorial</div>
            </div> */}

            
                {/* <div style={{display:'flex', flexDirection:'row', position:'absolute', top:'8.125rem', left:18}}>

                    <div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono', textAlign:'start'}}>To</div>
                        <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>From</div>
                    </div>

                    <div>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>aviralsb.eth</div>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'black', fontFamily:'SFMono'}}>somcha.eth</div>
                    </div>

                </div>
                <div style={{display:'flex', flexDirection:'row', position:'absolute', bottom:18, left:60, justifyContent:'space-between', right:30, alignItems:'center'}}>
                    <div style={{fontWeight:'500', fontSize:'0.75rem', color:'#767676', fontFamily:'SFMono'}}>DREP-1</div>
                    <div style={{fontWeight:'500', fontSize:'0.563rem', color:'black', fontFamily:'SFMono'}}>PROOF OF CONTRIBUTION</div>
                </div> */}
        </div>
        </div>
    )
}

export default BadgeItem
import { ethers } from 'ethers';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import textStyles from '../../../commonStyles/textType/styles.module.css';
import { web3 } from '../../../constant/web3';
import { getAuthToken } from '../../../store/actions/auth-action';
import { registerDaoToPocp } from '../../../utils/POCPutils';
import { relayFunction, updatePocpRegister } from '../../../utils/relayFunctions';
import styles from './style.module.css'

const RegisterPOCPBanner = () => {

    const currentDao = useSelector(x=>x.dao.currentDao)
    const address = useSelector(x=>x.auth.address)
    const jwt = useSelector(x=>x.auth.jwt)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(currentDao)

    const registerDaoToPocp = async() => {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          try {
            await web3Provider.provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.chainid.polygon}],})
              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner()
              const {data, signature} = await registerDaoToPocp(signer,currentDao?.name,currentDao?.owners, address)
              const token = await dispatch(getAuthToken())
              const tx_hash = await relayFunction(token,0,data,signature)
              await updatePocpRegister(jwt, tx_hash, currentDao?.uuid)
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
                await provider.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: web3.chainid.rinkeby}],
                })
                navigate(`/dashboard`)
                }
                //console.log('again....')
              },2000)
            }else{
              //console.log('error in fetching tx hash....')
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
    
    return(
        <div onClick={async()=>await registerDaoToPocp()} className={styles.container}>
            <div style={{color:'white', textAlign:'start'}} className={textStyles.ub_16}>Register to POCP</div> 
                {/* <div style={{color:'#FFC664', textAlign:'start'}} className={textStyles.m_16}>Execute it first to execute pending payments.<a href={`https://gnosis-safe.io/app/rin:${currentDao?.safe_public_address}/balances`} style={{textDecoration:'underline',color:'#FFC664'}}> Go to Gnosis</a></div> */}
        </div>
    )
}

export default RegisterPOCPBanner
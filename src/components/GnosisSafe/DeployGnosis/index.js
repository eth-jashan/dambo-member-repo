import { Button, notification, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from "ethers";
import { useSelector } from 'react-redux';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { EthSignSignature } from './EthSignSignature';
import { useSafeSdk,useBalance, usePoller, useUserSigner } from '../../../hooks';
// import AuthButton from '../AuthButton';

const serviceClient = new SafeServiceClient('https://safe-transaction.rinkeby.gnosis.io')

const DeployGnosisButton = () => {

    const [ deploying, setDeploying ] = useState()
    const [ value, setValue ] = useState('1')
    const [safeAddress, setSafeAddress] = useState('0x1074BdD199c849F450df15D39396880D81bea7f9')
    const [owners, setOwners] = useState([])
    const [threshold, setThreshold] = useState(2)
    const [transaction, setTransactions] = useState([])
    // const provider = useSelector(x=>x.auth.web3Provider);
    // const userSigner = useUserSigner(provider, null);
    const [signer, setSigner] = useState()
    const { safeSdk, safeFactory } = useSafeSdk(signer, safeAddress)
    const address = useSelector(x=>x.auth.address);
    const [data, setData] = useState('0x00')
    // demo wallet 0xFA0fa7B48A120f52a6a92D35F8fC0095B1B6C096
    const selectedProvider = useSelector(x=>x.auth.web3Provider);
    const safeBalance = useBalance(selectedProvider, safeAddress);
    const isSafeOwnerConnected = owners.includes('0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377')
    const isTransactionExecutable = (transaction) => transaction.confirmations.length >= threshold
    const isTransactionSignedByAddress = (transaction) => {
      const confirmation = transaction.confirmations.find(confirmation => confirmation.owner === '0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377')
      return !!confirmation
    }
    const OWNERS = [
        "0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8",
        "0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377"
      ]
    const THRESHOLD = 2

    const setProvider = async() => {
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer)
    }

    useEffect(()=>{
      setProvider()
    },[])

    const proposeSafeTransaction = useCallback(async (transaction) => {
      console.log('transaction proposinggg 2......',safeSdk)
      if (!safeSdk || !serviceClient) return
      let safeTransaction
        try {
          console.log("Transaction.....",transaction)
          safeTransaction = await safeSdk.createTransaction(transaction)
          console.log('transaction created......', safeTransaction)
        } catch (error) {
          console.error(error)
          return
        }
      console.log('SAFE TX', safeTransaction.data)
      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
      console.log('HASH', safeTxHash)
      const safeSignature = await safeSdk.signTransactionHash(safeTxHash)
      console.log('Safe Sign', safeSignature)
      try {
       const res =  await serviceClient.proposeTransaction(
        safeAddress,
        safeTransaction.data,
        safeTxHash,
        safeSignature
      )
      console.log('transaction proposed==========>', res)
      } catch (error) {
        console.log('error', error)
      }
    }, [safeSdk, safeAddress])

    console.log('transaction==========>',address, transaction)

    const signTransaction = async () => {
      // if (selector !== '' && params.length > 0) {
      //   const abi = [
      //     "function " + selector
      //   ];
      //   const index = selector.indexOf('(');
      //   const fragment = selector.substring(0, index)

      //   const iface = new ethers.utils.Interface(abi);
      //   for (let i = 0; i < params.length; i++) {
      //     if (iface.fragments[0].inputs[i].baseType.includes('uint') || iface.fragments[0].inputs[i].baseType.includes('int')) {
      //       params[i] = parseInt(params[i])
      //     }
      //   }
      //   const data = iface.encodeFunctionData(fragment, params);
      //   setData(data)
      // }
      // to:
      // 0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377
      // value:
      // 5000000000000000
      // data:
      // 0x
      // operation:
      // 0
      // safeTxGas:
      // 0
      // baseGas:
      // 0
      // gasPrice:
      // 0
      // gasToken:
      // 0x0000000000000000000000000000000000000000
      // refundReceiver:
      // 0x0000000000000000000000000000000000000000
      // nonce:
      // 12
      // const nonce = await safeSdk.getNonce()
      const checksumForm = ethers.utils.getAddress('0xB6aeB5dF6ff618A800536a5EB3a112200ff3C377')
      const partialTx = [{
        to: checksumForm,
        data:'0x',
        value: ethers.utils.parseEther(value?value.toString():"0.001").toString(),
      },
      {
        to: ethers.utils.getAddress('0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8'),
        data:'0x',
        value: ethers.utils.parseEther(value?value.toString():"0.001").toString(),
      }]

      console.log('transaction proposinggg', partialTx)
      try{
        await proposeSafeTransaction(partialTx)
        // console.log('transaction created', 13)
      }catch(e){
        console.log("🛑 Error Proposing Transaction",e)
        notification.open({
          message: "🛑 Error Proposing Transaction",
          description: (
            <>
              {e.toString()} (check console)
            </>
          ),
        });
      }

    }

    const confirmTransaction = useCallback(async (transaction) => {
      if (!safeSdk || !serviceClient) return
      const hash = transaction.safeTxHash
      let signature
      try {
        signature = await safeSdk.signTransactionHash(hash)
      } catch (error) {
        console.error(error)
        return
      }
      await serviceClient.confirmTransaction(hash, signature.data)
    }, [safeSdk])

    const deploySafe = useCallback(async (owners, threshold) => {
        console.log('deployingggg')
        if (!safeFactory) return
        setDeploying(true)
        const safeAccountConfig = { owners, threshold }
        let safe
        console.log('deployingggg')
        try {
          safe = await safeFactory.deploySafe(safeAccountConfig)
        } catch (error) {
          console.error(error)
          setDeploying(false)
          return
        }
        console.log('deployedddd', safe)
        const newSafeAddress = ethers.utils.getAddress(safe.getAddress())
        setSafeAddress(newSafeAddress)
      }, [safeFactory])

      usePoller(async () => {
        if(safeAddress){
          setSafeAddress(ethers.utils.getAddress(safeAddress))
          try{
            if(safeSdk){
              const nonce = await safeSdk.getNonce()
              console.log('current nonce=====>',nonce)
              const owners = await safeSdk.getOwners()
              const threshold = await safeSdk.getThreshold()
              setOwners(owners)
              setThreshold(threshold)
              console.log("owners",owners,"threshold",threshold)
            }
            console.log("CHECKING TRANSACTIONS....",safeAddress)
            const transactions = await serviceClient.getPendingTransactions(safeAddress)
            console.log("Pending transactions:", transactions)
            setTransactions(transactions.results)
          }catch(e){
            console.log("ERROR POLLING FROM SAFE:",e)
          }
        }
      },3333);

      const executeSafeTransaction = useCallback(async (transaction) => {
        console.log('started transaction.......', transaction, safeSdk)
  
        if (!safeSdk) return
        console.log( transaction)
        const safeTransactionData = {
          to: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
          safeTxHash: '0xe1190d731bf83d0ac22dd1dd47246b6df66e954eb85f18a324377476783025b8',
          value: transaction.value,
          data: transaction.data || '0x',
          operation: transaction.operation,
          safeTxGas: '0',
          baseGas: '0',
          gasPrice: '0',
          gasToken: '0x0000000000000000000000000000000000000000',
          refundReceiver: '0x0000000000000000000000000000000000000000',
          nonce: 18
        }
        console.log('started transaction.......')
        const safeTransaction = await safeSdk.createTransaction(safeTransactionData)
        transaction.confirmations.forEach(confirmation => {
          const signature = new EthSignSignature(confirmation.owner, confirmation.signature)
          safeTransaction.addSignature(signature)
        })
        let executeTxResponse
        try {
          executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
          console.log('done transaction.......')
        } catch(error) {
          console.error(error)
          return
        }
        const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
        console.log('Transaction reciept......', receipt)
      }, [safeSdk])

      const renderSigners = () => (
        transaction.map((item)=>(
          (<>
            {!isTransactionSignedByAddress(item)?<Button style={{marginBottom:20}} onClick={async()=>await confirmTransaction(item)} type="primary">Sign Tx</Button>:
            isTransactionExecutable(item)?<Button onClick={()=> executeSafeTransaction(item)} type="primary">Execute Tx {item.value/1000000000000000000}Ethers </Button>:`waitingggg for more signers for ${item.value/1000000000000000000} Ethers`}
            </>
        ))
      ))

      console.log('safe balance', safeBalance?.toString())
      const onTapSignin = async() => {
        alert('connect start ====>', address)
     }
    return(
      <div style={{flexDirection:'column', display:'flex'}}>
        
        {safeAddress?
        <Button style={{marginBottom:20}} onClick={async()=>await signTransaction()} type="primary">Sign Tx</Button>:
        <Button loading={deploying} onClick={async() => await deploySafe(OWNERS, THRESHOLD)} type="primary">Deploy Safe</Button>}
        {safeBalance?<Typography.Text style={{fontFamily:'monospace', fontSize:16}}>{safeBalance?.toString()/1000000000000000000} Ethers</Typography.Text>:null}
        {transaction.length>0&& <Typography.Text>{transaction.length}</Typography.Text>}
        {renderSigners()}
      </div>
    )

}

export default DeployGnosisButton
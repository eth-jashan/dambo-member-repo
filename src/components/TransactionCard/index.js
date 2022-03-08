import { style } from "dom-helpers";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Typography } from "antd";
import { IoAddOutline, GoChevronUp, RiDeleteBin7Fill } from "react-icons/all";
import cross from "../../assets/Icons/cross_white.svg";

import styles from "./style.module.css";
import textStyle  from "../../commonStyles/textType/styles.module.css";
import AmountInput from '../AmountInput';
import { approveContriRequest, rejectContriRequest, setTransaction } from '../../store/actions/transaction-action';
import { getAllDaowithAddress, getContriRequest } from '../../store/actions/dao-action';
import { convertTokentoUsd } from "../../utils/conversion";


const TransactionCard = ({signer}) => {
  const currentTransaction = useSelector(
    (x) => x.transaction.currentTransaction
  );
  const token_available = useSelector(x=>x.dao.balance)
  const address = currentTransaction?.requested_by?.public_address;
  const dispatch = useDispatch();
  const getEmoji = () => {
    if (currentTransaction?.stream === "DESIGN") {
      return "🎨";
    }
  };

  const ETHprice = useSelector(x=>x.transaction.initialETHPrice)
  const [feedBackShow, setFeedBackSow] = useState(false)
  const [payDetail, setPayDetail] = useState([{
        amount:'',
        token_type:null,
        address:currentTransaction?.requested_by?.public_address,
        usd_amount:ETHprice
    }])

  const addToken = async() => {
    
    const usdCoversion = await convertTokentoUsd('ETH')
      if(usdCoversion){
        const newDetail = {
          amount:'',
          token_type:null,
          usd_amount:usdCoversion,
          address:currentTransaction?.requested_by?.public_address
        }
      setPayDetail([...payDetail, newDetail]);
    }
  }

    const updatedPayDetail = async(e, index) => {
        payDetail[index].amount = e.target.value
        setPayDetail(payDetail);
    };

    const updateTokenType = async(value, index) => {
        const usdCoversion = await convertTokentoUsd(value.label)
        if(usdCoversion){
          payDetail[index].token_type = value.value
          payDetail[index].usd_amount = usdCoversion
          setPayDetail(payDetail);
        }
  
    };

    const onContributionPress = () => {
      dispatch(setTransaction(null))
    }
    const onApproveTransaction = async() => {
      dispatch(approveContriRequest(payDetail))
      dispatch(setTransaction(null))
    }

    

    const feedBackContainer = () => (
        <div style={{width:'100%', marginBottom:'5rem'}}>
            <div onClick={()=>setFeedBackSow(!feedBackShow)}  className={styles.feedBackContainer}>
                <div className={`${textStyle.m_16}`}>Add Feedback</div>
                {!feedBackShow?
                <IoAddOutline color='#808080' className={styles.add}/>:
                <GoChevronUp color='white' className={styles.add} />}
            </div>
            {feedBackShow && 
            <Input.TextArea
                placeholder='Write your feedback here'
                className={styles.textArea}
            />
          }
        </div>
    )

    return(
        <div className={styles.container}>
            <img onClick={()=>onContributionPress()} src={cross} alt='cross' className={styles.cross} />
            <span
                className={`${textStyle.ub_23} ${styles.title}`}
            >{`${getEmoji()}`}</span>
            <span ellipsis={{rows:2}} className={`${textStyle.ub_23} ${styles.title}`}>
            {`${currentTransaction?.title}`}
            </span>
            <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${currentTransaction?.requested_by?.metadata?.name} . (${address.slice(0,5)}...${address.slice(-3)})`}</div>
            <div className={`${textStyle.m_16} ${styles.timeInfo}`}>{`${'Design  • '} ${currentTransaction?.time_spent} hrs`}</div>

            <Typography.Paragraph
                className={`${styles.description} ${textStyle.m_16}`}
                ellipsis={
                    {
                        rows: 2,
                        expandable: true,
                        symbol:<Typography.Text className={`${styles.description} ${textStyle.m_16}`}>read more</Typography.Text>,
                    }
                }
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography.Paragraph>

          <div className={styles.amountScroll}>
            {payDetail?.map((item, index) => (
              <AmountInput
                updateTokenType={(x) => updateTokenType(x, index)}
                value={item.amount}
                onChange={(e) => updatedPayDetail(e, index)}
              />
            ))}
          </div>

          <div onClick={token_available.length>1?() => addToken():()=>{}} className={styles.addToken}>
            <div className={`${textStyle.m_16}`}>Add another token</div>
            <IoAddOutline color="#808080" className={styles.add} />
          </div>

      {feedBackContainer()}
      <div style={{width:'20%', height:'5rem', position:'absolute', bottom:0, background:'black', display:'flex', alignSelf:'center', alignItems:'center', justifyContent:'space-between'}}>
        
        <div onClick={async()=> await dispatch(rejectContriRequest(currentTransaction?.id))} className={styles.deletContainer}>
        
        </div>

        <div onClick={() => onApproveTransaction()} className={styles.payNow}>
          <div className={`${textStyle.ub_16}`}>Approve Request</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

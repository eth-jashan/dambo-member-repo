import { style } from "dom-helpers";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Typography } from "antd";
import { IoAddOutline, GoChevronUp, RiDeleteBin7Fill } from "react-icons/all";
import cross from "../../assets/Icons/cross_white.svg";

import styles from "./style.module.css";
import textStyle from "../../commonStyles/textType/styles.module.css";
import AmountInput from "../AmountInput";
import {
  approveContriRequest,
  setTransaction,
} from "../../store/actions/transaction-action";

const TransactionCard = () => {
  const currentTransaction = useSelector(
    (x) => x.transaction.currentTransaction
  );
  const address = "0x3EE2cf04a59FBb967E2b181A60Eb802F36Cf9FC8";
  const dispatch = useDispatch();
  const getEmoji = () => {
    if (currentTransaction?.stream === "DESIGN") {
      return "🎨";
    }
  };

  const [feedBackShow, setFeedBackSow] = useState(false);

  const [payDetail, setPayDetail] = useState([
    {
      amount: "",
      token_type: null,
    },
  ]);

  const addToken = () => {
    const newDetail = {
      amount: "",
      token_type: null,
    };
    setPayDetail([...payDetail, newDetail]);
  };

  const updatedPayDetail = (e, index) => {
    payDetail[index].amount = e.target.value;
    console.log("pay detail", payDetail);
    setPayDetail(payDetail);
  };

  const updateTokenType = (value, index) => {
    payDetail[index].token_type = value.value;
    console.log("pay detail", payDetail);
    setPayDetail(payDetail);
  };

  const onContributionPress = () => {
    dispatch(setTransaction(null));
  };
  const onApproveTransaction = () => {
    dispatch(approveContriRequest(payDetail));
    dispatch(setTransaction(null));
  };

  const feedBackContainer = () => (
    <div style={{ width: "100%" }}>
      <div
        onClick={() => setFeedBackSow(!feedBackShow)}
        className={styles.feedBackContainer}
      >
        <div className={`${textStyle.m_16}`}>Add Feedback</div>
        {!feedBackShow ? (
          <IoAddOutline color="#808080" className={styles.add} />
        ) : (
          <GoChevronUp color="white" className={styles.add} />
        )}
      </div>
      {feedBackShow && (
        <Input.TextArea
          placeholder="Write your feedback here"
          className={styles.textArea}
        />
      )}
    </div>
  );

  return (
    <div className={styles.container}>
      <img
        onClick={() => onContributionPress()}
        src={cross}
        alt="cross"
        className={styles.cross}
      />
      <span
        className={`${textStyle.ub_23} ${styles.title}`}
      >{`${getEmoji()}`}</span>
      <Typography.Paragraph
        className={`${textStyle.ub_23} ${styles.title}`}
        ellipsis={{
          rows: 3,
          expandable: false,
          //symbol:<Typography.Text className={`${styles.description} ${textStyle.m_16}`}>read more</Typography.Text>,
        }}
      >
        {`${currentTransaction?.title}`}
      </Typography.Paragraph>
      <div className={`${textStyle.m_16} ${styles.ownerInfo}`}>{`${
        currentTransaction?.requested_by?.metadata?.name
      } . (${address.slice(0, 5)}...${address.slice(-3)})`}</div>
      <div
        className={`${textStyle.m_16} ${styles.timeInfo}`}
      >{`${"Design  • "} ${currentTransaction?.time_spent} hrs`}</div>

      <Typography.Paragraph
        className={`${styles.description} ${textStyle.m_16}`}
        ellipsis={{
          rows: 2,
          expandable: true,
          symbol: (
            <Typography.Text
              className={`${styles.description} ${textStyle.m_16}`}
            >
              read more
            </Typography.Text>
          ),
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum
        dolor sit amet, consectetur adipiscing elit
      </Typography.Paragraph>

      {/* <div className={styles.feedBackContainer}>
                <div className={`${textStyle.m_16}`}>Add Feedback</div>
            </div> */}

      <div className={styles.amountScroll}>
        {payDetail?.map((item, index) => (
          <AmountInput
            updateTokenType={(x) => updateTokenType(x, index)}
            value={item.amount}
            onChange={(e) => updatedPayDetail(e, index)}
          />
        ))}
      </div>

      <div onClick={() => addToken()} className={styles.addToken}>
        <div className={`${textStyle.m_16}`}>Add another token</div>
        <IoAddOutline color="#808080" className={styles.add} />
      </div>

      {feedBackContainer()}

      {/* </div> */}
      <div
        // onClick={() => onApproveTransaction()}
        className={styles.deleteContainer}
      >
        <div className={styles.deleteButton}><RiDeleteBin7Fill color="white" /></div>
      </div>
      <div onClick={() => onApproveTransaction()} className={styles.payNow}>
        <div className={`${textStyle.ub_16}`}>Approve Request</div>
      </div>
    </div>
  );
};

export default TransactionCard;

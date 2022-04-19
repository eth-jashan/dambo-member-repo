import { message, List } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { getAuthToken, getJwt, signout } from "../../store/actions/auth-action";
import { IoMdAdd, AiOutlineCaretDown } from "react-icons/all";
import {
  createPayout,
  createVoucher,
  getAllDaowithAddress,
  getContributorOverview,
  getContriRequest,
  getDaoHash,
  getNonceForCreation,
  getPayoutRequest,
  gnosisDetailsofDao,
  set_active_nonce,
  set_initial_setup,
  set_payout_filter,
  syncTxDataWithGnosis,
} from "../../store/actions/dao-action";
import DashboardLayout from "../../views/DashboardLayout";
import styles from "./style.module.css";
import textStyles from "../../commonStyles/textType/styles.module.css";
import { links } from "../../constant/links";
import ContributionRequestModal from "../../components/Modal/ContributionRequest";
import { ethers, providers } from "ethers";
import DashboardSearchTab from "../../components/DashboardSearchTab";
import ContributionCard from "../../components/ContributionCard";
import { useSafeSdk } from "../../hooks";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import PaymentCheckoutModal from "../../components/Modal/PaymentCheckoutModal";
import PaymentCard from "../../components/PaymentCard";
import {
  getPendingTransaction,
  resetApprovedRequest,
  setEthPrice,
  setPayment,
  setRejectModal,
  setTransaction,
} from "../../store/actions/transaction-action";
import {
  setLoadingState,
  setPayoutToast,
} from "../../store/actions/toast-action";
import UniversalPaymentModal from "../../components/Modal/UniversalPaymentModal";
import plus_black from "../../assets/Icons/plus_black.svg";
import plus_gray from "../../assets/Icons/plus_gray.svg";
import { convertTokentoUsd } from "../../utils/conversion";
import RejectPayment from "../../components/Modal/RejectPayment";
import GnosisExternalPayment from "../../components/Alert/GnosisExternalPayment/index";
import BadgeItem from "../../components/BadgeItem";
import { getAllBadges } from "../../store/actions/contibutor-action";
import { LinearProgress, Stack } from "@mui/material";
import Web3 from "web3";
import ERC20_ABI from "../../smartContract/erc20.json";

const serviceClient = new SafeServiceClient(
  "https://safe-transaction.rinkeby.gnosis.io/"
);

export default function Dashboard() {
  const [tab, setTab] = useState("contributions");
  const [uniPayHover, setUniPayHover] = useState(false);

  const payout_toast = useSelector((x) => x.toast.payout);
  const initial_setup = useSelector((x) => x.dao.initial_setup);
  const account_mode = useSelector((x) => x.dao.account_mode);
  const account_index = useSelector((x) => x.dao.account_index);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentDao = useSelector((x) => x.dao.currentDao);
  const pocp_dao_info = useSelector((x) => x.dao.pocp_dao_info);
  const community_id = pocp_dao_info.filter(
    (x) => x.txhash === currentDao?.tx_hash
  );
  const address = useSelector((x) => x.auth.address);
  const jwt = useSelector((x) => x.auth.jwt);
  const role = useSelector((x) => x.dao.role);
  const approve_contri = useSelector(
    (x) => x.transaction.approvedContriRequest
  );
  const pending_txs = useSelector((x) => x.transaction.pendingTransaction);

  const [modalContri, setModalContri] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalUniPayment, setModalUniPayment] = useState(false);
  const rejectModal = useSelector((x) => x.transaction.rejectModal);
  const approved_request = useSelector(
    (x) => x.transaction.approvedContriRequest
  );
  const contribution_request = useSelector((x) => x.dao.contribution_request);
  const payout_request = useSelector((x) => x.dao.payout_filter);
  const loadingState = useSelector((x) => x.toast.loading_state);
  //gnosis setup
  const [signer, setSigner] = useState();
  const { safeSdk } = useSafeSdk(signer, currentDao?.safe_public_address);

  useEffect(() => {
    const interval = setInterval(() => {
      if (payout_toast) {
        dispatch(setPayoutToast(false));
      }
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch, payout_toast]);

  const setProvider = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer);
  };

  useEffect(() => {
    setProvider();
  }, []);

  const claimed = useSelector((x) => x.contributor.claimed);
  async function copyTextToClipboard() {
    if ("clipboard" in navigator) {
      message.success("invite link copied succesfully!");
      return await navigator.clipboard.writeText(
        `${window.location.origin}/contributor/invite/${currentDao?.uuid}`
      );
    } else {
      return document.execCommand(
        "copy",
        true,
        `${window.location.origin}/contributor/invite/${currentDao?.uuid}`
      );
    }
  }

  const preventGoingBack = useCallback(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", () => {
      if (address && jwt) {
        console.log("on back!!!");
        window.history.pushState(null, document.title, window.location.href);
      }
    });
  }, [address, jwt]);

  async function onInit() {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    return account;
  }

  const initialLoad = useCallback(async () => {
    dispatch(setLoadingState(true));
    const account = await onInit();
    await dispatch(getDaoHash());
    if (address === ethers.utils.getAddress(account)) {
      const jwtIfo = await dispatch(getJwt(address));
      if (jwtIfo) {
        const account_role = await dispatch(getAllDaowithAddress());
        await dispatch(gnosisDetailsofDao());
        console.log("load", account_role);
        if (account_role === "ADMIN") {
          dispatch(setPayment(null));
          dispatch(setTransaction(null));
          await dispatch(getContriRequest());
          console.log("payout request.....");
          // await dispatch(getPayoutRequest())
          // await dispatch(getPendingTransaction())
          // await dispatch(syncTxDataWithGnosis())
          // console.log('payout request.....ended')
          // get active nonce
          if (safeSdk) {
            const nonce = await safeSdk.getNonce();
            dispatch(set_active_nonce(nonce));
          }
        } else {
          dispatch(setLoadingState(true));
          console.log("fetch when contributor....");
          await dispatch(getContriRequest());
          await dispatch(getContributorOverview());
          await dispatch(getAllBadges(signer, address, community_id[0]?.id));
          dispatch(setLoadingState(false));
        }
      } else {
        dispatch(setLoadingState(false));
        message.info("Token expired");
        navigate("/");
      }
    } else {
      signout();
      dispatch(setLoadingState(false));
    }
    dispatch(setLoadingState(false));
    // }
  }, [address, dispatch, navigate, role, safeSdk, signer]);

  const accountSwitch = useCallback(async () => {
    dispatch(setLoadingState(true));
    await dispatch(getDaoHash());
    const account_role = await dispatch(getAllDaowithAddress());
    if (account_role === "ADMIN") {
      console.log("admin......account changed");
      dispatch(setPayment(null));
      dispatch(setTransaction(null));
      await dispatch(getContriRequest());
      if (tab === "payments") {
        console.log("payout requests......");
        await dispatch(getPayoutRequest());
        await dispatch(getPendingTransaction());
        await dispatch(syncTxDataWithGnosis());
      }
      if (safeSdk) {
        const nonce = await safeSdk.getNonce();
        dispatch(set_active_nonce(nonce));
      }
    } else {
      console.log("fetch when contributor....Contributo");
      await dispatch(getContriRequest());
      await dispatch(getContributorOverview());
      await dispatch(getAllBadges(signer, address, community_id[0]?.id));
    }
    dispatch(setLoadingState(false));
  }, [address, community_id, dispatch, role, safeSdk, signer, tab]);

  useEffect(() => {
    if (!modalPayment) {
      if (role === account_mode && account_index === 0) {
        console.log("loaded for first time......");
        initialLoad();
      } else {
        accountSwitch();
      }
      // else{
      //     console.log('Loaded for account switch')
      //     accountSwitch()
      // }
    }
  }, []);

  useEffect(() => {
    preventGoingBack();
  }, [preventGoingBack]);

  const onRouteChange = async (route) => {
    dispatch(setLoadingState(true));
    await dispatch(getDaoHash());
    setTab(route);
    if (role === "ADMIN") {
      if (safeSdk) {
        const nonce = await safeSdk.getNonce();
        dispatch(set_active_nonce(nonce));
      }
      if (route === "payments") {
        console.log("payment route......");
        await dispatch(getPayoutRequest());
        await dispatch(syncTxDataWithGnosis());
        await dispatch(set_payout_filter("PENDING", 1));
      } else {
        console.log("contribution route......");
        await dispatch(getPayoutRequest());
        await dispatch(syncTxDataWithGnosis());
        await dispatch(getContriRequest());
      }
    } else {
      await dispatch(getContriRequest());
      await dispatch(getAllBadges(signer, address, community_id[0]?.id));
    }
    dispatch(setPayment(null));
    dispatch(setTransaction(null));
    dispatch(setLoadingState(false));
  };

  const onUniModalOpen = async () => {
    const ethPrice = await convertTokentoUsd("ETH");
    if (ethPrice) {
      dispatch(setEthPrice(ethPrice));
      setModalUniPayment(true);
    }
  };

  const renderTab = () => (
    <div className={styles.tabContainer}>
      <div className={styles.routeContainer}>
        <div
          onClick={async () => await onRouteChange("contributions")}
          className={
            tab === "contributions"
              ? `${styles.selected} ${textStyles.ub_23}`
              : `${styles.selectionTab} ${textStyles.ub_23}`
          }
        >
          Contributions
        </div>
        <div
          onClick={async () => await onRouteChange("payments")}
          style={{ marginLeft: "2rem" }}
          className={
            tab === "payments"
              ? `${styles.selected} ${textStyles.ub_23}`
              : `${styles.selectionTab} ${textStyles.ub_23}`
          }
        >
          {role === "ADMIN" ? "Payments" : "Badges"}
        </div>
      </div>
      <div>
        <div
          onMouseEnter={() => setUniPayHover(true)}
          onMouseLeave={() => setUniPayHover(false)}
          style={{ background: modalUniPayment ? "white" : null }}
          onClick={
            role === "ADMIN"
              ? async () => await onUniModalOpen()
              : () => setModalContri(true)
          }
          className={styles.addPaymentContainer}
        >
          <img
            src={uniPayHover || modalUniPayment ? plus_black : plus_gray}
            alt="plus"
          />
        </div>
        {modalUniPayment && (
          <UniversalPaymentModal
            signer={signer}
            onClose={() => setModalUniPayment(false)}
          />
        )}
      </div>
    </div>
  );

  const renderEmptyScreen = () => (
    <div className={styles.emptyDiv}>
      <div className={styles.heading}>No contribution requests</div>
      {role !== "ADMIN" ? (
        <div className={`${styles.heading} ${styles.greyedHeading}`}>
          Initiate a contributrion
          <br /> request to get paid
        </div>
      ) : (
        <div className={`${styles.heading} ${styles.greyedHeading}`}>
          Share link to onboard
          <br /> contributors
        </div>
      )}
      {role === "ADMIN" ? (
        <button onClick={() => copyTextToClipboard()} className={styles.button}>
          <div>Copy Invite Link</div>
        </button>
      ) : (
        <button onClick={() => setModalContri(true)} className={styles.button}>
          <div>Create Contribution Request</div>
        </button>
      )}
    </div>
  );

  const renderLoadingScreen = () => (
    <div className={styles.emptyDiv}>
      <Stack
        sx={{
          width: "50%",
          color: "grey.500",
          display: "flex",
          alignSelf: "center",
        }}
        spacing={2}
      >
        <LinearProgress style={{ background: "#ECFFB8" }} color="inherit" />
      </Stack>
    </div>
  );

  const onPaymentModal = () => {
    setProvider();
    setModalPayment(true);
  };

  const approvedContriRequest = useSelector(
    (x) => x.transaction.approvedContriRequest
  );

  const getTotalAmount = () => {
    const usd_amount_all = [];

    approvedContriRequest.map((item, index) => {
      item.payout.map((x, i) => {
        usd_amount_all.push(x?.usd_amount * parseFloat(x?.amount));
      });
    });

    const amount_total = usd_amount_all.reduce((a, b) => a + b);
    return parseFloat(amount_total).toFixed(2);
  };

  const [paymentLoading, setPaymentLoading] = useState(false);

  const proposeSafeTransaction = async () => {
    setPaymentLoading(true);

    let transaction_obj = [];

    if (approved_request.length > 0) {
      approved_request.map((item, index) => {
        item?.payout?.map((item, index) => {
          if (
            item?.token_type === null ||
            !item?.token_type ||
            item?.token_type?.token?.symbol === "ETH"
          ) {
            transaction_obj.push({
              to: ethers.utils.getAddress(item?.address),
              data: "0x",
              value: ethers.utils.parseEther(`${item.amount}`).toString(),
              operation: 0,
            });
          } else if (item?.token_type?.token?.symbol !== "ETH") {
            var web3Client = new Web3(
              new Web3.providers.HttpProvider(
                "https://rinkeby.infura.io/v3/25f28dcc7e6b4c85b74ddfb3eeda03e5"
              )
            );
            const coin = new web3Client.eth.Contract(
              ERC20_ABI,
              item?.token_type?.tokenAddress || item?.token_type?.token?.address
            );
            const amount = parseFloat(item?.amount) * 1000000000000000000;
            transaction_obj.push({
              to:
                item?.token_type?.tokenAddress ||
                item?.token_type?.token?.address,
              data: coin.methods
                .transfer(
                  ethers.utils.getAddress(item?.address),
                  amount.toString()
                )
                .encodeABI(),
              value: "0",
              operation: 0,
            });
          }
        });
      });
    }

    if (!safeSdk || !serviceClient) return;
    let safeTransaction;
    let nonce;
    try {
      const activeNounce = await safeSdk.getNonce();
      const nextNonce = await getNonceForCreation(
        currentDao?.safe_public_address
      );
      nonce = nextNonce ? nextNonce : activeNounce;
      safeTransaction = await safeSdk.createTransaction(transaction_obj, {
        nonce: nonce,
      });
    } catch (error) {
      console.error("errorrrr", error);
      message.error("Error on creating Transaction");
      return;
    }

    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    let safeSignature;
    try {
      safeSignature = await safeSdk.signTransactionHash(safeTxHash);
    } catch (error) {
      console.log("error on signing...", error.toString());
    }

    try {
      await serviceClient.proposeTransaction(
        currentDao?.safe_public_address,
        safeTransaction.data,
        safeTxHash,
        safeSignature
      );
      dispatch(createPayout(safeTxHash, nonce));
      dispatch(resetApprovedRequest());
      dispatch(
        setPayoutToast("ACCEPTED_CONTRI", {
          item: approved_request?.length,
          value: getTotalAmount(),
        })
      );
      // onClose()
    } catch (error) {
      console.log("error.........", error);
    }
    setPaymentLoading(false);
    // onClose()
  };

  const checkoutButton = () => (
    <div className={styles.payBtnCnt}>
      <div onClick={() => onPaymentModal()} className={styles.payBtnChild}>
        <div className={`${styles.whiteText} ${textStyles.ub_16}`}>
          {approve_contri?.length} Request approved
        </div>
        <AiOutlineCaretDown size={18} color="white" />
      </div>
      <div className={`${styles.payBtnLeft} ${styles.border}`}>
        <div className={`${styles.whiteText} ${textStyles.m_16}`}>
          {getTotalAmount()}$
        </div>

        <div
          onClick={
            !paymentLoading
              ? async () => await proposeSafeTransaction()
              : () => {}
          }
          className={styles.payNow}
        >
          {paymentLoading ? "Signing...." : "Pay Now"}
        </div>
      </div>
    </div>
  );
  const payout_data = useSelector((x) => x.toast.payout_data);
  const payoutToastInfo = () => {
    if (payout_toast === "EXECUTED") {
      return {
        title: `Payment Executed  •  ${payout_data?.value}$`,
        background: "#1D7F60",
      };
    } else if (payout_toast === "SIGNED") {
      return {
        title: `Payment Signed  •  ${payout_data?.value}$`,
        background: "#4D4D4D",
      };
    } else if (payout_toast === "ACCEPTED_CONTRI") {
      return {
        title: `${payout_data?.item} Request approved  •  ${payout_data?.value}$`,
        background: "#4D4D4D",
      };
    } else if (payout_toast === "REJECTED") {
      return { title: `Payment rejected  •  ${600}$`, background: "#4D4D4D" };
    }
  };

  const transactionToast = () => (
    <div
      style={{ background: payoutToastInfo().background }}
      className={styles.toastContainer}
    >
      <div className={styles.toastLeft}>
        <div style={{ color: "white" }} className={textStyles.m_16}>
          {payoutToastInfo().title}
        </div>
      </div>
      <div className={styles.toastRight}>
        <div style={{ color: "white" }} className={textStyles.ub_16}>
          Details
        </div>
      </div>
    </div>
  );

  const renderContribution = () =>
    contribution_request.length > 0 ? (
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <div style={{ width: "100%", marginBottom: "100px" }}>
          {contribution_request.map((item, index) => (
            <ContributionCard item={item} />
          ))}
        </div>
      </div>
    ) : (
      renderEmptyScreen()
    );

  const renderContributorContribution = () =>
    contribution_request.length > 0 ? (
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <div style={{ width: "100%", marginBottom: "100px" }}>
          {contribution_request.map((item, index) => (
            <ContributionCard item={item} />
          ))}
        </div>
      </div>
    ) : (
      renderEmptyScreen()
    );
  const dataSource = useSelector((x) => x.contributor.claimed);
  const renderBadges = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridGap: 0,
        overflowY: "auto",
        marginBottom: "2rem",
      }}
    >
      {dataSource.map((x, i) => (
        <BadgeItem item={x} />
      ))}
    </div>
  );

  const renderPayment = () =>
    payout_request.length > 0 ? (
      <div style={{ width: "100%", height: "100%", overflowY: "auto" }}>
        <div style={{ width: "100%", marginBottom: "100px" }}>
          <GnosisExternalPayment />
          {payout_request.map((item, index) => (
            <PaymentCard gnosis={pending_txs} signer={signer} item={item} />
          ))}
        </div>
      </div>
    ) : (
      renderEmptyScreen()
    );

  const adminScreen = () =>
    tab === "contributions" ? renderContribution() : renderPayment();

  const contributorScreen = () =>
    tab === "contributions" ? renderContributorContribution() : renderBadges();

  return (
    <DashboardLayout signer={signer} route={tab}>
      <div className={styles.dashView}>
        {(modalContri || modalPayment || modalUniPayment) && (
          <div
            style={{
              position: "absolute",
              background: "#7A7A7A",
              opacity: 0.2,
              bottom: 0,
              right: 0,
              top: 0,
              left: 0,
            }}
          />
        )}
        {renderTab()}
        {<DashboardSearchTab route={tab} />}
        {loadingState
          ? renderLoadingScreen()
          : role === "ADMIN"
          ? adminScreen()
          : contributorScreen()}
        {rejectModal && (
          <RejectPayment
            signer={signer}
            onClose={() => dispatch(setRejectModal(false))}
          />
        )}
        {approve_contri.length > 0 &&
          tab === "contributions" &&
          role === "ADMIN" &&
          checkoutButton()}
        {payout_toast && transactionToast()}
        {modalContri && (
          <ContributionRequestModal setVisibility={setModalContri} />
        )}
        {modalPayment && approve_contri.length > 0 && (
          <PaymentCheckoutModal
            signer={signer}
            onClose={() => setModalPayment(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

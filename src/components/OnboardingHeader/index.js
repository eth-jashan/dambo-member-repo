import styles from "./style.module.css";
import WalletPicker from "../../components/WalletPicker";
import { Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";

export default function Header({ children, decreaseStep }) {
  
  const jwt = useSelector(x=>x.auth.jwt)

  return (
    <div
      align='middle'
      justify='center'
      style={{
        width: "100%",
      }}
    >
      <div style={{
          width: "74vw",
          display:'flex',
          flexDirection:'row',
          padding: "16px",
          justifyContent: "space-between",
          alignItems: "center",
      }}>
          <Typography.Text
            style={{
              fontFamily: "TelegrafBold",
              marginLeft: "12px",
              color: "white",
              alignSelf: "center",
              fontSize: "16px",
            }}
          >
            Drepute
          </Typography.Text>
        
      
      {jwt&&<div style={{width:'24%'}}>
        <WalletPicker />
      </div>}
      </div>
    </div>
  );
}

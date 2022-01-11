import styles from "./style.module.css";
import WalletPicker from "../../components/WalletPicker";
import { Row, Col, Typography } from "antd";

export default function Header({ children, decreaseStep }) {
  return (
    <Row
      style={{
        width: "100%",
        border: "1px solid #21212B",
        padding: "16px",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Col>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          &#128526;{" "}
          <Typography.Text
            style={{
              fontFamily: "monospace",
              marginLeft: "12px",
              color: "white",
              alignSelf: "center",
              fontSize: "16px",
              fontWeight: '600'
            }}
          >
            Drepute
          </Typography.Text>
        </div>
      </Col>
      <Col style={{ width: "20%", alignSelf: "center" }}>
        <WalletPicker />
      </Col>
    </Row>
  );
}

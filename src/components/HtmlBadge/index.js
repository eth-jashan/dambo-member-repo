import React from "react"
import pocp_bg from "../../assets/POCP_background.svg"

const HtmlBadge = () => {
    return (
        <div
            style={{
                width: "700px",
                height: "700px",
                background: "black",
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    height: "540px",
                    background: "black",
                    alignSelf: "center",
                    width: "615px",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        width: "129px",
                        height: "134px",
                        position: "absolute",
                        right: "1rem",
                        top: "0rem",
                        background: "black",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundImage: `url("https://s3uploader-s3uploadbucket-q66lac569ais.s3.amazonaws.com/1694805252.jpg")`,
                    }}
                >
                    <div
                        style={{
                            height: 0,
                            width: 0,
                            borderBottom: "30px solid black",
                            borderRight: "30px solid transparent",
                            bottom: 0,
                            position: "absolute",
                        }}
                    />
                    <div
                        style={{
                            height: 0,
                            width: 0,
                            borderBottom: "36px solid transparent",
                            borderRight: "36px solid black",
                            top: 0,
                            position: "absolute",
                            right: 0,
                        }}
                    />
                </div>
                <img
                    alt="pocp_bg"
                    src={
                        "https://firebasestorage.googleapis.com/v0/b/eveels-c43bb.appspot.com/o/POCP_background.svg?alt=media&token=629aa0c3-e949-4117-bdf1-4b3c0b53a756"
                    }
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        top: 0,
                        right: 0,
                    }}
                />
                <div
                    style={{
                        fontSize: "18px",
                        color: "white",
                        fontFamily: "SFMono",
                        left: 0,
                        position: "absolute",
                        top: "0.3rem",
                    }}
                >
                    25 Apr 2021
                </div>

                <div
                    style={{
                        width: "70%",
                        position: "absolute",
                        background: "red",
                    }}
                >
                    <div
                        style={{
                            fontSize: "52px",
                            fontFamily: "TelegrafMedium",
                            left: 30,
                            position: "absolute",
                            top: "76px",
                            fontWeight: "400",
                            lineHeight: "52px",
                            color: "#F5A60B",
                            textAlign: "start",
                        }}
                    >
                        Superteam DAO
                    </div>
                    <div
                        style={{
                            fontSize: "52px",
                            fontFamily: "TelegrafMedium",
                            left: 30,
                            position: "absolute",
                            top: "128px",
                            fontWeight: "400",
                            lineHeight: "52px",
                            color: "black",
                            textAlign: "start",
                        }}
                    >
                        Superteam LP Video Tutorial
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        position: "absolute",
                        top: "256px",
                        left: 30,
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontWeight: "500",
                                fontSize: "24px",
                                color: "black",
                                fontFamily: "SFMono",
                                textAlign: "start",
                            }}
                        >
                            To
                        </div>
                        <div
                            style={{
                                fontWeight: "500",
                                fontSize: "24px",
                                color: "black",
                                fontFamily: "SFMono",
                            }}
                        >
                            From
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                fontWeight: "500",
                                fontSize: "24px",
                                color: "black",
                                fontFamily: "SFMono",
                            }}
                        >
                            aviralsb.eth
                        </div>
                        <div
                            style={{
                                fontWeight: "500",
                                fontSize: "24px",
                                color: "black",
                                fontFamily: "SFMono",
                            }}
                        >
                            somcha.eth
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        position: "absolute",
                        bottom: 18,
                        left: 160,
                        justifyContent: "space-between",
                        right: 56,
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            fontWeight: "500",
                            fontSize: "18px",
                            color: "#767676",
                            fontFamily: "SFMono",
                        }}
                    >
                        DREP-1
                    </div>
                    <div
                        style={{
                            fontWeight: "500",
                            fontSize: "18px",
                            color: "black",
                            fontFamily: "SFMono",
                        }}
                    >
                        PROOF OF CONTRIBUTION
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HtmlBadge

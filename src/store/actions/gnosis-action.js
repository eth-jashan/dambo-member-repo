import routes from "../../constant/routes"
import { gnosisAction } from "../reducers/gnosis-slice"
// import axios from "axios";
import apiClient from "../../utils/api_client"

export const getAddressMembership = (chainId) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getDaoMembership}`,
                // `https://2eac-106-51-36-15.ngrok.io/dao_tool_server${routes.dao.getDaoMembership}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            console.log("member detail", res)
            const dao_details = []

            res.data.data.forEach((x) => {
                if (x.dao_details.chain_id === chainId) {
                    dao_details.push(x)
                }
            })

            if (dao_details.length > 0) {
                dispatch(
                    gnosisAction.set_membershipList({
                        list: res.data.data,
                        safeAddress:
                            res.data.data[0].dao_details.safe_public_address,
                        dao: res.data.data[0],
                    })
                )
                return res.data.data[0]
            } else {
                return 0
            }
        } catch (error) {
            return 0
        }
    }
}

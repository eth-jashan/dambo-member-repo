import api from "../../constant/api"
import routes from "../../constant/routes"
import { gnosisAction } from "../reducers/gnosis-slice"
// import axios from "axios";
import apiClient from "../../utils/api_client"
import { getSafeServiceUrl } from "../../utils/multiGnosisUrl"

export const getAddressMembership = (chainId) => {
    return async (dispatch, getState) => {
        const jwt = getState().auth.jwt

        try {
            const res = await apiClient.get(
                `${process.env.REACT_APP_DAO_TOOL_URL}${routes.dao.getDaoMembership}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            )
            console.log(chainId, res.data.data)
            let dao_details = []

            res.data.data.forEach((x, i) => {
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

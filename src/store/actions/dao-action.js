import axios from "axios"
import api from "../../constant/api"
import routes from "../../constant/routes"
import { daoAction } from "../reducers/dao-actions"
import { gnosisAction } from "../reducers/gnosis-slice"

export const getAllDaowithAddress = () => {
    return async (dispatch, getState) => {
      const jwt = getState().auth.jwt
      try {
        const res = await axios.get(`${api.drepute.dev.BASE_URL}${routes.dao.getDaoMembership}`,{
          headers:{
            Authorization:`Bearer ${jwt}`
          }
        })
        if(res.data.data.length>0){
            dispatch(daoAction.set_dao_list({
              list:res.data.data,
            }))
        }else{
          return 0
        }
      } catch (error) {
        return 0
      }
    }
}
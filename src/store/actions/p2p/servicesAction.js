import { GET_SERVICE, SERVICE_ERROR } from '../../types/p2pTypes'
import { joydaApiInstance } from '../../../utils/api/joydaApiAxios'

export const getServices = (catId) => async dispatch => {
    try{
        const params = {
            "category_id": catId,
            "is_new": true
        }
        const res = await joydaApiInstance.post(`supplier/services`, params)
        if(res.data.success === true) {
            dispatch( {
                type: GET_SERVICE,
                payload: res.data
            })
        } else {
            dispatch( {
                type: SERVICE_ERROR,
                payload: res.data.error
            })
        }
    }
    catch(error){
        dispatch( {
            type: SERVICE_ERROR,
            payload: error,
        })
    }
}
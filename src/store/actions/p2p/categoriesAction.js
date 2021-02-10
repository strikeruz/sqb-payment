import { GET_CATEGORIES, CATEGOIRES_ERROR } from '../../types/p2pTypes'
import { joydaApiInstance } from '../../../utils/api/joydaApiAxios'

export const getCategories = () => async dispatch => {
    try{
        const res = await joydaApiInstance.get(`supplier/categories`)
        if(res.data.success === true) {
            dispatch( {
                type: GET_CATEGORIES,
                payload: res.data
            })
        } else {
            dispatch( {
                type: CATEGOIRES_ERROR,
                payload: res.data.error,
            })
        }
    }
    catch(error){
        dispatch( {
            type: CATEGOIRES_ERROR,
            payload: error,
        })
    }
}
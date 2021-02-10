  
import { GET_CATEGORIES, CATEGOIRES_ERROR } from '../../types/p2pTypes'

const initialState = {
    categories:[],
    loading:true
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_CATEGORIES:
        return {
            ...state,
            categories:action.payload,
            loading:false
        }
        case CATEGOIRES_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}
  
import { GET_SERVICE, SERVICE_ERROR } from '../../types/p2pTypes'

const initialState = {
    services:[],
    loading:true
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_SERVICE:
        return {
            ...state,
            services:action.payload,
            loading:false
        }
        case SERVICE_ERROR:
            return{
                loading: false, 
                error: action.payload 
            }
        default: return state
    }
}
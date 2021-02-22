import { SET_FORMDATA, SET_PREPAYMENT_DATA, SEND_PREPAYMENT_REQUEST, PREPAYMENT_REQUEST_ERROR, SEND_SMS_CONFIRMATION, CONFIRM_SMS_CODE, CLEAR_PREPAYMENT_DATA } from '../../types/p2pTypes'

const initialState = {
    data:{},
    prePaymentData: {},
    prePaymentResult: [],
    error: null
}

export default function(state = initialState, action) {
    switch(action.type){
        case SET_FORMDATA:
        return {
            ...state,
            data: action.payload,
            error: null
        }
        case SET_PREPAYMENT_DATA:
        return {
            ...state,
            prePaymentData: action.payload,
            error: null
        }
        case SEND_PREPAYMENT_REQUEST:
        return {
            ...state,
            prePaymentResult: action.payload,
            error: null
        }
        case CLEAR_PREPAYMENT_DATA:
        return initialState
        case PREPAYMENT_REQUEST_ERROR:
        return {
            ...state,
            error: action.payload
        }
        case SEND_SMS_CONFIRMATION:
        return {
            ...state,
            prePaymentData: [...state.prePaymentData, {code: action.payload}],
            error: null
        }
        case CONFIRM_SMS_CODE:
        return {
            ...state,
            error: null
        }

        default: return state
    }
}
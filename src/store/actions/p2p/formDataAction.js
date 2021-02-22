import {
	SET_FORMDATA,
	SET_PREPAYMENT_DATA,
	SEND_PREPAYMENT_REQUEST,
	PREPAYMENT_REQUEST_ERROR,
	SEND_SMS_CONFIRMATION,
	CLEAR_PREPAYMENT_DATA,
	CONFIRM_SMS_CODE
} from '../../types/p2pTypes';
import { joydaApiInstance } from '@/utils/api/joydaApiAxios';
import { toast } from "react-toastify";

export const setFormData = (payload) => (dispatch) => {
	dispatch({
		type: SET_FORMDATA,
		payload: payload
	});
};

export const setPrepaymentData = (payload) => (dispatch) => {
	dispatch({
		type: SET_PREPAYMENT_DATA,
		payload: payload
	});
};

export const sendPrePaymentRequest = (params, push, url) => async (dispatch) => {
	try {
		const res = await joydaApiInstance.post(`supplier/prepayment`, params);
		if (res.data.success === true) {
			dispatch({
				type: SEND_PREPAYMENT_REQUEST,
				payload: res.data
			});
			push(`${url}/prepayment`);

		} else {
			dispatch({
				type: PREPAYMENT_REQUEST_ERROR,
				payload: res.data.error
			});
            toast.error(res.data.error.message);
		}
	} catch (error) {
		dispatch({
			type: PREPAYMENT_REQUEST_ERROR,
			payload: error
		});
	}
};


export const clearFormData = () => (dispatch) => {
	dispatch({
		type: CLEAR_PREPAYMENT_DATA,
		payload: {}
	});
}
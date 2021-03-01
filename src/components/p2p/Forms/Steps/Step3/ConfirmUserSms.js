import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { joydaApiInstance } from '@/utils/api/joydaApiAxios';
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import PrevButton from '../../../PrevButton';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const ConfirmUserSms = () => {
	const { t } = useTranslation()

	const [succesPay, setSuccessPay] = useState(false)
	const [apiError, setApiError] = useState(false)
	const [smsMessage, setSmsMessage] = useState('')
	const [isLoading, setLoading] = useState(false)

	const { state: { sysinfo_sid } } = useLocation()
	
	const timerVal = 60
	const [timer, setTimer] = useState(timerVal)

	const prePaymentData = useSelector(state => state.formState.prePaymentData)
	const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' })

	const decreaseNum = () => setTimer((prev) => prev > 0 ? prev - 1 : 0)
	let intervalRef = useRef()
	useEffect(() => {
		intervalRef.current = setInterval(decreaseNum, 1000)
		return () => clearInterval(intervalRef.current)
	}, [])
	
	const requestForSmsCode = useCallback(async () => {
		setLoading(true)
		setTimer(timerVal)

		const params = {...prePaymentData, sysinfo_sid, code: ''}
		const res = await joydaApiInstance.post(`supplier/payment`, params);
		const { data } = res
		if(data.success === false && data.error.code === 0) {
			setApiError(false)
			setSmsMessage(data.error.message)
		}
		else if (data.success === true && data.data.status === 'pending') {
			setApiError(false)
			setSmsMessage(data.data.message)
		} else {
			setApiError(true)
			const { message } = data.error
			toast.error(message)
		}
		setLoading(false)
	}, [])

	useEffect(async () => {
		requestForSmsCode()
	}, [])


	const onSubmit = async (fields) => {
		setLoading(true)
		const { code } = fields
		const res = await joydaApiInstance.post(`supplier/payment`, {...prePaymentData, sysinfo_sid, code: code.replace(' ', '')})
		const { data } = res
		if(data.success === true) {
			setSuccessPay(true)
			toast.success(t('payment.success_pay_msg'));
		} else {
			const { message } = data.error
			toast.error(message)
		}
		setLoading(false)
	}

	const reSendSms = () => {
		setTimer(timerVal)
		requestForSmsCode()
	}

	const isTimerEnd = timer <= 0
	const smsInput = `form-control kod-podverjdeniya--btn${errors.code ? ' invalid' : ``}`
	return (
		<>
			{
				!apiError && !succesPay &&
				<div>
					<PrevButton className="inline-list--second__item--popup-back" />
					<h4>SMS</h4>
					<p className="custom-p" style={{textAlign: 'center', lineHeight: 1.7}}>
						{ smsMessage }
					</p>
					<div className="timer">0:{ timer }</div>
					<form className="inline-list--second__item--popup--form" onSubmit={handleSubmit(onSubmit)}>
						<div className="inline-list--second__item--popup--item">
							<InputMask
							type="text"
							className={smsInput}
							name="code"
							mask="999 999"
							inputRef={
								register({
									required: true,
									validate: value => /\d{3}\s\d{3}/g.test(value)
								})
							}
							/>
						</div>
						{
							isTimerEnd &&
							<div className="extra-text" onClick={reSendSms}>{ t('payment.resend_sms') }</div>
						}
						<div className="inline-list--second__item--popup--item">
							<button className="inline-list-btn" type="submit" disabled={isTimerEnd}>{isTimerEnd ? t('payment.continue') : t('payment.pay') }</button>
						</div>
					</form>
					{ isLoading && <div className="loadingloader"></div> }
				</div>
			}
			{
				succesPay &&
				<div className="third-step inline-list--second__item--popup-wrap">
					<h4>{ t('payment.success_pay_msg') }</h4>
				</div>
			}
		</>
	)
}

export default ConfirmUserSms
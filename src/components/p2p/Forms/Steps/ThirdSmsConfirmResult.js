import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { joydaApiInstance } from '../../../../utils/api/joydaApiAxios';
import InputMask from "react-input-mask";
import { toast } from "react-toastify";
import PrevButton from '../../PrevButton';
import { useTranslation } from 'react-i18next';

const ThirdSmsConfirmResult = () => {
    const { t } = useTranslation()

    const [succesPay, setSuccessPay] = useState(false)
    const [apiError, setApiError] = useState(false)
    const [smsMessage, setSmsMessage] = useState('')
    const timerVal = 60
    const [timer, setTimer] = useState(timerVal);

    let intervalRef = useRef();
    const decreaseNum = () => setTimer((prev) => prev > 0 ? prev - 1 : 0);
    useEffect(() => {
        intervalRef.current = setInterval(decreaseNum, 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const prePaymentData = useSelector(state => state.formState.prePaymentData)
    const { register, handleSubmit, errors } = useForm({ mode: 'onBlur' })

    const requestForSmsCode = useCallback(async () => {
        setTimer(timerVal)

        const params = {...prePaymentData, code: ''}
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
            toast.error(message);
        }
    }, [])

    useEffect(async () => {
        requestForSmsCode()
	}, [])


    const onSubmit = async (fields) => {
        const { code } = fields
        const res = await joydaApiInstance.post(`supplier/payment`, {...prePaymentData, code: code.replace(' ', '')});
        const { data } = res
        if(data.success === true) {
            setSuccessPay(true)
            toast.success(message);
        } else {
            const { message } = data.error
            toast.error(message);
        }
    }

    const reSendSms = () => {
        setTimer(timerVal)
        requestForSmsCode()
    }


    const smsCodeClass = `form-control kod-podverjdeniya--btn${errors.code ? ' invalid' : ``}`;
    return (
        <>
            {
                !apiError &&
                <div className="third-step inline-list--second__item--popup-wrap">
                    <PrevButton className="inline-list--second__item--popup-back" />
                    <h4>SMS</h4>
                    <p className="custom-p" style={{textAlign: 'center', lineHeight: 1.7}}>
                        { smsMessage }
                    </p>
                    <div className="timer">0:{ timer }</div>
                    <form className="inline-list--second__item--popup--form vkl-aside" onSubmit={handleSubmit(onSubmit)}>
                        <div className="inline-list--second__item--popup--item">
                            <InputMask
                            type="text"
                            className={smsCodeClass}
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
                            timer <= 0 &&
                            <div className="extra-text" onClick={reSendSms}>{ t('payment.resend_sms') }</div>
                        }
                        <div className="inline-list--second__item--popup--item">
                            <button className="inline-list-btn" type="submit" disabled={timer <= 0}>{ t('payment.pay') }</button>
                        </div>
                    </form>
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

export default ThirdSmsConfirmResult
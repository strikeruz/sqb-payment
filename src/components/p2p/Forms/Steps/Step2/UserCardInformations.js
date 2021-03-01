import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import PrevButton from '../../../PrevButton';
import { FormButtonItem } from '../../FormElements';
import { useTranslation } from 'react-i18next';

const UserCardInformations = () => {
    const { t } = useTranslation()
    const [sysinfo_sid, setSysInfo] = useState('');
	const prePaymentData = useSelector((state) => state.formState)
    const currentService = useSelector((state) => state.services.currentService)
	const { loading, error, prePaymentResult } = prePaymentData
    const history = useHistory()
    const { url } = useRouteMatch()

    useEffect(() => {
        setSysInfo(prePaymentResult.data.sysinfo_sid)
    }, [prePaymentResult])

    const goToNextStep = () => {
        history.push({
            pathname: `${url}/smsconfirm`,
            state: {sysinfo_sid}
        })
    }

	return (
		<>
			{loading
				? 'Loading...'
				: error
				? error.message
				:
                <div>
                    <PrevButton className="inline-list--second__item--popup-back" />
                    <h4>{ t('payment.check_for_payment') }</h4>
                    <div className="inline-list--second__item--popup-img">
                        <img src={currentService.logo} alt="" />
                    </div>
                    <h4>{ currentService.title }</h4>
                    <ul className="inline-list--info row">
                        {
                            Object.entries(prePaymentResult.data.additional).map((data) => (
                                <li className="col-12" key={data[0]}>
                                    <span>{data[0]}</span><strong>{data[1]}</strong>
                                </li>
                            ))
                        }
                    </ul>
                    <FormButtonItem label={ t('payment.continue') } className='inline-list-btn' onClick={goToNextStep} />
                </div>
            }
		</>
	);
}

export default UserCardInformations
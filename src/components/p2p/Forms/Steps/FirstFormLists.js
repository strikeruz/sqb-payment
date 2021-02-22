import React, { useState, useCallback } from 'react';
import { FormInputItem, FormButtonItem } from '../FormElements';
import FormWrapper from '../FormWrapper';

import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { FormNestedSelects, FormCardInput, FormPhoneInput } from './../FormElements'
import { setFormData, setPrepaymentData,	sendPrePaymentRequest } from '@/store/actions/p2p/formDataAction';
import useFormFields from '@/hooks/useFormFields';

import { useTranslation } from 'react-i18next';

const FirstFormLists = () => {
	// Translate
	const { t } = useTranslation();

	// Router params
	const { id } = useParams()
	const { push } = useHistory()
	const { url } = useRouteMatch();

	// Actions | States
	const dispatch = useDispatch()
	const services = useSelector((state) => state.services.services)
	const formDefaultData = useSelector((state) => state.formState.data)
	const prePaymentData = useSelector((state) => state.formState.prePaymentData)

	const currentService = services.data.filter((service) => service.id == id)[0]
	const { min_amount, max_amount, title } = currentService || null
	const formFields = useFormFields(currentService.list)

	// Form Data | Validations | Errors
	const { register, handleSubmit, errors, control } = useForm({ mode: 'onBlur' })
	const [formInputs, setFormInputs] = useState(prePaymentData.fields || [])

	// Add Field to request params
	const onChangeFormInput = useCallback(
		(key, val, id) => {
			setFormInputs((prevState) => [
				...prevState.filter((e) => e.id !== id),
				{ id, [key]: val }
			]);
		},
		[setFormInputs]
	);

	// Submit Data
	const onSubmit = (fields) => {
		const filteredData = Object.keys(fields).reduce(
			(attrs, key) => ({
				...attrs,
				[key]: fields[key].replace(/\s|\//g, '')
			}),
			{}
		);

		const { sender, sender_expire, amount } = filteredData;
		const reqDataObj = {
			sender,
			sender_expire:
				sender_expire.split('').slice(2).join('') +
				sender_expire.split('').slice(0, 2).join(''),
			amount: +amount * 100,
			fields: formInputs,
			supplier_id: currentService.id,
			supplier_menu_id: currentService.list[0].id
		};

		// Save Form Data
		dispatch(setFormData(fields));
		// Save pre Payment Data
		dispatch(setPrepaymentData(reqDataObj));
		// Request
		dispatch(sendPrePaymentRequest(reqDataObj, push, url));
	};
	return (
		<>
			<FormWrapper
				title={title}
				className='inline-list--second__item--popup--form vkl-aside'
				onSubmit={handleSubmit(onSubmit)}>
				{formFields.map((form) => {
					if (form.format == 'nested_data') {
						return (
							<FormNestedSelects
								key={form.id}
								label={t('payment.region')}
								name={form.type}
								title={form.title}
								data={form.nested_data}
								register={register}
								errors={errors}
								defaultValues={formDefaultData[form.type]}
								onChange={(e) =>
									onChangeFormInput('val', e.target.value, form.id)
								}
							/>
						);
					}
					if (form.format === 'string' || form.format === 'number') {
						return (
							<Controller
								as={<FormInputItem />}
								control={control}
								key={form.id}
								label={form.title}
								type='text'
								name={form.type}
								placeholder={form.title}
								className='form-control'
								register={register}
								error={errors[form.type]}
								format={form.format}
								defaultValue={formDefaultData[form.type]}
								onChange={(e) =>
									onChangeFormInput('val', e.target.value, form.id)
								}
							/>
						);
					}
					if (form.format === 'phone') {
						return (
							<FormPhoneInput
								key={form.id}
								formFields={formFields}
								onChange={onChangeFormInput}
								register={register}
								className='form-control'
								error={errors[form.format]}
								label={form.title}
								defaultValue={formDefaultData['phone']}
								onChangeFormInput={onChangeFormInput}
							/>
						);
					}
				})}

				<FormCardInput
					label={t('payment.your_card_number')}
					register={register}
					defaultValue={formDefaultData}
					senderError={errors.sender}
					expireError={errors.sender_expire}
				/>
				<FormInputItem
					label={t('payment.payment_amount')}
					type='text'
					name='amount'
					placeholder={t('payment.payment_amount')}
					className='form-control'
					register={register}
					error={errors.amount}
					minsum={min_amount}
					maxsum={max_amount}
					defaultValue={formDefaultData['amount']}
				/>
				<FormButtonItem label={t('payment.continue')} className='inline-list-btn' />
			</FormWrapper>
		</>
	);
};

export default FirstFormLists;

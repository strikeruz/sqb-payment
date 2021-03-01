import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import FormWrapper from '../../FormWrapper';
import { FormInputItem, FormButtonItem, FormNestedSelects, FormCardInput, FormPhoneInput, FormSelectItem } from './../../FormElements'
import { setFormData, setPrepaymentData, sendPrePaymentRequest } from '@/store/actions/p2p/formDataAction';
import useFormFields from '@/hooks/useFormFields';

import { useTranslation } from 'react-i18next';

const PayForm = () => {
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
	const [formInputs, setFormInputs] = useState(prePaymentData.fields || [])

	const currentService = services.data.filter((service) => service.id == id)[0]
	const { list, title, min_amount, max_amount } = currentService

	const [isMultipleForm, setMultipleForm] = useState(false)
	const [isMultipleFormSelected, setMultipleFormSelected] = useState(false)
	const [formFields, setformFields] = useState([])

	useEffect(() => {
		if(list.length > 1) {
			setMultipleForm(true)
		}
		const formLists = useFormFields(list)
		setformFields(formLists)
	}, [])

	// Form Data | Validations | Errors
	const { register, handleSubmit, errors, control } = useForm({ mode: 'onBlur' })
	
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

	const chooseSelectedForms = (e) => {
		const { value } = e.target
		const filterFormFieldsBySelectVal = list.filter(e => e.id == value)
		const selectedFormLists = useFormFields(filterFormFieldsBySelectVal)
		setformFields(selectedFormLists)
		setMultipleForm(false)
		setMultipleFormSelected(true)
	}

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
				className='inline-list--second__item--popup--form'
				onSubmit={handleSubmit(onSubmit)}
			>
				{
					(isMultipleForm || isMultipleFormSelected) &&
					<FormSelectItem
						label={t('payment.select')}
						title={t('payment.select')}
						className="virtualReception__select"
						name='formselect'
						selectarr={list.map((selectItem) => ({key: selectItem.id, val: selectItem.title}))}
						register={register}
						errors={errors}
						defaultvalues={''}
						onChange={(e) =>
							chooseSelectedForms(e)
						}
					/>
				}
				{ !isMultipleForm && (
					<>
					    {
							formFields.map((form) => {
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
											defaultvalues={formDefaultData[form.type]}
											onChange={(e) =>
												onChangeFormInput('val', e.target.value, form.id)
											}
										/>
									);
								}
								if (form.format == 'list') {
									return (
										<FormSelectItem
											key={form.id}
											name={form.type}
											label={form.title}
											title={form.title}
											className="virtualReception__select"
											selectarr={form.data}
											register={register}
											errors={errors}
											defaultvalues={formDefaultData[form.type]}
											onChange={(e) =>
												onChangeFormInput('val', e.target.value, form.id)
											}
										/>
									);
								}
								if (form.format === 'string' || form.format === 'number') {
									return (
										<FormInputItem
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
							})
						}
						<FormCardInput
							label={t('payment.your_card_number')}
							register={register}
							defaultValue={formDefaultData}
							senderError={errors.sender}
							expireError={errors.sender_expire}
						/>
						<FormInputItem
							label={ t('payment.payment_amount') }
							type='text'
							name='amount'
							placeholder={ t('payment.payment_amount') }
							className='form-control'
							register={ register }
							error={ errors.amount }
							minsum={ min_amount }
							maxsum={max_amount}
							defaultValue={formDefaultData['amount']}
						/>
						<FormButtonItem label={t('payment.continue')} className='inline-list-btn' />
					</>
				)}

				
				
			</FormWrapper>
		</>
	);
};

export default PayForm;

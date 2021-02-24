import React from 'react';
import { useTranslation } from 'react-i18next';

const FormSelectItem = ({
	label,
	type,
	name,
	className,
	selectarr,
	register,
	errors,
	...otherOptions
}) => {
	const { t } = useTranslation();
	const selectClass = `virtualReception__select ${errors ? 'invalid' : ``}`;
	return (
		<div className='inline-list--second__item--popup--item'>
			<label>{label}</label>
			<div className='custom-div'>
				<select
					className={selectClass}
					ref={register({
						required: true,
						minLength: 1
					})}
					name={name}
					type={type}
					className={errors[name] ? `${className} invalid` : className}
					{...otherOptions}
					>
					<option value=''>{ t('payment.select') }</option>
					{selectarr &&
						selectarr.map((select) => (
							<option key={select.key} value={select.key}>
								{select.value || select.val}
							</option>
						))}
				</select>
			</div>
		</div>
	);
};

export default FormSelectItem;

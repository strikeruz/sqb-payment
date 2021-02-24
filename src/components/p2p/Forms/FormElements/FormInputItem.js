import React from 'react';
import InputMask from 'react-input-mask';
import NumberFormat from 'react-number-format';

const FormInputItem = ({
	label,
	type,
	name,
	defaultValue,
	placeholder,
	className,
	format,
	register,
	error,
	minsum,
	maxsum,
	customValidate,
	...otherAttributes
}) => {
	const defaultSchema = {
		required: true,
		minLength: 3
	};

	const numberSchema = format === 'number' ? {validate: value => /[0-9]$/.test(value)} : {}
	const schema = Object.assign(defaultSchema, customValidate, numberSchema);
	
	return (
		<div className='inline-list--second__item--popup--item'>
			<label>{label}</label>
			{name === 'amount' && (
				<NumberFormat
					getInputRef={register({
						required: true,
						minLength: 3,
						validate: function (value) {
							const val = value.split(' ').join('');
							return (
								/[0-9]$/.test(val) &&
								parseInt(val) >= minsum &&
								parseInt(val) <= maxsum
							);
						}
					})}
					name={name}
					type={type}
					defaultValue={defaultValue}
					placeholder={placeholder}
					className={error ? `${className} invalid` : className}
					thousandSeparator={' '}
					allowNegative={false}
				/>
			)}
			{name !== 'amount' && (
				<InputMask
					inputRef={register(schema)}
					name={name}
					type={type}
					defaultValue={defaultValue}
					placeholder={placeholder}
					className={error ? `${className} invalid` : className}
					{...otherAttributes}
				/>
			)}
		</div>
	);
};

export default FormInputItem;

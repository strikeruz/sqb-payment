import React from 'react';

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
					<option value=''>Выберите</option>
					{selectarr &&
						selectarr.map((select) => (
							<option key={select.key} value={select.key}>
								{select.value}
							</option>
						))}
				</select>
			</div>
		</div>
	);
};

export default FormSelectItem;

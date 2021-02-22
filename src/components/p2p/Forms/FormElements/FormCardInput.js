import React from 'react';
import { isCardValid, isExpireDateValid } from '@/utils/validations';
import InputMask from "react-input-mask";

const FormCardInput = ({ label, defaultValue, register, senderError, expireError}) => {
	const senderClass = `input-card-num form-control input-left${senderError ? ' invalid' : ``}`;
	const senderExpireClass = `form-control input-right input-card-date${expireError ? ' invalid' : ``}`;
	return (
		<div className='inline-list--second__item--popup--item'>
			<label>{label}</label>
			<div className='input-group'>
				<InputMask
					name='sender'
					className={senderClass}
					inputRef={register({
					validate: {
						validate: (value) => isCardValid(value)
					}
					})}
					mask="9999 9999 9999 9999"
					defaultValue={defaultValue.sender}
					alwaysShowMask
				/>
				<span className='input-group-divider' />
				<InputMask
					name='sender_expire'
					inputRef={register({
						validate: (value) => isExpireDateValid(value)
					})}
					defaultValue={defaultValue.sender_expire}
					className={senderExpireClass}
					mask="99/99"
					alwaysShowMask
				/>
			</div>
		</div>
	);
}

export default FormCardInput
import React from 'react';

export default function FormWrapper({ title, children, ...inputProps }) {
	return (
		<div>
			<h4>{title}</h4>
			<form {...inputProps}>{children}</form>
		</div>
	);
}

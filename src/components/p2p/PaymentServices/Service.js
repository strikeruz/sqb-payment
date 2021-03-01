import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setService } from '@/store/actions/p2p/servicesAction';
import { clearFormData } from '@/store/actions/p2p/formDataAction';

const Service = (props) => {
	const { title, id, logo } = props;
	let { url } = useRouteMatch();

	const { push } = useHistory();
	const dispatch = useDispatch();

	const nextStep = () => {
		dispatch(setService(props))
		dispatch(clearFormData())
		push(`${url}/services/${id}`);
	};
	return (
		<div className='inline-list--second__item' onClick={nextStep}>
			<img src={logo} alt={title} />
			<p>{ title }</p>
		</div>
	);
}

export default Service

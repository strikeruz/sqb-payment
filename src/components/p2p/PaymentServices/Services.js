import React, { useEffect } from 'react';
import { Route, useHistory, Switch, useRouteMatch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '@/store/actions/p2p/servicesAction';
import { PayForm, UserCardInformations, ConfirmUserSms } from '../Forms/Steps';
import ModalContainer from '../ModalContainer';
import Service from './Service';
import PrevButton from '../PrevButton';
import { useTranslation } from 'react-i18next';

const Services = () => {
	const { t } = useTranslation();

	const history = useHistory()
	const { url } = useRouteMatch();
	const { id } = useParams();

	const dispatch = useDispatch();
	const p2pServiceListData = useSelector((state) => state.services);
	const currentCategory = useSelector((state) => state.categories.currentCategory);
	const { loading, error, services } = p2pServiceListData;

	useEffect(() => {
		dispatch(getServices(id));
	}, [id]);

	const closeModal = () => {
		history.push(url)
	}

	const goToCategory = () => {
		const backUrl = url.replace(`categories/${id}`, '')
		history.push(backUrl)
	}

	return (
		<div className='inline-list--second'>
			<div className='inline-list--top'>
				<PrevButton className='inline-list--back' onClick={goToCategory}>
					{ t('payment.back') }
					<div className='inline-list--title'>{ currentCategory.title }</div>
				</PrevButton>
			</div>
			{loading
				? 'Loading...'
				: error
				? error.message
				: services.data.map((service) => (
						<Service key={service.id} {...service} />
				  ))}

			<Switch>
				<Route
					path={`${url}/services/:id`}
					exact
					children={({ match }) => {
						return (
							!loading && match &&
							<ModalContainer onClose={closeModal}>
								<PayForm />
							</ModalContainer>
						);
					}}
				/>
				<Route
					path={`${url}/services/:id/prepayment`}
					exact
					children={({ match }) => {
						return (
							!loading && match &&
							<ModalContainer onClose={closeModal}>
								<UserCardInformations />
							</ModalContainer>
						);
					}}
				/>
				<Route
					path={`${url}/services/:id/prepayment/smsconfirm`}
					exact
					children={({ match }) => {
						return (
							!loading && match &&
							<ModalContainer onClose={closeModal}>
								<ConfirmUserSms />
							</ModalContainer>
						);
					}}
				/>
			</Switch>
		</div>
	);
}

export default Services
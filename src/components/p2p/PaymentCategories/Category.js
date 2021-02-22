import React from 'react';
import { useHistory } from 'react-router-dom';
import { setCategory } from '@/store/actions/p2p/categoriesAction';
import { useDispatch } from 'react-redux';
const Category = (props) => {
	const { title, id, logo } = props;
	const { push } = useHistory();
	const dispatch = useDispatch()

	const goToServices = () => {
		dispatch(setCategory(props))
		push(`categories/${id}`);
	};
	return (
		<div className='main-list__item' onClick={goToServices}>
			<div className='main-list__img-wrap'>
				{logo && <img src={logo} alt={title} />}
			</div>
			<div className='main-list__teaser'>
				{title}
				<svg
					width='40'
					height='40'
					viewBox='0 0 40 40'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M2.38346 17.632C2.39596 18.0477 2.57096 18.4414 2.86784 18.732L19.9991 35.8633L37.1303 18.732C37.5491 18.332 37.7178 17.7351 37.571 17.1726C37.4241 16.6133 36.9866 16.1758 36.4272 16.0289C35.8647 15.882 35.2678 16.0508 34.8678 16.4695L19.9991 31.3383L5.13034 16.4695C4.67096 15.9977 3.96784 15.8539 3.35846 16.1102C2.75221 16.3695 2.36471 16.9727 2.38346 17.632ZM2.38346 7.23203C2.39596 7.64765 2.57096 8.0414 2.86784 8.33203L19.9991 25.4633L37.1303 8.33202C37.5491 7.93202 37.7178 7.33515 37.571 6.77265C37.4241 6.21327 36.9866 5.77577 36.4272 5.6289C35.8647 5.48202 35.2678 5.65077 34.8678 6.06952L19.9991 20.9383L5.13034 6.06952C4.67096 5.59765 3.96784 5.4539 3.35846 5.71015C2.75221 5.96952 2.36471 6.57265 2.38346 7.23203Z'
						fill='#E0E0E0'
					/>
				</svg>
			</div>
		</div>
	);
};

export default Category;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from '@/store/actions/p2p/categoriesAction';
import Category from './Category';

const Categories = () => {
	const dispatch = useDispatch();
	const p2pCategoryListData = useSelector((state) => state.categories);
	const { loading, error, categories } = p2pCategoryListData;

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	return (
		<>
			{
				loading
				? 'Loading...'
				: error
				? error.message
				: categories.data.map((cat) => <Category key={cat.id} {...cat} />)
			}
		</>
	);
};

export default Categories;

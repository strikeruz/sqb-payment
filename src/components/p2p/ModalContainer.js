import React from 'react';

const ModalContainer = ({ onClose, children }) => {
	return (
		<>
			<div className='inline-list--second__item--popup'>
				<div className='inline-list--second__item--popup-wrap'>
					<div className='inline-list--second__item--popup-close' onClick={onClose}></div>
					{children}
				</div>
			</div>
			<div className='inline-list--second__item--popup-overlay'></div>
		</>
	);
};
export default ModalContainer;

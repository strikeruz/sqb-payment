import React from 'react'

const ModalWrapper = ({children}) => {
    return (
        <>
            <div className="inline-list--second__item--popup">
                <div className="inline-list--second__item--popup-wrap">
                    <div className="inline-list--second__item--popup-close"></div>
                    { children }
                </div>
            </div>
            <div className="inline-list--second__item--popup-overlay"></div>
        </>
    )
}
export default ModalWrapper
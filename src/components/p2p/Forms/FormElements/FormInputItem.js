import React from 'react'

const FormInputItem = ({label, type, name, placeholder, className, register, error}) => {
    return (
        <div className="inline-list--second__item--popup--item">
            <label>{ label }</label>
            <input
                ref={register}
                name={name} 
                type={type}
                placeholder={placeholder} 
                className={error ? `${className} invalid` : className} 
            />
            {error && <div>{error.message}</div>}
        </div>
    )
}

export default FormInputItem
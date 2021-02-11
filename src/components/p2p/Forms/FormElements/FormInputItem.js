import React from 'react'

const FormInputItem = ({label, type, name, placeholder, className, register, error, customValidate}) => {
    const defaultSchema = {
        required: true, 
        minLength: 3
    }
    const schema = Object.assign(defaultSchema, customValidate);
    
    return (
        <div className="inline-list--second__item--popup--item">
            <label>{ label }</label>
            <input
                ref={register(schema)}
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
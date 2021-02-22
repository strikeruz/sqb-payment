import React from 'react'
import InputMask from 'react-input-mask';

const FormPhoneInput = ({label, formFields, className, defaultValue, register, error, onChangeFormInput}) => {
    const phonePrefixes = formFields.filter(e => e.format === 'prefix').map(e => e.data)[0]
    
    const changeValWithPrefix = (e) => {
        const { value } = e.target
        const prefixId = formFields.filter(e => e.format === 'prefix')[0].id
        const phoneId = formFields.filter(e => e.format === 'phone')[0].id

        const phoneVal = value.replace(/\s+|\W+|998...?/g, '')
        const prefixVal = value.split('').splice(5,2).join('')
        onChangeFormInput('val', phoneVal, phoneId)
        onChangeFormInput('val', prefixVal, prefixId)
    }
    return (
        <div className='inline-list--second__item--popup--item'>
            <label>{ label }</label>
			<div className='input-group'>
                <InputMask 
                    mask="+\9\98 99 999 99 99"
                    defaultValue={defaultValue}
                    placeholder='+998'
                    maskChar=' '
                    name='phone'
                    inputRef={register({
                        validate: (value) => /\d{2}8\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/g.test(value) && phonePrefixes.some(e => e.key === value.split('').splice(5,2).join(''))
                    })}
                    className={error ? `${className} invalid` : className}
                    onChange={(e) => changeValWithPrefix(e)}
                />
            </div>
        </div>
            
    )
}

export default FormPhoneInput
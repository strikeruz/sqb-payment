import React, { useState } from 'react'
import FormSelectItem from './FormSelectItem'
import { useTranslation } from 'react-i18next';

const FormNestedSelects = ({label, name, title, data, register, defaultValues, errors, ...otherOptions }) => {
    const { t } = useTranslation();

    const [selectedVals, setSelectedVals] = useState([])
    const filterSelectByVal = (e) => {
        const val = e.target.value
        const subSelects = data.filter(element => element.display === val)[0]
        if(val !== '') {
            setSelectedVals(subSelects.values)
        } else {
            setSelectedVals([])
        }
    }
    return (
        <>
            <div className="inline-list--second__item--popup--item">
                <label>{label}</label>
                <select 
                className={`virtualReception__select ${errors['region'] ? 'invalid' : ``}`}
                name="region"
                ref={
                    register({
                      required: true,
                      minLength: 1
                    })
                }
                onChange={(e) => filterSelectByVal(e)}
                >
                    <option value="">{ t('payment.select') }</option>
                    {data.map(fields => <option key={fields.display} value={fields.display}>{fields.display}</option>)}
                </select>
            </div>
            {   selectedVals && 
                    <FormSelectItem
                        name={name}
                        label={title}
                        className="virtualReception__select"
                        selectarr={selectedVals}
                        register={register}
                        errors={errors}
                        {...otherOptions}
                    />
            }
        </>
    )
}

export default FormNestedSelects
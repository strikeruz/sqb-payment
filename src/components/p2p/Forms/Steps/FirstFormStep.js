import React from 'react'
import FormInputItem from '../FormElements/FormInputItem'
import FormButtonItem from '../FormElements/FormButtonItem'
import FormWrapper from '../FormWrapper';
import { useLocation } from "react-router-dom";
import {useForm} from 'react-hook-form'
import useFormFields from './../../../../hooks/useFormFields';
import { FormNestedSelects } from './../FormElements/FormNestedSelects';
import FormCardInput from '../FormElements/FormCardInput';

const FirstFormStep = () => {
    let location = useLocation();
    const { title, list } = location.state
    const formFields = useFormFields(list)
    const {register, handleSubmit, errors} = useForm({mode: 'onBlur'})

    const onSubmit = (fields) => {
        console.log(fields)
    };
    return (
        <>
            <FormWrapper 
                title={title}
                className="inline-list--second__item--popup--form vkl-aside"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    formFields.map((form) => {
                        if(form.format == 'nested_data') {
                            return  <FormNestedSelects
                                        key={form.id}
                                        label="Регион" 
                                        title={form.title} 
                                        data={form.nested_data}
                                        register={register}
                                        errors={errors}
                                    />
                        }
                        if(form.format === 'string') {
                            return  <FormInputItem
                                        key={form.id}
                                        label={form.title}
                                        type="text"
                                        name={form.type}
                                        placeholder={form.title}
                                        className="form-control"
                                        register={register}
                                        error={errors[form.type]}
                                    />
                        }
                    }                     
                    )
                }
                <FormCardInput 
                    label="Номер твоей карты" 
                    register={register}
                    senderError={errors.sender}
                    expireError={errors.sender_expire}
                />
                <FormInputItem
                    label="Сумма платежа"
                    type="text"
                    name="amount"
                    placeholder="Сумма платежа"
                    className="form-control"
                    register={register}
                    error={errors.amount}
                    customValidate={
                        {
                            validate: (function (value) {
                                return parseInt(value.split(' ').join('')) >= 1000;
                            })
                        }
                    }
                />
                <FormButtonItem 
                    label="ПРОДОЛЖИТЬ"
                    className="inline-list-btn"
                />
            </FormWrapper>
        </>
    )
}

export default FirstFormStep
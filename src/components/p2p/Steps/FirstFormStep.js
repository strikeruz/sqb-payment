import React from 'react'
import FormInputItem from '../Forms/FormElements/FormInputItem'
import FormButtonItem from '../Forms/FormElements/FormButtonItem'
import FormWrapper from '../Forms/FormWrapper';
import { useLocation } from "react-router-dom";
import {useForm} from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

const FirstFormStep = () => {
    let location = useLocation();
    const { title } = location.state
    console.log(location.state)
    
    const schema = Yup.object({
        region: Yup.string().min(3, 'Minimum 3').required('Required')
    })
    const {register, handleSubmit, errors} = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    })

    const onSubmit = ({region}) => {
        alert(`region: ${region}`);
    };
    return (
        <>
            <FormWrapper 
                title={title}
                className="inline-list--second__item--popup--form vkl-aside"
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormInputItem 
                    label="Регион"
                    type="text"
                    name="region"
                    placeholder="placeholder"
                    className="form-control"
                    register={register}
                    error={errors.region}
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
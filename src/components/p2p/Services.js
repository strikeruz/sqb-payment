import React, { useEffect } from 'react'
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getServices } from './../../store/actions/p2p/servicesAction';
import Service from './Service';
import arrowLeftIcon from '../../assets/images/arrow-left.svg'

export default function Services () {
    let location = useLocation();
    const { serviceId } = location.state || {};
    const dispatch = useDispatch()
    const p2pServiceListData = useSelector(state => state.services)
    const { loading, error, services } = p2pServiceListData

    useEffect(() => {
        dispatch(getServices(serviceId))
    }, [dispatch])

    return (
        <>
            <div className="inline-list--second">
                <div className="inline-list--top">
                    <div className="inline-list--back">
                        <img src={arrowLeftIcon} alt="" />Назад
                        <div className="inline-list--title">Коммунальные услуги</div>
                    </div>
                </div>    
                {
                    loading ? "Loading..." : error ? error.message :
                        services.data.map(service => <Service key={service.id} {...service} />)
                }
            </div>
        </>
    )
}

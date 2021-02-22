import React from 'react'

const FormButtonItem = (props) => {
    const { label, className } = props
    return (
        <div className="inline-list--second__item--popup--item">
            <button className={className} type="submit" {...props}>{ label }</button>
        </div>
    )
}
export default FormButtonItem
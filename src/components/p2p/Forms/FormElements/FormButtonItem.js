import React from 'react'

export default function FormButtonItem(props) {
    const { label, className } = props
    return (
        <div className="inline-list--second__item--popup--item">
            <button className={className} type="submit">{ label }</button>
        </div>
    )
}

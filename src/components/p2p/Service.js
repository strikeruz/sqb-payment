import React from 'react'
import { useHistory } from 'react-router-dom';

export default function Service(props) {
    const { title, id, logo } = props
    const history = useHistory()
    const nextStep = () => {
      history.push({
        pathname: '/step3',
        state: {...props}
      })
    }
    return (
        <div className="inline-list--second__item" onClick={nextStep}>
          <img src={logo} alt={title} />
        </div>
    )
}

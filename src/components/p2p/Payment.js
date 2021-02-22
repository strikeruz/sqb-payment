import React from 'react'
import {
    Switch,
    Route
} from "react-router-dom";

import { Categories } from './PaymentCategories/';
import { Services } from './PaymentServices/';

export default function Payment() {
    return (
        <div className="main-list">
            <Switch>
                <Route path={`*payments/`} exact render={() => <Categories />} />
                <Route path={`*payments/categories/:id`} render={() => <Services /> } />
            </Switch>
        </div>
    )
}

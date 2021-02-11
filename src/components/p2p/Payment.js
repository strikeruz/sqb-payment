import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Categories from './PaymentCategories/Categories';
import Services from './PaymentServices/Services';
import ModalContainer from './ModalContainer'
import FirstFormStep from './Forms/Steps/FirstFormStep';

export default function Payment() {
    return (
        <div className="main-list">
            <Router>
                <Switch>
                    <Route path="/" render={() => <Categories/>} exact />
                    <Route path="/step2" render={() => <Services /> } />
                    <Route path="/step3" render={() => <ModalContainer><FirstFormStep /></ModalContainer>} />
                    <Route path="/step4" render={() => <Categories />} />
                </Switch>
            </Router>
        </div>
    )
}

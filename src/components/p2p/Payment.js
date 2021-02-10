import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Categories from './Categories';
import Services from './Services';
import ModalWrapper from './ModalWrapper'
import FirstFormStep from './Steps/FirstFormStep';

export default function Payment() {
    return (
        <div className="main-list">
            <Router>
                <Switch>
                    <Route path="/" render={() => <Categories/>} exact />
                    <Route path="/step2" render={() => <Services /> } />
                    <Route path="/step3" render={() => <ModalWrapper><FirstFormStep /></ModalWrapper>} />
                    <Route path="/step4" render={() => <Categories />} />
                </Switch>
            </Router>
        </div>
    )
}

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux'
import store from './store/store';
import i18n from './locale/i18n'


ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <App />
        </Provider>
    </I18nextProvider>,
    document.getElementById('payments')
);
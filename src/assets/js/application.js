import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import App from './ui/components/App.jsx';
import reducer from './ui/reducers';

let initialState = Immutable.fromJS({
    dataset: [],
    current: {
        dataSource: {},
        visualization: {}
    },
    modal: {
        isShown: false,
        title: '',
        bodyType: null,
        bodyInitState: {}
    }
});

let enhancers = [
    applyMiddleware(thunk)
];
if (window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
}
let store = createStore(reducer, initialState, compose(...enhancers));

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('body')
);
import {combineReducers} from 'redux-immutable';
import Immutable from 'immutable';
import * as Actions from './../../actions/actionTypes';
import * as DataSources from './../../constants/dataSources';

let isShown = (state = false, action) => {
    switch (action.type) {
        case Actions.MENU_ITEM_CLICKED:
            return true;
        case Actions.MODAL_CLOSED:
            return false;
        default:
            return state;
    }
};

let title = (state = '', action) => {
    switch (action.type) {
        case Actions.MENU_ITEM_CLICKED:
            return action.payload.label;
        case Actions.MODAL_CLOSED:
            return '';
        default:
            return state;
    }
};

let bodyType = (state = null, action) => {
    let payload = action.payload;
    switch (action.type) {
        case Actions.MENU_ITEM_CLICKED:
            return payload.name;
        default:
            return state;
    }
};

let bodyInitState = (state = new Map(), action) => {
    let payload = action.payload;
    switch (action.type) {
        case Actions.MENU_ITEM_CLICKED:
            return Immutable.fromJS(payload.configs);
        default:
            return state;
    }
};

let modal = combineReducers({
    isShown,
    title,
    bodyType,
    bodyInitState
});

export default modal;
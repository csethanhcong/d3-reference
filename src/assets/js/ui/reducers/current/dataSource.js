import {handleAction} from 'redux-actions';
import Immutable from 'immutable';
import * as Actions from './../../actions/actionTypes';

let defaultState = Immutable.Map();

let dataSource = (state = defaultState, action) => {
    switch (action.type) {
        case Actions.DATA_SOURCE_UPDATED:
            return Immutable.fromJS(action.payload);
        default:
            return state;
    }
};

export default dataSource;
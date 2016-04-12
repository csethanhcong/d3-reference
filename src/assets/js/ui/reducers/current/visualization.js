import {handleAction} from 'redux-actions';
import Immutable from 'immutable';
import * as Actions from './../../actions/actionTypes';

let visualization = (state = Immutable.Map(), action) => {
    switch (action.type) {
        case Actions.VISUALIZATION_CONFIGS_UPDATED:
            return Immutable.fromJS(action.payload);
        default:
            return state;
    }
};

export default visualization;
import Immutable from 'immutable';
import * as Actions from './../actions/actionTypes';

let dataset = (state = Immutable.List(), action) => {
    switch(action.type) {
        case Actions.DATASET_UPDATED:
            return Immutable.fromJS(action.payload.data) || [];
        default:
            return state;
    }
};

export default dataset;
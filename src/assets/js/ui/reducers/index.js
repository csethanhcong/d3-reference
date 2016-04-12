import {combineReducers} from 'redux-immutable';
import {handleAction} from 'redux-actions';
import * as Actions from './../actions/actionTypes';
import modal from './modal';
import current from './current';
import dataset from './dataset';

let reducer = combineReducers({
    dataset,
    current,
    modal
});


export default reducer;
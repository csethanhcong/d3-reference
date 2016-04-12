import {combineReducers} from 'redux-immutable';
import dataSource from './dataSource';
import visualization from './visualization';

let current = combineReducers({
    dataSource,
    visualization
});

export default current;
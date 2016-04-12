import * as Actions from './actionTypes';
import {createAction} from 'redux-actions';

export const menuItemClicked = createAction(Actions.MENU_ITEM_CLICKED);
export const datasetUpdated = createAction(Actions.DATASET_UPDATED);

export const dataSourceUpdated = createAction(Actions.DATA_SOURCE_UPDATED);
export const visualizationConfigsUpdated = createAction(Actions.VISUALIZATION_CONFIGS_UPDATED);

export const modalClosed = createAction(Actions.MODAL_CLOSED);
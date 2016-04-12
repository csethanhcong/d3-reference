import React from 'react';
import EventEmitter from 'events';
import AppDispatcher from './../dispatcher/AppDispatcher';
import DataSourceConstants from './../constants/DataSourceConstants';
import ModalConstants from './../constants/ModalConstants';
import DataSet from './../../includes/Dataset';

// All `onOk` properties must be a callback with the `this` context is the current element
let dataSources = [
    {
        label: "Direct input",
        content: ModalConstants.BODY_DIRECT_INPUT
    }, {
        label: "From local file",
        content: ModalConstants.BODY_FILE_INPUT
    }
];
class DataSourceStore extends EventEmitter {

    getDataSources() {
        return dataSources;
    }

    getDataSet() {
        return this.dataSet;
    }

    getDataSetColumns() {
        return !!this.dataSetColumns ? this.dataSetColumns : [];
    }

    updateDataSet(data) {
        let ds = new DataSet(data);
        let that = this;
        return ds.fetch(function () {
            that.dataSet = this;
            that.dataSetColumns = this.columnNames().map((c) => ({
                name: c,
                type: this.column(c).type
            }))
            that.emitDataSetUpdated();
        });
    }

    //<editor-fold desc="MENU_ITEM_CLICKED">
    addMenuItemClickedListener(callback) {
        this.on(DataSourceConstants.MENU_ITEM_CLICKED, callback);
    }

    removeMenuItemClickedListener(callback) {
        this.removeListener(DataSourceConstants.MENU_ITEM_CLICKED, callback);
    }

    emitMenuItemClicked(dataSource) {
        this.emit(DataSourceConstants.MENU_ITEM_CLICKED, dataSource);
    }

    //</editor-fold>

    //<editor-fold desc="DATA_SET_UPDATED">
    addDataSetUpdatedListener(callback) {
        this.on(DataSourceConstants.DATA_SET_UPDATED, callback);
    }

    removeDataSetUpdatedListener(callback) {
        this.removeListener(DataSourceConstants.DATA_SET_UPDATED, callback);
    }

    emitDataSetUpdated() {
        this.emit(DataSourceConstants.DATA_SET_UPDATED);
    }

    //</editor-fold>
}

let storeInstance = new DataSourceStore();
storeInstance.dispatchToken = AppDispatcher.register(payload => {
    let action = payload.action;

    switch (action.actionType) {
        case DataSourceConstants.DATA_SOURCE_NEW:
            storeInstance.emitMenuItemClicked(action.data);
            break;

        case DataSourceConstants.DATA_SOURCE_UPDATE:
            storeInstance.updateDataSet(action.data)
            break;

        default:
            return true;
    }

    return true;
});

export default storeInstance;
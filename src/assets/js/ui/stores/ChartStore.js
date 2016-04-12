import React from 'react';
import EventEmitter from 'events';
import AppDispatcher from './../dispatcher/AppDispatcher';
import ChartConstants from './../constants/ChartConstants';
import ModalConstants from './../constants/ModalConstants';

// All `onOk` properties must be a callback with the `this` context is the current element
let availableVisTypes = [
    {
        label: "Bar Chart",
        content: ModalConstants.CHART_BAR
    }
];
class ChartStore extends EventEmitter {

    constructor() {
        super();

        this.currentVisualization = {};
        this.currentConfigs = {};
    }

    getAvailableVisTypes() {
        return availableVisTypes;
    }

    getCurrentVisualization() {
        return this.currentVisualization;
    }

    setCurrentVisualization(vis) {
        this.currentVisualization = vis;
        return this;
    }

    getCurrentConfigs() {
        return this.currentConfigs;
    }

    setCurrentConfigs(configs) {
        this.currentConfigs = configs;
        return this;
    }

    //<editor-fold desc="MENU_ITEM_CLICKED">
    addMenuItemClickedListener(callback) {
        this.on(ChartConstants.MENU_ITEM_CLICKED, callback);
    }

    removeMenuItemClickedListener(callback) {
        this.removeListener(ChartConstants.MENU_ITEM_CLICKED, callback);
    }

    emitMenuItemClicked(dataSource) {
        this.emit(ChartConstants.MENU_ITEM_CLICKED, dataSource);
    }

    //</editor-fold>

    //<editor-fold desc="VIS_CONFIG_UPDATED">
    addConfigsUpdatedListener(callback) {
        this.on(ChartConstants.VIS_CONFIG_UPDATED, callback);
    }

    removeConfigsUpdatedListener(callback) {
        this.removeListener(ChartConstants.VIS_CONFIG_UPDATED, callback);
    }

    emitConfigsUpdated() {
        this.emit(ChartConstants.VIS_CONFIG_UPDATED);
    }

    //</editor-fold>
}

let storeInstance = new ChartStore();
storeInstance.dispatchToken = AppDispatcher.register(payload => {
    let action = payload.action;

    switch (action.actionType) {
        case ChartConstants.VIS_NEW:
            storeInstance.setCurrentVisualization(action.data)
                .emitMenuItemClicked(action.data);
            break;

        case ChartConstants.VIS_UPDATE_CONFIGS:
            storeInstance.emitMenuItemClicked(null);
            break;

        case ChartConstants.VIS_CONFIG_UPDATED:
            storeInstance.setCurrentConfigs(action.data.state)
                .emitConfigsUpdated();
            break;

        default:
            return true;
    }

    return true;
});

export default storeInstance;
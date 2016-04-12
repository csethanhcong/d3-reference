import AppDispatcher from '../dispatcher/AppDispatcher'
import ChartConstants from '../constants/ChartConstants'

class ChartActions {

    static updateCurrentVisConfigs() {
        AppDispatcher.handleViewAction({
            actionType: ChartConstants.VIS_UPDATE_CONFIGS
        });
    }

    static createNewVisualization(vis) {
        AppDispatcher.handleViewAction({
            actionType: ChartConstants.VIS_NEW,
            data: vis
        });
    }

    static saveCurrentVisConfig(configs) {
        AppDispatcher.handleViewAction({
            actionType: ChartConstants.VIS_CONFIG_UPDATED,
            data: configs
        });
    }
}

export default ChartActions;

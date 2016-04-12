import AppDispatcher from '../dispatcher/AppDispatcher'
import InputAreaConstants from '../constants/DataSourceConstants'

class DataSourceActions {

    // create new data source
    static newDataSource(dataSource) {
        AppDispatcher.handleViewAction({
            actionType: InputAreaConstants.DATA_SOURCE_NEW,
            data: dataSource
        });
    }

    static saveDataSource(data) {
        AppDispatcher.handleViewAction({
            actionType: InputAreaConstants.DATA_SOURCE_UPDATE,
            data: data
        });
    }
}

export default DataSourceActions;

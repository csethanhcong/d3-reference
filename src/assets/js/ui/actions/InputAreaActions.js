import AppDispatcher from '../dispatcher/AppDispatcher'
import InputAreaConstants from '../constants/InputAreaConstants'

export default {
    newVisualization(chart) {
        AppDispatcher.handleViewAction({
            actionType: InputAreaConstants.VIS_NEW,
            data: chart
        })
    }
}

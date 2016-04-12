import {connect} from 'react-redux';
import {modalClosed, datasetUpdated, dataSourceUpdated, visualizationConfigsUpdated} from './../actions/actionCreators';
import * as DataSources from './../constants/dataSources';
import * as Visualizations from './../constants/visualizations';
import ReactAppModal from './../components/AppModal.jsx';

const mapStateToProps = (state) => {
    let modal = state.get('modal');
    return {
        isShown: modal.get('isShown'),
        title: modal.get('title'),
        bodyType: modal.get('bodyType'),
        bodyInitState: modal.get('bodyInitState').toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClosed: () => {
            dispatch(modalClosed());
        },

        // type: the type of configuration
        // configs: the current configuration
        // data: the updated dataset or the callback function
        onUpdated: (type, configs, data) => {
            switch (type) {
                case DataSources.DIRECT_INPUT:
                case DataSources.FILE_INPUT:
                    dispatch(dataSourceUpdated({name: type, configs: configs}));
                    if (typeof data === 'function') {
                        data((content) => {
                            dispatch(datasetUpdated({data: content}));
                        });
                    } else {
                        dispatch(datasetUpdated({data: data}));
                    }
                    break;
                case Visualizations.BAR_CHART:
                case Visualizations.AREA_CHART:
                case Visualizations.LINE_CHART:
                case Visualizations.LINKED_MULTIPLE_CHART:
                    dispatch(visualizationConfigsUpdated({name: type, configs: configs}));
                    break;
            }

        }
    }
};

let AppModal = connect(mapStateToProps, mapDispatchToProps)(ReactAppModal);
export default AppModal;
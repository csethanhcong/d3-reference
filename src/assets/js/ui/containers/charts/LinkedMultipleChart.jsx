import {connect} from 'react-redux';
import Immutable from 'immutable';
import LinkedMultipleChartComponent from './../../components/charts/LinkedMultipleChart.jsx';

let mapStateToProps = (state) => {
    let fieldX = state.getIn(['current', 'visualization', 'configs', 'fieldX'], 'id');
    let fieldY = state.getIn(['current', 'visualization', 'configs', 'fieldY'], Immutable.List()).toJS();
    return {
        data: state.get('dataset').toJS(),
        fieldY: fieldY,
        x: function (d) {
            return d[fieldX];
        }
    }
};

let LinkedMultipleChart = connect(mapStateToProps)(LinkedMultipleChartComponent);
export default LinkedMultipleChart;
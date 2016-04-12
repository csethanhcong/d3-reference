import {connect} from 'react-redux';
import Immutable from 'immutable';
import BarChartComponent from './../../components/charts/BarChart.jsx';

let mapStateToProps = (state) => {
    let fieldX = state.getIn(['current', 'visualization', 'configs', 'fieldX'], 'id');
    let fieldY = state.getIn(['current', 'visualization', 'configs', 'fieldY'], Immutable.List()).toJS();
    return {
        data: state.get('dataset').toJS(),
        chartSeries: fieldY.map((s) => ({
            name: s.name,
            field: s.name,
            color: s.color
        })),
        x: function (d) {
            return d[fieldX];
        }
    }
};

let BarChart = connect(mapStateToProps)(BarChartComponent);
export default BarChart;
import {connect} from 'react-redux';
import Immutable from 'immutable';
import AreaChartComponent from './../../components/charts/AreaChart.jsx';

let mapStateToProps = (state) => {
    let fieldX = state.getIn(['current', 'visualization', 'configs', 'fieldX'], 'id');
    let fieldY = state.getIn(['current', 'visualization', 'configs', 'fieldY'], Immutable.List()).toJS();
    return {
        data: state.get('dataset').toJS(),
        chartSeries: fieldY.map((s) => ({
            name: s.name,
            field: s.name,
            color: s.color,
            style: {
                opacity: .7
            }
        })),
        x: function (d) {
            return d[fieldX];
        }
    }
};

let BarChart = connect(mapStateToProps)(AreaChartComponent);
export default BarChart;
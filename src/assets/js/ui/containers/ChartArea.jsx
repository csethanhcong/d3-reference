import {connect} from 'react-redux';
import ChartAreaComponent from './../components/ChartArea.jsx';

const mapStateToProps = (state) => {
    return {
        visType: state.getIn(['current', 'visualization', 'name'])
    }
};

let ChartArea = connect(mapStateToProps)(ChartAreaComponent);
export default ChartArea;
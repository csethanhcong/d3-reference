import {connect} from 'react-redux';
import {menuItemClicked} from './../actions/actionCreators';
import ReactMenuBar from './../components/MenuBar.jsx';

const mapStateToProps = (state) => {
    let current = state.get('current');
    return {
        currentDataSource: current.get('dataSource').toJS(),
        currentVisualization: current.get('visualization').toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onMenuItemClicked: (menuItem) => {
            dispatch(menuItemClicked(Object.assign({}, menuItem.props, {menuId: menuItem.id, label: menuItem.label})));
        }
    }
};

let MenuBar = connect(mapStateToProps, mapDispatchToProps)(ReactMenuBar);
export default MenuBar;
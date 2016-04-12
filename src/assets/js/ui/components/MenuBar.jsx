import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import React from 'react';
import * as MenuItems from './../constants/menuItems';

class MenuBar extends React.Component {

    _onMenuClicked(menuItem) {
        return this.props.onMenuItemClicked(menuItem);
    }

    render() {
        return (
            <Navbar fluid>
                <Navbar.Header>
                    <Navbar.Brand>DataViz</Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavDropdown title="Data sources" id="menu-data-source">
                            {this.props.dataSources.map((e, i) => (
                                <MenuItem key={i} onClick={this._onMenuClicked.bind(this, e)}>
                                    {`${e.label} ...`}
                                </MenuItem>
                            ))}
                            <MenuItem divider/>
                            <MenuItem disabled={!this.props.currentDataSource.name}
                                      onClick={this._onMenuClicked.bind(this, {id: MenuItems.EDIT_CURRENT_DATA_SOURCE, label: 'Edit current data source', props: this.props.currentDataSource})}
                            >
                                Edit current data source
                            </MenuItem>
                        </NavDropdown>
                        <NavDropdown title="Visualizations" id="menu-visualization">
                            {this.props.visualizations.map((e, i) => (
                                <MenuItem key={i} onClick={this._onMenuClicked.bind(this, e)}>
                                    {`${e.label} ...`}
                                </MenuItem>
                            ))}
                            <MenuItem divider/>
                            <MenuItem disabled={!this.props.currentVisualization.name}
                                      onClick={this._onMenuClicked.bind(this, {id: MenuItems.EDIT_CURRENT_VIS_CONFIGS, label: 'visualization', props: this.props.currentVisualization})}
                            >
                                Edit current visualization
                            </MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

MenuBar.propTypes = {
    dataSources: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired,
            props: React.PropTypes.shape({
                name: React.PropTypes.string,
                configs: React.PropTypes.object
            })
        })
    ).isRequired,
    visualizations: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired,
            props: React.PropTypes.shape({
                name: React.PropTypes.string,
                configs: React.PropTypes.object
            })
        })
    ).isRequired,
    onMenuItemClicked: React.PropTypes.func.isRequired,
    currentDataSource: React.PropTypes.object,
    currentVisualization: React.PropTypes.object
};

export default MenuBar;
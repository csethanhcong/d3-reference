import React from 'react';
import Immutable from 'immutable';
import ChartArea from './../containers/ChartArea.jsx';
import AppModal from './../containers/AppModal.jsx';
import MenuBar from './../containers/MenuBar.jsx';
import {fileInputSpec, directInputSpec} from './../constants/dataSources';
import {barChartSpec, lineChartSpec, areaChartSpec, linkedMultipleChartSpec} from './../constants/visualizations';
import * as MenuItem from './../constants/menuItems';

class App extends React.Component {

    render() {
        return (
            <div className="application" id="wrap">
                <MenuBar dataSources={App.availableDataSources} visualizations={App.availableVisualizationTypes}/>
                <ChartArea />
                <div className="modals-area">
                    <AppModal />
                </div>
            </div>
        );
    }
}

App.availableDataSources = [
    {
        label: 'New data source from text',
        id: MenuItem.NEW_DATA_SOURCE_FROM_TEXT,
        props: directInputSpec
    },
    {
        label: 'New data source from file',
        id: MenuItem.NEW_DATA_SOURCE_FROM_FILE,
        props: fileInputSpec
    }
];

App.availableVisualizationTypes = [
    {
        label: 'New bar chart',
        id: MenuItem.NEW_BAR_CHART,
        props: barChartSpec
    },
    {
        label: 'New area chart',
        id: MenuItem.NEW_AREA_CHART,
        props: areaChartSpec
    },
    {
        label: 'New line chart',
        id: MenuItem.NEW_LINE_CHART,
        props: lineChartSpec
    },
    {
        label: 'New linked multiple chart',
        id: MenuItem.NEW_LINKED_MULTIPLE_CHART,
        props: linkedMultipleChartSpec
    }
];

export default App;
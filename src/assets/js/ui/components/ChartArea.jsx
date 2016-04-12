import React from 'react';
import * as Visualizations from './../constants/visualizations';
import BarChart from './../containers/charts/BarChart.jsx';
import AreaChart from './../containers/charts/AreaChart.jsx';
import LineChart from './../containers/charts/LineChart.jsx';
import LinkedMultipleChart from './../containers/charts/LinkedMultipleChart.jsx';

class ChartArea extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            width: 0,
            initiated: false
        };
    }

    componentDidMount() {
        let containerHeight = $(window).innerHeight() - 97;
        let containerWidth = $(window).innerWidth() - 38;
        this.setState({
            height: containerHeight,
            width: containerWidth,
            initiated: true
        });
    }

    _renderChart() {
        switch (this.props.visType) {
            case Visualizations.BAR_CHART:
                return (
                    <BarChart {...this.state} />
                );
            case Visualizations.AREA_CHART:
                return (
                    <AreaChart {...this.state} />
                );
            case Visualizations.LINE_CHART:
                return (
                    <LineChart {...this.state} />
                );
            case Visualizations.LINKED_MULTIPLE_CHART:
                return (
                    <LinkedMultipleChart {...this.state} />
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <div id="chart-area">
                <div className="panel panel-default">
                    <div className="panel-body">
                        <div style={{minHeight: this.state.height}}>
                            {this._renderChart()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChartArea.propTypes = {
    visType: React.PropTypes.string
};

export default ChartArea;

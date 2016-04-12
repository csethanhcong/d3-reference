import React from 'react';
import BarChart from './BarChart.jsx';
import ContextZooming from './../context_zooming/ContextZooming.jsx';
import Tooltip from './../tooltips/Tooltip.jsx';
import DataSourceStore from './../../stores/DataSourceStore';
import ChartStore from './../../stores/ChartStore';

class BarChartArea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            width: 0,
            height: 0,
            data: null,
            fieldX: '_index',
            fieldY: [],
            isInitialized: false,
            sliderHeight: 50,
            dataExtend: null,
            xTooltip: null,
            yTooltip: null,
            contentTooltip: null
        };
    }

    componentDidMount() {
        let windowHeight = $(window).innerHeight();
        let windowWidth = $(window).innerWidth();

        this.setState({
            width: (windowWidth - 38),
            height: (windowHeight - 97),
            isInitialized: true
        });

        DataSourceStore.addDataSetUpdatedListener(this._dataSetUpdated.bind(this));
        ChartStore.addConfigsUpdatedListener(this._configsUpdated.bind(this));
    }

    componentWillUnmount() {
        DataSourceStore.removeDataSetUpdatedListener(this._dataSetUpdated.bind(this));
        ChartStore.removeConfigsUpdatedListener(this._configsUpdated.bind(this));
    }

    _dataSetUpdated() {
        this.setState({data: DataSourceStore.getDataSet()});
    }

    _configsUpdated() {
        let currentConfig = ChartStore.getCurrentConfigs();
        this.setState({
            fieldX: currentConfig.fieldX,
            fieldY: currentConfig.fieldY
        });
    }

    _getChartAreaData() {
        if (!this.state.dataExtend) {
            return this.state.data;
        } else {
            return this.state.data.rows((row) => {
                return row._index >= this.state.dataExtend[0] && row._index <= this.state.dataExtend[1];
            });
        }

    }

    _zoomingSliderUpdated(extend) {
        this.setState({dataExtend: extend});
    }

    mouseOut(d, i) {

        this.setState({
            xTooltip: null,
            yTooltip: null,
            contentTooltip: null
        })
    }

    mouseOver(d, i) {
        const contentTooltip = {title: `${this.state.fieldX}: ${d.category}`, value: d.value, fieldTitle: d.field};
        this.setState({
            xTooltip: d3.event.clientX,
            yTooltip: d3.event.clientY,
            contentTooltip: contentTooltip
        })
    }

    render() {
        return (
            <div ref="container" style={{minHeight: this.state.height}}>
                {(() => {
                    if (this.state.isInitialized && !!this.state.data) {
                        return (
                            <div>
                                <Tooltip xTooltip={this.state.xTooltip}
                                         yTooltip={this.state.yTooltip}
                                         contentTooltip={this.state.contentTooltip}/>
                                <div>
                                    <BarChart width={this.state.width}
                                              height={this.state.height - this.state.sliderHeight}
                                              data={this._getChartAreaData()}
                                              fieldX={this.state.fieldX}
                                              fieldY={this.state.fieldY}
                                              onMouseOver={this.mouseOver.bind(this)}
                                              onMouseOut={this.mouseOut.bind(this)}
                                    />
                                </div>
                                <div>
                                    <ContextZooming width={this.state.width}
                                                    height={this.state.sliderHeight}
                                                    data={this.state.data}
                                                    onSliderUpdated={this._zoomingSliderUpdated.bind(this)}
                                                    extend={this.state.dataExtend}
                                    />
                                </div>
                            </div>
                        );
                    }
                })()}
            </div>
        );
    }
}

export default BarChartArea;
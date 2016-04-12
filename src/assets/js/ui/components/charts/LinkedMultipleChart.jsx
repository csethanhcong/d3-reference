import React from 'react';

import {
    Xaxis,
    Yaxis,
    scale,
    xDomainCount
} from 'react-d3-core';

import {Area, Line, Bar} from 'react-d3-shape';

import Voronoid from './../../charts/Voronoid.jsx';
import Focus from './../../charts/Focus.jsx';
import Tooltip from './../../charts/tooltips/Tooltip.jsx'

import {yDomainCount} from './../../../includes/ultils';

import {
    commonVisProps,
    GROUPED_BARS,
    LINE_CHART,
    BAR_CHART,
    AREA_CHART
} from './../../constants/visualizations';

import BarChart from './BarChart.jsx';
import LineChart from './LineChart.jsx';
import AreaChart from './AreaChart.jsx';

import ZoomingBrush from './ZoomingBrush.jsx';

class LinkedMultipleChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusPoint: {},
            contentTooltip: null,
            data: props.data
        };
    }

    onMouseOver(d, i) {
        this.setState({
            focusPoint: d
        })
    }

    onMouseOut(d, i) {

    }

    getYCoord(yScale, data, x, bisector, field) {
        let index = bisector(data, x);
        let item = data[index];
        if (item === undefined) {
            return -1000;
        } else {
            return yScale(item[field]);
        }
    }

    extentUpdated(extent) {
        let newData = this.props.data.filter((d) => {
            let x = this.props.x(d);
            return (x >= extent[0]) && (x <= extent[1]);
        });

        this.setState({data: newData});
    }


    render() {

        let transform = `translate(${this.props.margins.left}, ${this.props.margins.top})`;

        let singleChartHeight = 100;
        if (this.props.fieldY.length) {
            singleChartHeight = (this.props.height + 10) / this.props.fieldY.length - 10;
        }

        let bisector = d3.bisector(this.props.x).left;

        let brushDomain = xDomainCount(this.props, false, false);
        let brushXScale = scale( {
            scale: 'linear',
            range: [0, this.props.width - this.props.margins.left - this.props.margins.right],
            domain: brushDomain,
            rangeRoundBands: {
                interval: [0, this.props.width - this.props.margins.left - this.props.margins.right],
                padding: .1
            }
        });
        this.brushXScale = brushXScale;

        let subChartConfigs = this.props.fieldY.map((configs) => {
            let props = {
                data: this.state.data,
                width: this.props.width,
                height: singleChartHeight,
                margins: this.props.margins,
                xScale: (configs.type === BAR_CHART) ? 'ordinal' : 'linear',
                yScale: 'linear',
                xRange: [0, this.props.width - this.props.margins.left - this.props.margins.right],
                yRange: [singleChartHeight - this.props.margins.top - this.props.margins.bottom, 0],
                xRangeRoundBands: {
                    interval: [0, this.props.width - this.props.margins.left - this.props.margins.right],
                    padding: .1
                },
                yRangeRoundBands: {
                    interval: [0, singleChartHeight - this.props.margins.top - this.props.margins.bottom],
                    padding: .1
                },
                x: this.props.x,
                y: this.props.y,
                onMouseOver: this.onMouseOver.bind(this),
                onMouseOut: this.onMouseOut.bind(this)
            };
            switch (configs.type) {
                case BAR_CHART:
                    props.chartSeries = [{
                        name: configs.name,
                        field: configs.name,
                        color: configs.color
                    }];
                    break;
                case LINE_CHART:
                    props.chartSeries = [{
                        name: configs.name,
                        field: configs.name,
                        color: configs.color
                    }];
                    break;
                case AREA_CHART:
                    props.chartSeries = [{
                        name: configs.name,
                        field: configs.name,
                        color: configs.color,
                        style: {
                            opacity: .7
                        }
                    }];
                    break;
                default:
                    props.chartSeries = [];
                    return null;
            }
            let xDomain = xDomainCount(props, false, false); // props, stack, horizontal
            let yDomain = yDomainCount(props, false, false);
            let xScaleSet = scale({
                scale: props.xScale,
                range: props.xRange,
                domain: xDomain,
                rangeRoundBands: props.xRangeRoundBands
            });
            let yScaleSet = scale({
                scale: props.yScale,
                range: props.yRange,
                domain: yDomain,
                rangeRoundBands: props.yRangeRoundBands
            });
            Object.assign(props, {
                xDomain: xDomain,
                yDomain: yDomain,
                xScaleSet: xScaleSet,
                yScaleSet: yScaleSet
            });
            return props;
        });

        if (this.props.initiated) {
            return (
                <div>
                    {this.props.fieldY.map((configs, i) => {
                        let currentChildProps = subChartConfigs[i];
                        switch (configs.type) {
                            case BAR_CHART:
                                let rangeBand = currentChildProps.xScaleSet.rangeBand();
                                return (
                                    <div key={i}>
                                        <svg ref="svgContainer" width={currentChildProps.width}
                                             height={currentChildProps.height}>
                                            <g transform={transform}>
                                                <Bar {...currentChildProps}/>
                                                <Xaxis  {...currentChildProps}/>
                                                <Yaxis  {...currentChildProps}/>
                                                <Focus height={singleChartHeight}
                                                       focusX={(currentChildProps.xScaleSet(this.state.focusPoint.x) || -1000) + rangeBand/2}
                                                       focusY={this.getYCoord(currentChildProps.yScaleSet, currentChildProps.data, this.state.focusPoint.x, bisector, configs.name)}
                                                       contentTooltip={{color: configs.color}}/>
                                            </g>
                                        </svg>
                                    </div>
                                );
                            case LINE_CHART:
                                return (
                                    <div key={i}>
                                        <svg ref="svgContainer" width={currentChildProps.width}
                                             height={currentChildProps.height}>
                                            <g transform={transform}>
                                                <Line{...currentChildProps} />
                                                <Voronoid {...currentChildProps} />
                                                <Xaxis  {...currentChildProps} />
                                                <Yaxis  {...currentChildProps} />
                                                <Focus height={singleChartHeight}
                                                       focusX={currentChildProps.xScaleSet(this.state.focusPoint.x) || -1000}
                                                       focusY={this.getYCoord(currentChildProps.yScaleSet, currentChildProps.data, this.state.focusPoint.x, bisector, configs.name)}
                                                       contentTooltip={{color: configs.color}}/>
                                            </g>
                                        </svg>
                                    </div>
                                );
                            case AREA_CHART:
                                return (
                                    <div key={i}>
                                        <svg ref="svgContainer" width={currentChildProps.width}
                                             height={currentChildProps.height}>
                                            <g transform={transform}>
                                                <Area {...currentChildProps} />
                                                <Voronoid {...currentChildProps} />
                                                <Xaxis  {...currentChildProps} />
                                                <Yaxis  {...currentChildProps} />
                                                <Focus height={singleChartHeight}
                                                       focusX={currentChildProps.xScaleSet(this.state.focusPoint.x) || -1000}
                                                       focusY={this.getYCoord(currentChildProps.yScaleSet, currentChildProps.data, this.state.focusPoint.x, bisector, configs.name)}
                                                       contentTooltip={{color: configs.color}}/>
                                            </g>
                                        </svg>
                                    </div>
                                );
                            default:
                                return null;
                        }
                    })
                    }
                    <ZoomingBrush width={this.props.width} height={50}
                                  margins={{top: 20, left: this.props.margins.left, right: this.props.margins.right, bottom: 0}}
                                  domain={brushDomain} scale={brushXScale}
                                  extentUpdated={this.extentUpdated.bind(this)}/>
                </div>
            );
        } else {
            return null;
        }
    }
}

LinkedMultipleChart.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired,
    fieldY: React.PropTypes.array.isRequired,
    margins: React.PropTypes.shape({
        top: React.PropTypes.number.isRequired,
        bottom: React.PropTypes.number.isRequired,
        left: React.PropTypes.number.isRequired,
        right: React.PropTypes.number.isRequired
    }),
    x: React.PropTypes.func.isRequired,
    y: React.PropTypes.func,
    layout: React.PropTypes.string,
    initiated: React.PropTypes.bool,
    categoricalColors: React.PropTypes.func,
    xScale: React.PropTypes.oneOf(['ordinal', 'linear']),
    yScale: React.PropTypes.oneOf(['ordinal', 'linear']),
    xRange: React.PropTypes.array,
    yRange: React.PropTypes.array,
    xDomain: React.PropTypes.array,
    yDomain: React.PropTypes.array,
    xRangeRoundBands: React.PropTypes.shape({
        interval: React.PropTypes.array.isRequired,
        padding: React.PropTypes.number.isRequired
    }),
    yRangeRoundBands: React.PropTypes.object,
    showScatter: React.PropTypes.bool
};

LinkedMultipleChart.defaultProps = Object.assign({}, commonVisProps, {
    xScale: 'linear',
    showScatter: true
});

export default LinkedMultipleChart;
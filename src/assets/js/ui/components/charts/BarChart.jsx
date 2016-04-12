import React from 'react';
import {
    Xaxis,
    Yaxis,
    scale,
    xDomainCount
} from 'react-d3-core';
import {BarGroup} from 'react-d3-shape';
import {yDomainCount} from './../../../includes/ultils';
import {
    commonVisProps,
    GROUPED_BARS
} from './../../constants/visualizations';
import Tooltip from './../../charts/tooltips/Tooltip.jsx';
import ZoomingBrush from './ZoomingBrush.jsx';

class BarChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xTooltip: null,
            yTooltip: null,
            contentTooltip: null,
            data: props.data
        };
    }

    onMouseOver(d, i) {
        const contentTooltip = {title: d.name, value: d.y, fieldTitle: d.x, color: d.color};
        this.setState({
            xTooltip: d3.event.clientX,
            yTooltip: d3.event.clientY,
            contentTooltip: contentTooltip
        });
    }

    onMouseOut(d, i) {
        this.setState({
            xTooltip: null,
            yTooltip: null,
            contentTooltip: null
        });
    }

    extentUpdated(extent) {
        let newData = this.props.data.filter((d) => {
            let scaledX = this.brushXScale(this.props.x(d));
            return (scaledX >= extent[0]) && (scaledX <= extent[1]);
        });

        this.setState({data: newData});
    }

    render() {

        let props = Object.assign({}, this.props, this.state);

        var {
            horizontal,
            height,
            width,
            margins,
            xScale,
            yScale,
            xRange,
            yRange,
            xDomain,
            yDomain,
            xTicks,
            yTicks,
            xTickFormat,
            yTickFormat,
            xRangeRoundBands,
            yRangeRoundBands,
            stack,
            data,
            svgClassName,
            id,
            x,
            y
            } = props;

        var xRange = xRange || [0, width - margins.left - margins.right];
        var yRange = yRange || [height - margins.top - margins.bottom, 0];
        var xRangeRoundBands = xRangeRoundBands || {interval: [0, width - margins.left - margins.right], padding: .1};
        var yRangeRoundBands = yRangeRoundBands || {interval: [0, height - margins.top - margins.bottom], padding: .1};
        var xDomain = xDomainCount(props, stack, horizontal);
        var yDomain = yDomain || yDomainCount(props, stack, horizontal);

        var newXScale = {
            scale: xScale,
            range: xRange,
            domain: xDomain,
            rangeRoundBands: xRangeRoundBands
        };

        var xScaleSet = scale(newXScale);

        var newYScale = {
            scale: yScale,
            range: yRange,
            domain: yDomain,
            rangeRoundBands: yRangeRoundBands
        };

        var yScaleSet = scale(newYScale);

        let transform = `translate(${this.props.margins.left}, ${this.props.margins.top})`;

        let childProps = {
            xScaleSet: xScaleSet,
            yScaleSet: yScaleSet,
            xDomain: xDomain,
            yDomain: yDomain,
            xRange: xRange,
            yRange: yRange,
            xRangeRoundBands: xRangeRoundBands,
            yRangeRoundBands: yRangeRoundBands,
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this)
        };

        let brushDomain = xDomainCount(this.props, stack, horizontal);
        let brushXScale = scale( {
            scale: xScale,
            range: xRange,
            domain: brushDomain,
            rangeRoundBands: xRangeRoundBands
        });
        this.brushXScale = brushXScale;

        if (this.props.initiated) {
            return (
                <div>
                    <Tooltip xTooltip={this.state.xTooltip}
                             yTooltip={this.state.yTooltip}
                             contentTooltip={this.state.contentTooltip}/>
                    <svg ref="svgContainer" width={this.props.width} height={this.props.height}>
                        <g transform={transform}>
                            <BarGroup {...props} {...childProps}/>
                            <Xaxis  {...props} {...childProps}/>
                            <Yaxis  {...props} {...childProps}/>
                        </g>
                    </svg>
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

BarChart.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired,
    chartSeries: React.PropTypes.array.isRequired,
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
    yRangeRoundBands: React.PropTypes.object
};

BarChart.defaultProps = Object.assign({}, commonVisProps, {
    xScale: 'ordinal',
    layout: GROUPED_BARS
});

export default BarChart;

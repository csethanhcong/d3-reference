import React from 'react';

class ZoomingBrush extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            extend: null
        };
    }

    componentDidMount() {
        this.initVis(this.props);
        this.updateVis(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVis(this.props);
    }

    initVis(props) {
        let currentExtend = this.state.extend || (!!this.props.scale.rangeExtent ? this.props.scale.rangeExtent() : this.props.scale.domain());

        let brush = d3.svg.brush()
            .x(this.props.scale)
            .extent(currentExtend)
            .on('brushend', () => {
                let newExtent = brush.empty() ? this.props.domain : brush.extent();
                if (!!this.props.extentUpdated) {
                    this.props.extentUpdated(newExtent);
                }
            });

        let brushGraphic = d3.select(this.refs.main_wrap).append("g")
            .attr("class", "brush")
            .call(brush);

        brushGraphic.selectAll(".extent")
            .attr('fill', '#000')
            .attr('opacity', 0.15);

        brushGraphic.selectAll("rect")
            .attr("height", (this.props.height - this.props.margins.top - this.props.margins.bottom));
    }

    updateVis(props) {

    }

    render() {
        let transform = `translate(${this.props.margins.left}, ${this.props.margins.top})`;
        let chartWidth = this.props.width - this.props.margins.left - this.props.margins.right;
        let chartHeight = this.props.height - this.props.margins.top - this.props.margins.bottom;


        return (
            <svg className="zooming-controller" ref="svg" width={this.props.width} height={this.props.height}>
                <g transform={transform} className="main-wrap" ref="main_wrap">
                    <rect width={chartWidth} height={chartHeight} className="background"
                          fill={this.props.backgroundColor}/>
                </g>
            </svg>
        );
    }
}

ZoomingBrush.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    margins: React.PropTypes.object,
    domain: React.PropTypes.array,
    scale: React.PropTypes.func,
    extentUpdated: React.PropTypes.func
};

ZoomingBrush.defaultProps = {
    backgroundColor: '#ddd',
    domain: []
};

export default ZoomingBrush;
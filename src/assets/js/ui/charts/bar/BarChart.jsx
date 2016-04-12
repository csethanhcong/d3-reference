import React from 'react';
import D3BarChart from './../../../includes/charts/Bar'

class BarChart extends React.Component {

    constructor(props) {
        super(props);
        this.d3Chart = null;
    }

    componentDidMount() {
        this.initVis(this.props);
        this.updateVis(this.props);
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateVis(this.props);
    }

    initVis(props) {
        let g = d3.select(this.refs.svg)
            .select('g.main-wrap');

        let chartWidth = props.width - props.margin.left - props.margin.right;
        let chartHeight = props.height - props.margin.top - props.margin.bottom;

        if (g.empty()) {
            g = d3.select(this.refs.svg).append('g')
                .attr('class', 'main-wrap');
        }

        g.attr('transform', "translate(" + props.margin.left + "," + props.margin.top + ")")
            .attr('width', chartWidth)
            .attr('height', chartHeight);

        this.d3Chart = new D3BarChart(g);


    }

    updateVis(props) {
        let chartWidth = props.width - props.margin.left - props.margin.right;
        let chartHeight = props.height - props.margin.top - props.margin.bottom;

        if (!!this.d3Chart) {
            this.d3Chart.config('width', chartWidth)
                .config('height', chartHeight)
                .config('xAttr', props.fieldX)
                .config('yAttrs', props.fieldY)
                .config('onMouseOut', props.onMouseOut)
                .config('onMouseOver', props.onMouseOver)
                .draw(props.data);
        }
    }

    render() {
        return (
            <svg className="bar-chart" ref="svg" width={this.props.width} height={this.props.height}/>
        );
    }
}

BarChart.propTypes = {
    data: React.PropTypes.any.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    fieldX: React.PropTypes.string.isRequired,
    fieldY: React.PropTypes.array.isRequired,
    transitionDuration: React.PropTypes.number,
    margin: React.PropTypes.object,
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func
};

BarChart.defaultProps = {
    transitionDuration: 500,
    margin: {top: 20, right: 20, bottom: 30, left: 40}
};

export default BarChart;
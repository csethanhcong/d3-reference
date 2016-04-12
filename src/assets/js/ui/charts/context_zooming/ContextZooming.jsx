import React from 'react';
import D3ContextZoomingController from './../../../includes/charts/ContextZoomingController';

class ContextZooming extends React.Component {
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

        this.d3Chart = new D3ContextZoomingController(g);

        if (!!this.props.onSliderUpdated) {
            this.d3Chart.onUpdated(this.props.onSliderUpdated);
        }
    }

    updateVis(props) {
        let chartWidth = props.width - props.margin.left - props.margin.right;
        let chartHeight = props.height - props.margin.top - props.margin.bottom;

        if (!!this.d3Chart) {
            this.d3Chart.config('width', chartWidth)
                .config('extend', this.props.extend)
                .draw(props.data);
        }
    }

    render() {
        return (
            <svg className="zooming-controller" ref="svg" width={this.props.width} height={this.props.height}/>
        );
    }
}

ContextZooming.propTypes = {
    onSliderUpdated: React.PropTypes.func,
    extend: React.PropTypes.array
};

ContextZooming.defaultProps = {
    transitionDuration: 500,
    margin: {top: 20, right: 20, bottom: 0, left: 40}
};

export default ContextZooming;
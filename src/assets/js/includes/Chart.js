import Bar from './charts/Bar';
import Line from './charts/Line';
import Area from './charts/Area';
import BarHistogram from './charts/BarHistogram';
import ContextZoomingController from './charts/ContextZoomingController';

class Chart {
    constructor(d3, area, size, margin) {
        this.d3 = d3;
        this.margin = margin;
        this.width = size.width - margin.left - margin.right;
        this.height = size.height - margin.top - margin.bottom;
        this.svg = d3.select(area).append('svg')
            .attr('width', this.width + margin.left + margin.right)
            .attr('height', this.height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
            .attr('class', 'main-wrap');
        this.area = area;

        var self = this;

        this.charts = {
            bar: () => {
                this.clear();
                return new Bar(this.svg);
            },
            barHistogram: () => {
                this.clear();
                return new BarHistogram(this.svg);
            },
            line: function () {
                return new Line(self.d3, self.svg, self.width, self.height);
            },
            area: function () {
                return new Area(self.d3, self.svg, self.width, self.height);
            }
        };

    }

    clear() {
        this.svg.selectAll("*").remove();

        return this;
    }

    drawZoomingController(data) {

        d3.select(this.area).selectAll('svg.zooming-controller').remove();
        var controllerSvg = d3.select(this.area).append('svg').attr('class', 'zooming-controller')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', 70)
            .append('g')
            .attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");

        this.zoomingController = new ContextZoomingController(controllerSvg);
        this.zoomingController
            .config('width', this.width)
            .draw(data);

        return this.zoomingController;
    }
}

export default Chart;
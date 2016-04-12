class BarHistogram extends Koto {
    constructor(selection) {
        super(selection);

        this.configs = {
            height: {
                name: 'height',
                description: 'The height of the chart.'
            },
            width: {
                name: 'width',
                description: 'The width of the chart.'
            },
            xAttr: {
                name: 'x_attr',
                description: 'The attribute that defines the x axis',
                value: '_index'
            },
            yAttrs: {
                name: 'attr',
                description: 'The selected attribute of the data set to present',
                setter(values) {
                    if (Array.isArray(values)) {
                        return values[0];
                    } else {
                        return values;
                    }
                }
            },
            canContextZoomed: {
                name: 'can_context_zoomed',
                description: 'Can this chart enable context zooming',
                value: false,
                setter() {
                    throw 'This property is read-only';
                }
            },
            transitionDuration: {
                name: 'transition_duration',
                value: 500,
                description: 'Transition duration in millisecond'
            }
        };

        this.accessor('val', (e) => e[this.config('yAttrs')]);

        this.layer('bars', this.base.append('g'), {
                dataBind(data) {
                    return this.selectAll('.bar')
                        .data(data);
                },
                insert() {
                    return this.append('g').attr('class', 'bar');
                }
            })
            .on('enter', selection => {
                selection.attr("transform", (d) => {
                        return "translate(" + this.x(d.x) + "," + this.y(d.y) + ")";
                    })
                    .append('rect')
                    .attr('x', 1)
                    .attr('width', this.barWidth)
                    .attr('height', (d) => (this.config('height') - this.y(d.y)));
            });
    }

    transform(dataset) {
        var data = dataset.column(this.config('yAttrs')).data;

        this.xDomain = d3.extent(data);

        return d3.layout.histogram()
            (data);
    }

    preDraw(data) {
        this.base.attr('class', 'bar-histogram-chart');

        console.log(data);

        this.barWidth = Math.round(this.config('width') / data.length - 1);


        this.x = d3.scale.linear()
            .range([0, this.config('width')])
            .domain(this.xDomain);

        this.y = d3.scale.linear()
            .range([this.config('height'), 0]);

        this.y.domain([0, Math.round(d3.max(data, (d) => d.y) * 1.3)]);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .ticks(data.length)
            .orient("bottom");

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left")
            .ticks(10);

        var xAxis = this.base.select('.axis.x-axis');
        var yAxis = this.base.select('.axis.y-axis');

        if (xAxis.empty()) {
            this.base.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0, " + this.config('height') + ")")
                .call(this.xAxis);
        } else {
            xAxis.transition()
                .call(this.xAxis);

        }

        if (yAxis.empty()) {
            this.base.append("g")
                .attr("class", "axis y-axis")
                .call(this.yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Value");
        } else {
            yAxis.transition()
                .call(this.yAxis);
        }
    }
}

export default BarHistogram;
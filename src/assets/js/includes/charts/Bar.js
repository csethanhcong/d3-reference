class Bar extends Koto {
    constructor(selection) {
        super(selection);

        var chart = this;

        // define configs
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
                name: 'y_attrs',
                description: 'The attributes that defines the "y" values',
                value: ['value'],
                getter() {
                    return Array.isArray(this.value) ? this.value : [this.value];
                }
            },
            canContextZoomed: {
                name: 'can_context_zoomed',
                description: 'Can this chart enable context zooming',
                value: true,
                setter() {
                    throw 'This property is read-only';
                }
            },
            transitionDuration: {
                name: 'transition_duration',
                value: 500,
                description: 'Transition duration in millisecond'
            },
            onMouseOut: {
                description: 'event triggered when mouse is moved out of a bar'
            },
            onMouseOver: {
                description: 'event triggered when mouse is moved over a bar'
            }
        };

        let xAttr = this.config('xAttr');

        this.accessor('x', (e) => e[xAttr]);
        this.accessor('y', (e) => this.config('yAttrs').map((a) => ({
            field: a.name,
            value: e[a.name],
            category: e[xAttr]
        })));

        this.layer('bars', this.base.append('g'), {
                dataBind(data) {
                    return this.selectAll('.bar-group')
                        .data(data, (d) => chart.accessor('x')(d));
                },
                insert() {
                    return this.append('g').attr('class', 'bar-group');
                }
            })
            .on('enter', selection => {
                selection.attr('transform', (d) => ("translate(" + this.x(this.accessor('x')(d)) + ", 0)"));

                selection.selectAll('rect')
                    .data((d) => {
                        let category = this.accessor('x')(d);
                        return this.accessor('y')(d);
                    })
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', (d, i) => this.x1(i))
                    .attr('y', (d) => this.config('height'))
                    .attr('width', this.x1.rangeBand())
                    .attr('height', 0)
                    .style('fill', (d, i) => this.color(i))
                    .on('mouseover', this.config('onMouseOver'))
                    .on('mouseout', this.config('onMouseOut'))
                    .transition().duration(+chart.config('transitionDuration'))
                    .attr('y', (d) => this.y(d.value))
                    .attr('height', (d) => this.config('height') - this.y(d.value));
            })
            .on('exit', selection => {
                selection.selectAll('rect')
                    .transition()
                    .duration(+chart.config('transitionDuration'))
                    .attr('y', (d) => this.config('height'))
                    .attr('height', 0);
            })
            .on('exit:transition', selection => {
                selection.duration(+chart.config('transitionDuration'))
                    .attr('width', 0)
                    .remove();
            })
            .on('update', selection => {
                selection.transition().duration(+chart.config('transitionDuration'))
                    .attr('transform', (d) => ("translate(" + this.x(this.accessor('x')(d)) + ", 0)"));

                var subset = selection.selectAll('rect.bar')
                    .data((d) => {
                        return this.accessor('y')(d)
                    });

                // update
                subset
                    .transition().duration(+chart.config('transitionDuration'))
                    .attr('x', (d, i) => this.x1(i))
                    .attr('y', (d) => this.y(d.value))
                    .attr('width', this.x1.rangeBand())
                    .attr('height', (d) => this.config('height') - this.y(d.value))
                    .style('fill', (d, i) => this.color(i));

                // enter
                subset
                    .enter().append('rect')
                    .attr('class', 'bar')
                    .attr('x', (d, i) => this.x1(i))
                    .attr('y', (d) => this.config('height'))
                    .attr('width', this.x1.rangeBand())
                    .attr('height', 0)
                    .style('fill', (d, i) => this.color(i))
                    .on('mouseover', this.config('onMouseOver'))
                    .on('mouseout', this.config('onMouseOut'))
                    .transition().duration(+chart.config('transitionDuration'))
                    .attr('y', (d) => this.y(d.value))
                    .attr('height', (d) => this.config('height') - this.y(d.value));

                subset
                    .exit()
                    .remove();
            });
    }

    transform(dataset) {
        return dataset.columns([this.config('xAttr')].concat(this.config('yAttrs').map(e => e.name))).toJSON();
    }

    preDraw(data) {
        this.x = d3.scale.ordinal()
            .rangeRoundBands([0, this.config('width')], '.1');

        this.y = d3.scale.linear()
            .range([this.config('height'), 0]);

        this.color = d3.scale.ordinal().range(this.config('yAttrs').map((e) => e.color));

        this.x.domain(data.map((d) => this.accessor('x')(d)));
        this.y.domain([0, Math.round(
            d3.max(
                data,
                (d) => d3.max(
                    this.accessor('y')(d),
                    (v) => v.value
                )
            ) * 1.3
        )]);

        this.x1 = d3.scale.ordinal()
            .domain(this.config('yAttrs').map((d, i) => i))
            .rangeRoundBands([0, this.x.rangeBand()]);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .tickFormat((_) => "")
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

export default Bar;
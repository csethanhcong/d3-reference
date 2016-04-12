class ContextZoomingController extends Koto {
    constructor(selection) {
        super(selection);

        var chart = this;

        this.configs = {
            height: {
                name: 'height',
                value: 30,
                description: 'The height of the controller'
            },
            width: {
                name: 'width',
                description: 'The width of the chart'
            },
            backgroundColor: {
                name: 'background_color',
                value: '#ddd',
                description: 'The controller background color'
            },
            brushColor: {
                name: 'brush_color',
                value: '#000',
                description: 'The main color of the brush'
            },
            brushOpacity: {
                name: 'brush_opacity',
                value: 0.15,
                description: 'The opacity of the brush'
            },
            xAttr: {
                name: 'x_attr',
                description: 'The attribute that defines the x axis',
                value: '_index'
            },
            extend: {
                description: 'The current extend'
            }
        };

        this.callbacks = {
            updated: []
        };

        this.accessor('x', (e) => e[this.config('xAttr')]);
    }

    onUpdated(f) {
        this.callbacks.updated.push(f);
    }

    transform(dataset) {
        return dataset.columns([this.config('xAttr')]).toJSON();
    }

    preDraw(data) {
        this.base.attr('class', 'context-zoom-controller');

        this.x = d3.scale.linear()
            .range([0, this.config('width')])
            .domain(d3.extent(data, (d) => this.accessor('x')(d)));

        this.base.append("rect")
            .attr("class", "grid-background")
            .attr("width", +this.config('width'))
            .attr("height", +this.config('height'))
            .style('fill', this.config('backgroundColor'));

        this.base.append("g")
            .attr("class", "x grid")
            .style('fill', 'none')
            .attr("transform", "translate(0," + this.config('height') + ")")
            .call(d3.svg.axis()
                .scale(this.x)
                .orient("bottom")
                .ticks(data.length)
                .tickSize(-this.config('height'))
                .tickFormat(""))
            .selectAll('.tick')
            .attr('stroke', '#fff')
            .attr('opacity', 0.5);

        let currentExtend = this.config('extend');
        if (!currentExtend) {
            currentExtend = this.x.domain();
        }

        var brush = d3.svg.brush()
            .x(this.x)
            .extent(currentExtend);

        brush.on("brush", function () {
            var extent0 = brush.extent(),
                extent1;

            // if dragging, preserve the width of the extent
            if (d3.event.mode === "move") {
                var d0 = Math.round(extent0[0]),
                    d1 = Math.round(extent0[1]);
                extent1 = [d0, d1];
            }

            // otherwise, if resizing, round both dates
            else {
                extent1 = extent0.map(Math.round);
            }

            d3.select(this).call(brush.extent(extent1));
        });

        brush.on('brushend', () => {
            this.callbacks.updated.forEach((f) => {
                f.call(this, brush.extent());
            });
        });

        var brushGraphic = this.base.append("g")
            .attr("class", "brush")
            .call(brush);


        var arc = d3.svg.arc()
            .outerRadius(+this.config('height') / 4)
            .startAngle(0)
            .endAngle(function (d, i) {
                return i ? -Math.PI : Math.PI;
            });

        brushGraphic.selectAll("rect")
            .attr("height", +this.config('height'));

        brushGraphic.selectAll(".extent")
            .attr('fill', this.config('brushColor'))
            .attr('opacity', this.config('brushOpacity'));

        brushGraphic.selectAll(".resize").append("path")
            .attr("transform", "translate(0," + (+this.config('height') / 2) + ")")
            .style('fill', '#666')
            .style('stroke', '#000')
            .attr("d", arc);
    }
}

export default ContextZoomingController;
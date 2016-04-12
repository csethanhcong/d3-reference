class Area {
    constructor(d3, svg, width, height) {
        this.d3 = d3;
        this.svg = svg;
        this.width = width;
        this.height = height;

        this.x = d3.scale.linear()
            .range([0, width]);
        this.y = d3.scale.linear()
            .range([height, 0]);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom");

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left")
            .ticks(10);

    }

    draw(data) {
        this.svg.attr('class', 'areachart');

        data = data.map(function (e, i) {
            if (typeof e.value != 'undefined') {
                return {name: (i), value: e.value};
            } else {
                return {name: (i), value: e};
            }
        });

        this.x.domain([0, data.length - 1]);

        this.y.domain([0, this.d3.max(data, function (d) {
            return d.value;
        })]);

        var self = this;
        var xAxis = this.svg.select(".axis.x-axis");
        var yAxis = this.svg.select(".axis.y-axis");

        this.area = this.d3.svg.area().interpolate("monotone")
            .x(function (d) {
                return self.x(d.name);
            })
            .y0(self.height)
            .y1(function (d) {
                return self.y(d.value);
            });

        if (xAxis.empty()) {
            this.svg.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0, " + self.height + ")")
                .call(self.xAxis);
        } else {
            xAxis.transition()
                .call(self.xAxis);

        }

        if (yAxis.empty()) {
            this.svg.append("g")
                .attr("class", "axis y-axis")
                .call(self.yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Value");
        } else {
            yAxis.transition()
                .call(self.yAxis);
        }

        var area = this.svg.selectAll('.area')
            .data([data])
            .attr('class', 'area');

        area.enter()
            .append('path')
            .attr('class', 'area')
            .attr('d', self.area);

        area.transition()
            .attr('d', self.area);

        area.exit().remove();
    }
}

export default Area;
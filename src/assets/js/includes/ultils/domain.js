export function yDomainCount(props, stack, horizonal) {
    const {
        data,
        chartSeries,
        y,
        yDomain,
        yDomainCompact
        } = props;

    if (yDomain)
        return yDomain;

    if (!horizonal) {
        if (stack) {
            // stack
            var max = 0;
            var min = 0;

            data.forEach((d) => {
                var totalTop = 0;
                var totalBottom = 0;

                chartSeries.forEach((sd) => {
                    var field = sd.field;

                    if (d[field] > 0) {
                        totalTop += y(d[field]);
                    } else if (d[field] < 0) {
                        totalBottom += y(d[field]);
                    }
                });

                if (totalTop > max) max = totalTop;
                if (totalBottom < min) min = totalBottom;
            });

            return [min, max];
        } else {
            // not stack, single
            var domainArr = chartSeries.map((d) => {
                var field = d.field;
                var extent = d3.extent(data, (dt) => {
                    return y(dt[field]);
                });

                return extent;
            });

            let returnedExtend = d3.extent([].concat.apply([], domainArr));
            if (!yDomainCompact) {
                returnedExtend[0] = 0;
            }

            return returnedExtend;
        }
    } else {
        if (yScale === 'ordinal') {
            return data.map((d) => {
                return y(d);
            });
        } else {
            return d3.extent(data, (d) => {
                return y(d);
            });
        }
    }
}

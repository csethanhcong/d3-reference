export const BAR_CHART = 'BAR_CHART';
export const GROUPED_BARS = 'GROUP_BAR_CHART';
export const barChartSpec = {
    name: BAR_CHART,
    configs: {
        fieldX: '',
        fieldY: [],
        showBrush: true,
        multipleBars: GROUPED_BARS
    }
};

export const LINE_CHART = 'LINE_CHART';
export const lineChartSpec = {
    name: LINE_CHART,
    configs: {
        fieldX: '',
        fieldY: [],
        showBrush: true
    }
};

export const AREA_CHART = 'AREA_CHART';
export const SEPARARED_AREA = 'SEPARATED_AREA';
export const areaChartSpec = {
    name: AREA_CHART,
    configs: {
        fieldX: '',
        fieldY: [],
        showBrush: true
    }
};

export const LINKED_MULTIPLE_CHART = 'LINKED_MULTIPLE_CHART';
export const linkedMultipleChartSpec = {
    name: LINKED_MULTIPLE_CHART,
    configs: {
        fieldX: '',
        fieldY: [],
        showBrush: true
    }
};

export const commonVisProps = {
    initiated: false,
    margins: {top: 20, right: 20, bottom: 30, left: 60},
    yScale: 'linear',
    y: (d) => (+d)
};

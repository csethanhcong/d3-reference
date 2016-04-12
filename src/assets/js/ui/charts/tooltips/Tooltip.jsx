import React from 'react';
import SimpleToolTip from './SimpleTooltip.jsx';
class Tooltip extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            xTooltip,
            yTooltip,
            contentTooltip,
            dist
            } = this.props;

        let contentTooltipTmpl;

        var style = {
            left: xTooltip ? xTooltip + dist : -10000,
            top: yTooltip ? yTooltip + dist : -10000,
            position: 'fixed'
        };

        if (contentTooltip) {
            contentTooltipTmpl = <SimpleToolTip contentTooltip={contentTooltip}/>;
        }

        return (
            <div
                style={style}
            >
                {contentTooltipTmpl}
            </div>
        )
    }
}

Tooltip.defaultProps = {
    gravity: 's',
    dist: 15
};

export default Tooltip;
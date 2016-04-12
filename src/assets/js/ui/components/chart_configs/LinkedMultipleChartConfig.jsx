import React from 'react';
import ColorPicker from 'react-color';
import {Button} from 'react-bootstrap';
import * as Visualizations from './../../constants/visualizations';

class LinkedMultipleChartConfig extends React.Component {
    constructor(props) {
        super(props);

        let defaults = {
            fieldX: '',
            fieldY: []
        };

        this.state = Object.assign(defaults, this.props.initData);
    }

    save() {
    }

    _addAnotherSeries() {
        let currentNumSeries = this.state.fieldY.length;
        let newSeriesField = '';
        let newSeriesColor = this.props.seriesColors[currentNumSeries];
        let newSeries = {
            name: newSeriesField,
            color: newSeriesColor,
            type: Visualizations.AREA_CHART
        };

        this.setState({fieldY: this.state.fieldY.concat([newSeries])});
    }

    _removeSeries(i) {
        return (e) => {
            let head = this.state.fieldY.slice(0, i);
            let tail = this.state.fieldY.slice(i + 1);
            this.setState({fieldY: [...head, ...tail]});
        };
    }

    _updateSeriesField(i) {
        return ((e) => {
            let newValue = this.state.fieldY.concat([]);
            newValue[i].name = e.target.value;
            this.setState({fieldY: newValue});
        });
    }

    _updateSeriesColor(i) {
        return ((color) => {
            let newValue = this.state.fieldY.concat([]);
            newValue[i].color = `#${color.hex}`;
            this.setState({fieldY: newValue});
        });
    }

    _updateSeriesType(i) {
        return (e) => {
            let newValue = this.state.fieldY.concat();
            newValue[i].type = e.target.value;
            this.setState({fieldY: newValue});
        };
    }

    _openSeriesColorPicker(i) {
        let newState = {};
        newState[`showPicker${i}`] = true;
        this.setState(newState);
    }

    _closeSeriesColorPicker(i) {
        let newState = {};
        newState[`showPicker${i}`] = false;
        this.setState(newState);
    }

    getConfigs() {
        return {
            fieldX: this.state.fieldX,
            fieldY: this.state.fieldY,
            multipleBars: this.state.multipleBars,
            showBrush: this.state.showBrush
        }
    }

    render() {
        return (
            <div>
                <div className="form-group">
                    <label>Property for the X axis:</label>
                    <input type="text" value={this.state.fieldX} className="form-control"
                           onChange={(e) => {this.setState({fieldX: e.target.value})}}/>
                </div>
                {
                    this.state.fieldY.map((f, j) => (
                        <div className="form-group" key={j}>
                            <label>#{j + 1} serie:</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <input type="text" value={f.name} className="form-control"
                                           onChange={this._updateSeriesField(j)}/>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-control" value={f.type}
                                            onChange={this._updateSeriesType(j)}>
                                        <option value={Visualizations.BAR_CHART}>Bar</option>
                                        <option value={Visualizations.LINE_CHART}>Line</option>
                                        <option value={Visualizations.AREA_CHART}>Area</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <Button bsStyle="default" onClick={this._openSeriesColorPicker.bind(this, j)}>
                                        <span
                                            style={{backgroundColor: f.color}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </Button>
                                    <Button bsStyle="link" onClick={this._removeSeries(j)}>
                                        <i className="fa fa-remove"></i>
                                    </Button>
                                    <ColorPicker type="chrome" display={!!this.state[`showPicker${j}`]} color={f.color}
                                                 onChangeComplete={this._updateSeriesColor(j)}
                                                 onClose={this._closeSeriesColorPicker.bind(this, j)}/>
                                </div>
                            </div>

                        </div>
                    ))
                }
                <a className="btn btn-link" onClick={this._addAnotherSeries.bind(this)}>Add another serie</a>
            </div>
        );

    }
}

LinkedMultipleChartConfig.propTypes = {
    initData: React.PropTypes.object
};

LinkedMultipleChartConfig.defaultProps = {
    seriesColors: d3.scale.category10().range()
};

export default LinkedMultipleChartConfig;
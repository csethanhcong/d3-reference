import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import * as DataSources from './../constants/dataSources';
import * as Visualizations from './../constants/visualizations';
import DirectInput from './../components/data_sources/DirectInput.jsx';
import LocalFile from './../components/data_sources/LocalFile.jsx';
import BarChartConfig from './../components/chart_configs/BarChartConfig.jsx';
import AreaChartConfig from './../components/chart_configs/AreaChartConfig.jsx';
import LineChartConfig from './../components/chart_configs/LineChartConfig.jsx';
import LinkedMultipleChartConfig from './../components/chart_configs/LinkedMultipleChartConfig.jsx';

class AppModal extends React.Component {
    _renderBody() {
        switch (this.props.bodyType) {
            case DataSources.DIRECT_INPUT:
                return (<DirectInput ref='modal_body' initData={this.props.bodyInitState}/>);
            case DataSources.FILE_INPUT:
                return (<LocalFile ref='modal_body'/>);

            case  Visualizations.BAR_CHART:
                return (<BarChartConfig ref='modal_body' initData={this.props.bodyInitState}/>);

            case Visualizations.AREA_CHART:
                return (<AreaChartConfig ref="modal_body" initData={this.props.bodyInitState}/>);

            case Visualizations.LINE_CHART:
                return (<LineChartConfig ref="modal_body" initData={this.props.bodyInitState}/>);

            case Visualizations.LINKED_MULTIPLE_CHART:
                return (<LinkedMultipleChartConfig ref="modal_body" initData={this.props.bodyInitState}/>);

            default:
                return null;
        }
    }

    _onOk() {
        if (!!this.props.bodyType) {
            let result = this.refs.modal_body.save();
            let configs = this.refs.modal_body.getConfigs();
            this.props.onUpdated(this.props.bodyType, configs, result);
        }
        this.props.onClosed();
    }

    render() {
        return (
            <Modal show={this.props.isShown} onHide={this.props.onClosed.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this._renderBody()}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onClosed.bind(this)}>
                        Close
                    </Button>
                    <Button bsStyle="primary" onClick={this._onOk.bind(this)}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

AppModal.propTypes = {
    title: React.PropTypes.string,
    bodyType: React.PropTypes.string,
    bodyInitState: React.PropTypes.object,
    onClosed: React.PropTypes.func.isRequired,
    onUpdated: React.PropTypes.func,
    isShown: React.PropTypes.bool.isRequired
};

export default AppModal;

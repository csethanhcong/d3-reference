import React from 'react';

export default React.createClass({
    getInitialState() {
        return {
            content: this.props.initData ? this.props.initData.content : ''
        };
    },

    save() {
        let json = null;
        try {
            json = JSON.parse(this.state.content);
        } catch (e) {
            console.log(e);
        }
        return json;
    },

    getConfigs() {
        return {
            content: this.state.content
        };
    },
    _onContentUpdated(event) {
        this.setState({content: event.target.value});
    },

    render() {
        return (
            <div className="form-group">
                <label>Enter the data into this textarea</label>
                <textarea className="form-control" value={this.state.content}
                          onChange={this._onContentUpdated}/>
            </div>
        );
    }
});
import React from 'react';

export default React.createClass({
    getInitialState() {
        return {
            fileName: 'Choose a JSON file',
            file: null
        }
    },

    save() {
        if (!!this.state.file) {
            return (onSuccess) => {
                let json = null;
                try {
                    let reader = new FileReader();
                    reader.onload = (e) => {
                        json = JSON.parse(e.target.result);
                        onSuccess(json);
                    };
                    reader.readAsText(this.state.file);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    },

    getConfigs() {
        return {
            fileName: this.state.fileName,
            file: this.state.file
        };
    },

    _handleFileChanged(e) {
        var filename = e.target.value.split('\\').pop();
        var files = e.target.files;
        if (filename) {
            this.setState({fileName: filename, file: files[0]});
        } else {
            this.setState({fileName: "Choose a JSON file", file: null});
        }
    },

    render() {
        return (
            <div className="form-group">
                <label>
                    Input file
                </label>
                <p className="help-text"><a href="https://www.mockaroo.com" target="_blank">Get a random
                    JSON file</a></p>
                <input id="json-file" className="file-btn" type="file" onChange={this._handleFileChanged}/>
                <label htmlFor="json-file">{this.state.fileName}</label>
            </div>
        );
    }
});
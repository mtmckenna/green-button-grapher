import React, { Component } from 'react';

export default class FileOpener extends Component {
  constructor(props) {
    super(props);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handleFileLoaded = this.handleFileLoaded.bind(this);
  }

  handleFileSelected(event) {
    let files = event.target.files;
    let reader = new FileReader();
    reader.onloadend = this.handleFileLoaded;
    reader.readAsText(files[0]);
    this.props.handleFileSelected(event);
  }

  handleFileLoaded(event) {
    let xmlString = event.target.result;
    this.props.handleFileLoaded(xmlString);
  }

  render() {
    return (
      <div>
        <h3>Open your GreenButton data:</h3>
        <div>
          <input type="file" onChange={this.handleFileSelected}></input>
        </div>
      </div>
    );
  }
}

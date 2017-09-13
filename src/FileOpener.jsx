import React, { Component } from 'react';

export default class FileOpener extends Component {
  handleFileSelected = (event) => {
    let files = event.target.files;
    let reader = new FileReader();
    reader.onloadend = this.handleFileLoaded;
    reader.readAsText(files[0]);
    this.props.handleFileSelected(event);
  }

  handleFileLoaded = (event) => {
    let xmlString = event.target.result;
    this.props.handleFileLoaded(xmlString);
  }

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={this.handleFileSelected}></input>
        </div>
      </div>
    );
  }
}

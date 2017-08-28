/* global app, $ */

import React, { Component } from 'react';

export default class FileOpener extends Component {
  constructor(props) {
    super(props);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handleFileLoaded = this.handleFileLoaded.bind(this);
  }

  handleFileSelected(event) {
    $('#loading-box').show();
    let files = event.target.files;
    let reader = new FileReader();
    reader.onloadend = this.handleFileLoaded;
    reader.readAsText(files[0]);
  }

  handleFileLoaded(event) {
    let xmlString = event.target.result;
    app.parseGreenButtonXml(xmlString);
    $('#loading-box').hide();
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

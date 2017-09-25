import React, { Component } from 'react';
import './FileOpener.css';

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
      <div className='file-opener'>
        <input type="file" onChange={this.handleFileSelected}></input>
      </div>
    );
  }
}

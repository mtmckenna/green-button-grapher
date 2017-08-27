import React, { Component } from 'react';

export default class FileOpener extends Component {
  render() {
    return (
      <div id="open-file">
        <h3>Open your GreenButton data:</h3>
        <div id="file-upload">
          <input type="file" id="files" name="files[]"></input>
        </div>
      </div>
    );
  }
}

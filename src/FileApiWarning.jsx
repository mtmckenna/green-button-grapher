import React, { Component } from 'react';

export default class FileApiWarning extends Component {
  render() {
    return (
      <div id="file-api-alert">
        <strong>Sorry!</strong> Your web browser doesn't support HTML 5 file uploads.
        If you'd like to graph your own Green Button data, please try using either <a href="https://www.google.com/chrome">Google Chrome</a> or
        <a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>.
      </div>
    );
  }
}


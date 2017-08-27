import React, { Component } from 'react';

export default class Results extends Component {
  render() {
    return (
      <div>
        <div>
          <div id="total"></div>
          <div id="total-peak"></div>
        </div>
        <div id="amount-saved">
          <div id="total-saved"></div>
          <div id="total-peak-saved"></div>
        </div>
      </div>
    );
  }
}

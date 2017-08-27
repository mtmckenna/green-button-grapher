import React, { Component } from 'react';
import './Graph.css';

export default class Graph extends Component {
  render() {
    return (
      <div className="gbd-graph">
        <div id="graph-wrapper">
          <div id="graph"></div>
          <div id="loading-box"><h1>Loading...</h1></div>
        </div>
      </div>
    );
  }
}

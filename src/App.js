import React, { Component } from 'react';
import './App.css';
import TimeButtons from './TimeButtons';
import Graph from './Graph';
import Slider from './Slider';
import Results from './Results';
import FileOpener from './FileOpener';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div id="address"></div>
        <TimeButtons />
        <Graph />
        <Slider />
        <Results />
        <div id="legend-peak"></div> Peak time
        <FileOpener />
      </div>
    );
  }
}

export default App;

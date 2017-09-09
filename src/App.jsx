import React, { Component } from 'react';

import './App.css';
import ChartButtons from './ChartButtons';
import Graph from './Graph';
import Slider from './Slider';
import FileOpener from './FileOpener';
import FileApiWarning from './FileApiWarning';
import sampleData from './sample-data';
import chartTypes from './chart-types';
import dataViewTypes from './data-view-types';
import GreenButtonJson from './green-button-json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      greenButtonJson: {},
      multiplier: 1.0,
      chartType: chartTypes.COST,
      dataViewType: dataViewTypes.AVG_DAY,
      loading: true
    };
  }

  componentDidMount() {
    this.handleFileLoaded(sampleData);
  }

  get hasFileApi() {
    return !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob;
  }

  handleFileLoaded = (xml) => {
    this.parseGreenButtonXml(xml);
    this.setState({ loading: false });
  }

  handleFileSelected = () => {
    this.setState({ loading: true });
  }

  handleSliderMoved = (event) => {
    const multiplier = Number(event.currentTarget.value);
    this.setState({ multiplier: multiplier });
  }

  parseGreenButtonXml = function(xmlString) {
    let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
    this.greenButtonJson = new GreenButtonJson(xml);
    this.setState({
      greenButtonJson: this.greenButtonJson,
      address: this.greenButtonJson.address
    });
  }

  render() {
    if (!this.hasFileApi) return <FileApiWarning />;

    return (
      <div className="App">
        <div id="address">{this.state.address}</div>
        <Graph
          loading={this.state.loading}
          multiplier={this.state.multiplier}
          greenButtonJson={this.state.greenButtonJson}
        />
        <Slider
          multiplier={this.state.multiplier}
          handleSliderMoved={this.handleSliderMoved}
        />
        <ChartButtons />
        <FileOpener
          handleFileSelected={this.handleFileSelected}
          handleFileLoaded={this.handleFileLoaded}
        />
      </div>
    );
  }
}

export default App;

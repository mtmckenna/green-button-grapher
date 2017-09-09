import React, { Component } from 'react';

import './App.css';
import ChartButtons from './ChartButtons';
import Graph from './Graph';
import Slider from './Slider';
import FileOpener from './FileOpener';
import FileApiWarning from './FileApiWarning';
import sampleData from './sample-data';
import chartTypes from './chart-types';
import timeCut from './time-cuts';
import GreenButtonJson from './green-button-json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      greenButtonJson: {},
      multiplier: 1.0,
      chartType: chartTypes.COST,
      timeCut: timeCut.AVG_DAY,
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

  parseGreenButtonXml = (xmlString) => {
    let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
    this.greenButtonJson = new GreenButtonJson(xml);
    this.setState({
      greenButtonJson: this.greenButtonJson,
      address: this.greenButtonJson.address
    });
  }

  changeChartType = (chartType) => {
    this.setState({ chartType: chartType });
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
          chartType={this.state.chartType}
        />
        <Slider
          multiplier={this.state.multiplier}
          handleSliderMoved={this.handleSliderMoved}
        />
        <ChartButtons
          changeChartType={this.changeChartType}
        />
        <FileOpener
          handleFileSelected={this.handleFileSelected}
          handleFileLoaded={this.handleFileLoaded}
        />
      </div>
    );
  }
}

export default App;

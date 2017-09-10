import React, { Component } from 'react';

import './App.css';
import ChartButtons from './ChartButtons';
import GraphContainer from './GraphContainer';
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

  handleFileLoaded = (xmlString) => {
    let greenButtonJson = greenButtonJsonFromXmlString(xmlString);
    this.setState({
      loading: false,
      address: greenButtonJson.address,
      intervals: greenButtonJson.intervals
    });
  }

  handleFileSelected = () => {
    this.setState({ loading: true });
  }

  handleSliderMoved = (event) => {
    const multiplier = Number(event.currentTarget.value);
    this.setState({ multiplier: multiplier });
  }

  changeChartType = (chartType) => {
    this.setState({ chartType: chartType });
  }

  render() {
    if (!this.hasFileApi) return <FileApiWarning />;
    if (this.state.loading) return <div>Loading...</div>;

    return (
      <div className="App">
        <div id="address">{this.state.address}</div>
        <GraphContainer
          intervals={this.state.intervals}
          multiplier={this.state.multiplier}
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

function greenButtonJsonFromXmlString(xmlString) {
  let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
  return new GreenButtonJson(xml);
}

export default App;

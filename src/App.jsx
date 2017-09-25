import React, { Component } from 'react';

import './App.css';
import ChartButtons from './ChartButtons';
import GraphContainer from './GraphContainer';
import Slider from './Slider';
import FileOpener from './FileOpener';
import FileApiWarning from './FileApiWarning';
import sampleData from './sample-data';
import GreenButtonJson from './green-button-json';
import INITIAL_APP_STATE from './initial-app-state';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_APP_STATE;
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

  handleSliderMoved = (multiplier) => {
    this.setState({ multiplier: multiplier });
  }

  changeChartType = (chartType) => {
    this.setState({ chartType: chartType });
  }

  changeTimeCut = (timeCut) => {
    this.setState({ timeCut: timeCut });
  }

  render() {
    if (!this.hasFileApi) return <FileApiWarning />;
    if (this.state.loading) return <div className="loading">Loading...</div>;

    return (
      <div className="App">
        <div className="address"><h1>Green Button Data for {this.state.address}</h1></div>
        <GraphContainer
          intervals={this.state.intervals}
          multiplier={this.state.multiplier}
          chartType={this.state.chartType}
          timeCut={this.state.timeCut}
        />
        <Slider
          multiplier={this.state.multiplier}
          handleSliderMoved={this.handleSliderMoved}
        />
        <ChartButtons
          changeChartType={this.changeChartType}
          changeTimeCut={this.changeTimeCut}
          currentChartType={this.state.chartType}
          currentTimeCut={this.state.timeCut}
        />
        <FileOpener
          handleFileSelected={this.handleFileSelected}
          handleFileLoaded={this.handleFileLoaded}
        />
        <div className="source-code">
          <a href="https://github.com/mtmckenna/green-button-grapher">Green Button Grapher source code</a>
        </div>
      </div>
    );
  }
}

function greenButtonJsonFromXmlString(xmlString) {
  let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
  return new GreenButtonJson(xml);
}

export default App;

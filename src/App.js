import React, { Component } from 'react';

import './App.css';
import ChartButtons from './ChartButtons';
import Graph from './Graph';
import Slider from './Slider';
import Results from './Results';
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
      results: { total: 0, totalPeak: 0, totalSaved: 0, totalSavedPeak: 0 },
      data: { starts: [], values: [], costs: [] },
      chartType: chartTypes.COST,
      dataViewType: dataViewTypes.AVG_DAY,
      loading: true
    };
    this.handleFileLoaded = this.handleFileLoaded.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handleSliderMoved = this.handleSliderMoved.bind(this);
    this.parseGreenButtonXml = this.parseGreenButtonXml.bind(this);
    this.greenButtonJson = new GreenButtonJson();
  }

  componentDidMount() {
    this.handleFileLoaded(sampleData);
  }

  get hasFileApi() {
    return !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob;
  }

  handleFileLoaded(xml) {
    this.parseGreenButtonXml(xml);
    this.setState({ loading: false });
  }

  handleFileSelected() {
    this.setState({ loading: true });
  }

  handleSliderMoved(event) {
    //this.parsedData.updateTheoValues(event.currentTarget.value/100);
  }

  parseGreenButtonXml(xmlString) {
    let xml = new DOMParser().parseFromString(xmlString, 'text/xml');
    this.greenButtonJson = new GreenButtonJson(xml);
    this.setState({
      address: this.greenButtonJson.address,
      data: this.greenButtonJson.chartFormattedIntervals
    });

    this.setState({
      results: {
        total: this.greenButtonJson.total,
        totalPeak: this.greenButtonJson.totalPeak,
        totalTheoretical: 0,
        totalPeakTheoretical: 0
      }
    });
  }

  render() {
    if (!this.hasFileApi) return <FileApiWarning />;

    return (
      <div className="App">
      <div id="address">{this.state.address}</div>
      <Graph
      loading={this.state.loading}
      values={this.state.data.costs}
      labels={this.state.data.starts}
      />
      <Slider handleSliderMoved={this.handleSliderMoved} />
      <Results {...this.state.results} />
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

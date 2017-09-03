import React, { Component } from 'react';
import $ from 'jquery';

import ParsedData from './ParsedData';
import './App.css';
import TimeButtons from './TimeButtons';
import Graph from './Graph';
import Slider from './Slider';
import Results from './Results';
import FileOpener from './FileOpener';
import FileApiWarning from './FileApiWarning';
import SampleData from './SampleData';

import port from './port';
const BASE = process.env.BROWSER? '': `http://localhost:${port()}`;
const TEST_DATA_URL = `${BASE}/data/pge_sample_data2.xml`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFileLoaded = this.handleFileLoaded.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handleSliderMoved = this.handleSliderMoved.bind(this);
    this.parseGreenButtonXml = this.parseGreenButtonXml.bind(this);
    this.parsedData = Object.assign({}, ParsedData);
  }

  componentDidMount() {
    this.configureState();
    this.handleFileLoaded(SampleData);
  }

  get hasFileApi() {
    return !!window.File && !!window.FileReader && !!window.FileList && !!window.Blob;
  }

  loadTestData() {
    return fetch(TEST_DATA_URL)
      .then((response) => response.text());
  }

  configureState() {
    for (var i = 0; i <= 23; i++) {
      this.parsedData.hours.push(i);
    }

    // Handle button clicks from the time-range bar
    $('#time-range-btn-group').click((e) => { this.parsedData.handleTimeRangeButtons(e); });

    // Handle button clicks from the time-range bar
    $('#avg-btn-group').click((e) => { this.parsedData.handleAvgButtons(e); });

    // Turn slider classes into jQuery UI sliders
    //$('.slider').slider({ range: 'min' });
    //$('#slider').slider('value', 50);

    /*$('#slider').slider({
      slide: function(event, ui) { this.parsedData.sliderWasSlid(event, ui); }
    });*/
  }

  handleFileLoaded(xml) {
    this.parseGreenButtonXml(xml);
    $('#averages').click();
    $('#loading-box').hide();
  }

  handleFileSelected() {
    $('#loading-box').show();
  }

  handleSliderMoved(event) {
    this.parsedData.sliderWasSlid(event);
  }

  parseGreenButtonXml(xml) {
    var intervals = $(xml).find('IntervalReading');
    var address = $($(xml).find('entry > title')[0]).text();
    this.setState({address: address});

    this.parsedData.readings = [];
    this.parsedData.theoReadings = [];
    var totalCost = 0;
    for (var i = 0; i < intervals.length; i++) {
      var start = $($(intervals[i]).find('start')).text() * 1000;
      var cost = Number($($(intervals[i]).find('cost')).text()) / 100000;
      var value = $($(intervals[i]).find('value')).text();
      totalCost += cost;

      this.parsedData.readings.push({'start': start,
        'value': Number(value),
        'cost': Number(cost)});
    }

    // I think the readings will be sorted from the get-go, but
    // might as well make sure...
    this.parsedData.readings.sort(this.parsedData.sortReadingsByStart);

    this.parsedData.xMin = this.parsedData.readings[0]['start'];
    this.parsedData.xMax = this.parsedData.readings[this.parsedData.readings.length - 1]['start'];

    this.parsedData.setCurrentReadings(this.parsedData.readings);

    if (totalCost === 0) {
      this.parsedData.readingType = 'value';
    } else {
      this.parsedData.readingType = 'cost';
    }
  }

  render() {
    if (!this.hasFileApi) return <FileApiWarning />;

    return (
      <div className="App">
      <div id="address">{this.state.address}</div>
      <TimeButtons />
      <Graph />
      <Slider handleSliderMoved={this.handleSliderMoved} />
      <Results />
      <div id="legend-peak"></div> Peak time
      <FileOpener
      handleFileSelected={this.handleFileSelected}
      handleFileLoaded={this.handleFileLoaded}
      />
      </div>
    );
  }
}

export default App;

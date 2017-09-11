import React, { Component } from 'react';
import Graph from './Graph';
import Results from './Results';
import ChartData from './chart-data';

export default class GraphContainer extends Component {
  get chartData() {
    return chartDataFromProps(this.props);
  }

  render() {
    return (
      <div>
        <Graph chartData={this.chartData} />
        <Results
          chartType={this.props.chartType}
          {...this.chartData.results}
        />
      </div>
    );
  }
}

function chartDataFromProps(props) {
  return new ChartData(props.intervals, props.chartType, props.multiplier);
}


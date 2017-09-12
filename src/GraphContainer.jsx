import React, { Component } from 'react';
import Graph from './Graph';
import Results from './Results';
import ChartData from './chart-data';

export default class GraphContainer extends Component {
  render() {
    const chartData = chartDataFromProps(this.props);

    return (
      <div>
        <Graph chartData={chartData} />
        <Results
          chartType={this.props.chartType}
          {...chartData.results}
        />
      </div>
    );
  }
}

function chartDataFromProps(props) {
  return new ChartData(props.intervals, props.chartType, props.timeCut, props.multiplier);
}


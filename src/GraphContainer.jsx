import React, { Component } from 'react';
import Graph from './Graph';
import Results from './Results';
import ChartData from './chart-data';

export default class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { chartData: chartDataFromProps(props) };
  }

  componentWillReceiveProps(nextProps) {
    this.updateChartData(nextProps);
  }

  updateChartData(props) {
    this.setState({ chartData: chartDataFromProps(props) });
  }

  render() {
    return (
      <div>
        <Graph chartData={this.state.chartData} />
        <Results
          chartType={this.props.chartType}
          {...this.state.chartData.results}
        />
      </div>
    );
  }
}

function chartDataFromProps(props) {
  return new ChartData(props.intervals, props.chartType, props.multiplier);
}


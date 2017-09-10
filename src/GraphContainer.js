import React, { Component } from 'react';
import Graph from './Graph';
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
    return <Graph chartData={this.state.chartData} />
  }
}

function chartDataFromProps(props) {
  return new ChartData(props.intervals, props.chartType, props.multiplier);
}


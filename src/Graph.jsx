import React, { Component } from 'react';
import Chart from 'chart.js';
import Results from './Results';
import ChartData from './chart-data';
import chartOptions from './chart-options';
import './Graph.css';

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: { total: 0, totalPeak: 0, totalSaved: 0, totalSavedPeak: 0 }
    };
  }

  componentWillReceiveProps(nextProps) {
    const data = new ChartData(nextProps.greenButtonJson.intervals, nextProps.multiplier);
    this.setState({
      data: data,
      results: {
        total: data.total,
        totalPeak: data.totalPeak,
        totalTheoretical: data.totalTheoretical,
        totalPeakTheoretical: data.totalPeakTheoretical
      }
    });

    this.updateChart(data.chartFormattedIntervals);
  }

  get ctx() {
    return this.canvas.getContext('2d');
  }

  updateChart(intervals) {
    if (this.state.chart) this.state.chart.destroy();

    const chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: intervals.starts,
        datasets: datasetsFromIntervals(intervals)
      },
      options: chartOptions
    });

    this.setState({ chart: chart });
  }

  render() {
    return (
      <div className="chart-wrapper">
        <canvas id="chart" width="400" height="400"
          ref={canvas => this.canvas = canvas}>
        </canvas>
        {this.props.loading && <div className="loading-box"><h1>Loading...</h1></div> }
        <Results {...this.state.results} />
      </div>
    );
  }
};

function datasetsFromIntervals(intervals) {
  let datasets = [
    {
      fill: 'origin',
      pointRadius: 0,
      label: 'Cost of Power Over Time',
      data: intervals.actual.costs,
      backgroundColor: ['rgba(0, 0, 132, 1.0)'],
      borderColor: ['rgba(0, 0, 132, 1.0)'],
      borderWidth: 1
    }
  ];

  if (intervals.theoretical) {
    datasets.splice(0, 0, {
      fill: 'origin',
      pointRadius: 0,
      label: 'Theoretical Cost of Power Over Time',
      data: intervals.theoretical.costs,
      backgroundColor: ['rgba(0, 255, 132, 1.0)'],
      borderColor: ['rgba(0, 255, 132, 1.0)'],
      borderWidth: 1
    });
  }

  return datasets;
}

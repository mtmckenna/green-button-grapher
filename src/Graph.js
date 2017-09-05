import React, { Component } from 'react';
import Chart from 'chart.js';
import chartOptions from './chart-options';
import './Graph.css';

export default class Graph extends Component {
  componentDidUpdate() {
    if (this.chart) { this.chart.destroy(); }
    this.updateChart();
  }

  get ctx() {
    return this.canvas.getContext('2d');
  }

  updateChart() {
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.props.labels,
        datasets: [{
          fill: 'origin',
          pointRadius: 0,
          label: 'Cost of Power Over Time',
          data: this.props.values,
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255,99,132,1)'],
          borderWidth: 1
        }]
      },
      options: chartOptions
    });
  }

  render() {
    return (
      <div className="chart-wrapper">
      <canvas id="chart" width="400" height="400"
      ref={canvas => this.canvas = canvas}>
      </canvas>
      {this.props.loading && <div className="loading-box"><h1>Loading...</h1></div> }
      </div>
    );
  }
};

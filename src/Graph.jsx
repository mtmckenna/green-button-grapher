import React, { Component } from 'react';
import Chart from 'chart.js';
import chartOptions from './chart-options';
import './Graph.css';

export default class Graph extends Component {
  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }

  get ctx() {
    if (!this.canvas) return null;
    return this.canvas.getContext('2d');
  }

  updateChart() {
    if (this.chart) this.chart.destroy();
    if (!this.ctx) return;

    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: dataFromProps(this.props),
      options: chartOptions
    });
  }

  render() {
    return (
      <div className="graph-wrapper">
        <canvas ref={canvas => this.canvas = canvas}>
        </canvas>
      </div>
    );
  }
};

function dataFromProps(props) {
  const starts = props.chartData.starts;
  const datasets = props.chartData.datasets;
  return { labels: starts, datasets: datasets };
}

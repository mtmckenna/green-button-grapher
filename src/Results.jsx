import React, { Component } from 'react';
import CHART_TYPES from './chart-types';

export default class Results extends Component {
  get formatter() {
    return CHART_TYPE_TO_FORMATTER_MAP[this.props.chartType];
  }

  get total() {
    return this.formatter(this.props.total);
  }

  get totalPeak() {
    return this.formatter(this.props.totalPeak);
  }

  get totalSaved() {
    return this.formatter(this.props.total - this.props.totalTheoretical);
  }

  get totalSavedPeak() {
    return this.formatter(this.props.totalPeak - this.props.totalPeakTheoretical);
  }

  render() {
    return (
      <div>
        <div>
          <div>Total: {this.total}</div>
          <div>Total peak: {this.totalPeak}</div>
        </div>
        <div>
          <div>Total saved: {this.totalSaved}</div>
          <div>Total saved peak: {this.totalSavedPeak}</div>
        </div>
      </div>
    );
  }
}

const CHART_TYPE_TO_FORMATTER_MAP = {};
CHART_TYPE_TO_FORMATTER_MAP[CHART_TYPES.COST] = formattedDollarAmount;
CHART_TYPE_TO_FORMATTER_MAP[CHART_TYPES.POWER_USAGE] = formattedPowerUsageAmount;

function formattedPowerUsageAmount(number) {
  return formattedNumber(number, 0) + ' kWh';
}

function formattedDollarAmount(number) {
  return '$' + formattedNumber(number, 2);
}

function formattedNumber(number, sigFigs) {
  return number.toFixed(sigFigs);
}

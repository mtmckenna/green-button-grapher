import React, { Component } from 'react';
import CHART_TYPES from './chart-types';
import './Results.css';

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
    let saved = this.props.totalTheoretical ? this.props.total - this.props.totalTheoretical : 0;
    return this.formatter(saved);
  }

  get totalSavedPeak() {
    let saved = this.props.totalPeakTheoretical ? this.props.totalPeak - this.props.totalPeakTheoretical : 0;
    return this.formatter(saved);
  }

  render() {
    return (
      <div className="results">
        <div className="result-set">
          <div>Total: {this.total}</div>
          <div>Total peak: {this.totalPeak}</div>
        </div>

        {!!this.props.totalTheoretical &&
          <div className="result-set">
            <div>Total saved: {this.totalSaved}</div>
            <div>Total saved peak: {this.totalSavedPeak}</div>
          </div>
        }
      </div>
    );
  }
}

const CHART_TYPE_TO_FORMATTER_MAP = {};
CHART_TYPE_TO_FORMATTER_MAP[CHART_TYPES.COST] = formattedDollarAmount;
CHART_TYPE_TO_FORMATTER_MAP[CHART_TYPES.POWER_USAGE] = formattedPowerUsageAmount;

function formattedPowerUsageAmount(number) {
  return numberAsLocaleString(formattedNumber(number, 0)) + ' kWh';
}

function formattedDollarAmount(number) {
  return '$' + numberAsLocaleString(formattedNumber(number, 2), { minimumFractionDigits: 2 });
}

function numberAsLocaleString(number, options) {
  return Number(number).toLocaleString(undefined, options);
}

function formattedNumber(number, sigFigs) {
  return Number(number).toFixed(sigFigs);
}

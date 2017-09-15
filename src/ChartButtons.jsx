import React, { Component } from 'react';
import CHART_TYPES from './chart-types';
import TIME_CUTS from './time-cuts';

export default class ChartButtons extends Component {
  changeChartType = (event) => {
    this.props.changeChartType(event.target.dataset.chartType);
  }

  changeTimeCut = (event) => {
    this.props.changeTimeCut(event.target.dataset.timeCut);
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>Raw Data</legend>
          <button className="button">
            Most Recent 24 Hours
          </button>
          <button className="button">Last 7 Days</button>
          <button className="button">Last 30 Days</button>
          <button
            className="button"
            data-time-cut={TIME_CUTS.ALL_TIME}
            onClick={this.changeTimeCut}>
            All Time
          </button>
        </fieldset>

        <fieldset>
          <legend>Averages</legend>
          <button
            className="button"
            data-time-cut={TIME_CUTS.AVG_DAY}
            onClick={this.changeTimeCut}>
            Day
          </button>
          <button className="button">Weekend Day</button>
          <button className="button">Week Day</button>
          <button className="button">Peak Time</button>
        </fieldset>

        <fieldset>
          <legend>Chart Type</legend>
          <div>
            <button
              className="button"
              data-chart-type={CHART_TYPES.COST}
              onClick={this.changeChartType}>
              Cost
            </button>
            <button
              className="button"
              data-chart-type={CHART_TYPES.POWER_USAGE}
              onClick={this.changeChartType}>
              Power Usage
            </button>
          </div>
        </fieldset>
      </div>
    );
  }
}

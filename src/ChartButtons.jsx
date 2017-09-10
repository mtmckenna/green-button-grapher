import React, { Component } from 'react';
import CHART_TYPES from './chart-types';

export default class ChartButtons extends Component {
  changeChartType = (event) => {
    this.props.changeChartType(event.target.dataset.chartType);
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>Time scale</legend>
          <button>Most Recent 24 Hours</button>
          <button>Last 7 Days</button>
          <button>Last 30 Days</button>
          <button>All Time</button>
        </fieldset>

        <fieldset>
          <legend>Averages</legend>
          <button>Day</button>
          <button>Weekend Day</button>
          <button>Week Day</button>
          <button>Peak Time</button>
        </fieldset>

        <fieldset>
          <legend>Chart Type</legend>
          <div>
            <button
              data-chart-type={CHART_TYPES.COST}
              onClick={this.changeChartType}>Cost</button>
            <button
              data-chart-type={CHART_TYPES.POWER_USAGE}
              onClick={this.changeChartType}>Power Usage</button>
          </div>
        </fieldset>
      </div>
    );
  }
}

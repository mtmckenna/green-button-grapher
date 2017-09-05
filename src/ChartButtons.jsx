import React, { Component } from 'react';

export default class ChartButtons extends Component {
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
            <button>Cost</button>
            <button>Power Usage</button>
          </div>
        </fieldset>
      </div>
    );
  }
}

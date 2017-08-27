import React, { Component } from 'react';

export default class TimeButtons extends Component {
  render() {
    return (
      <div className="time-buttons">
        <div id="time-range-btn-wrapper" className="btn-group-wrap">
          <div id="time-range-btn-group" className="btn-group graph-sel-group" data-toggle="buttons-radio">
            <button className="btn" data-days="1" id="most-recent-day">Most Recent 24 Hours</button>
            <button className="btn" data-days="7" id="last-7-days">Last 7 Days</button>
            <button className="btn" data-days="30" id="last-30-days">Last 30 Days</button>
            <button className="btn" data-days="0" id="all-time">All Time</button>
            <button className="btn" id="averages">Averages</button>
          </div>
        </div>

        <div id="avg-btn-wrapper" className="btn-group-wrap">
          <div id="avg-btn-group" className="btn-group graph-sel-group" data-toggle="buttons-radio">
            <button className="btn" id="avg-day">Day</button>
            <button className="btn" id="avg-weekend-day">Weekend Day</button>
            <button className="btn" id="avg-week-day">Week Day</button>
            <button className="btn" id="avg-peak-time">Peak Time</button>
          </div>
        </div>
      </div>
    );
  }
}

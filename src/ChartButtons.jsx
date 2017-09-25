import React, { Component } from 'react';
import Button from './Button';
import CHART_TYPES from './chart-types';
import TIME_CUTS from './time-cuts';
import './ChartButtons.css';

export default class ChartButtons extends Component {
  changeChartType = (event) => {
    this.props.changeChartType(event.target.dataset.type);
  }

  changeTimeCut = (event) => {
    this.props.changeTimeCut(event.target.dataset.type);
  }

  timeButtonProps(type) {
    return {
      type: type,
      onClick: this.changeTimeCut,
      currentType: this.props.currentTimeCut
    };
  }

  chartTypeProps(type) {
    return {
      type: type,
      onClick: this.changeChartType,
      currentType: this.props.currentChartType
    };
  }

  render() {
    return (
      <div>
        <div className="button-set">
          <fieldset>
            <legend>Raw Data</legend>
            <Button {...this.timeButtonProps(TIME_CUTS.MOST_RECENT_24_HOURS)}>
              Most Recent 24 Hours
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.LAST_7_DAYS)}>
              Last 7 Days
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.LAST_30_DAYS)}>
              Last 30 Days
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.ALL_TIME)}>
              All Time
            </Button>
          </fieldset>
        </div>

        <div className="button-set">
          <fieldset>
            <legend>Averages</legend>
            <Button {...this.timeButtonProps(TIME_CUTS.AVG_DAY)}>
              Day
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.AVG_WEEKEND_DAY)}>
              Weekend Day
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.AVG_WEEK_DAY)}>
              Week Day
            </Button>
            <Button {...this.timeButtonProps(TIME_CUTS.AVG_PEAK_TIME)}>
              Peak Time
            </Button>
          </fieldset>
        </div>

        <div className="button-set">
          <fieldset>
            <legend>Chart Type</legend>
            <Button {...this.chartTypeProps(CHART_TYPES.COST)}>
              Cost
            </Button>
            <Button {...this.chartTypeProps(CHART_TYPES.POWER_USAGE)}>
              Power Usage
            </Button>
          </fieldset>
        </div>
      </div>
    );
  }
}

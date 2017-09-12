import TimeCutter from './time-cutter';
import INTERVAL_TYPES from './interval-types';

import {
  CHART_TYPE_TO_PROPERTY_MAP,
  INTERVAL_TYPE_TO_PROPERTY_MAP
} from './chart-maps';

export default class ChartData {
  constructor(intervals, chartType, timeCut, multiplier) {
    this.intervals = timeCutIntervals(intervals, timeCut);
    this.theoreticalIntervals = theoreticalIntervals(this.intervals, multiplier);
    this.chartType = chartType;
    this.timeCut = timeCut;
    this.multiplier = multiplier;
  }

  get datasets() {
    let intervals = formattedComboIntervals(this.intervals, this.theoreticalIntervals, this.chartType);
    return datasetsFromFormattedComboIntervals(intervals, this.chartType);
  }


  get starts() {
    return this.intervals.map((interval) => interval.start);
  }

  get results() {
    return {
      total: total(this.intervals, this.chartType),
      totalPeak: totalPeak(this.intervals, this.chartType),
      totalTheoretical: totalTheoretical(this.theoreticalIntervals, this.chartType),
      totalPeakTheoretical: totalPeakTheoretical(this.theoreticalIntervals, this.chartType)
    }
  }
}

function total(intervals, chartType) {
  return sumOfIntervals(intervals, chartType);
}

function totalPeak(intervals, chartType) {
  return sumOfIntervals(peakIntervals(intervals), chartType);
}

function totalTheoretical(theoreticalIntervals, chartType) {
  if (!theoreticalIntervals) return 0;
  return sumOfIntervals(theoreticalIntervals, chartType);
}

function totalPeakTheoretical(theoreticalIntervals, chartType) {
  if (!theoreticalIntervals) return 0;
  return sumOfIntervals(peakIntervals(theoreticalIntervals), chartType);
}

function timeCutIntervals(intervals, timeCut) {
  return new TimeCutter(intervals, timeCut).intervals;
}

function peakIntervals(intervals) {
  return intervals.filter(function(interval) {
    return dateIsPeak(new Date(interval.start));
  })
}

function sumOfIntervals(intervals, chartType) {
  return intervals.reduce(function(sum, interval) {
    return sum + interval[CHART_TYPE_TO_PROPERTY_MAP[chartType].dataType];
  }, 0);
}

function formattedIntervals(intervals, chartType) {
  if (!intervals) return null;
  const key = CHART_TYPE_TO_PROPERTY_MAP[chartType].dataType;
  return intervals.map((interval) => interval[key]);
}

function theoreticalIntervals(intervals, multiplier) {
  if (multiplier === 1.0) return null;

  return intervals.map(function(interval) {
    return {
      start: interval.start,
      value: multiplier * interval.value,
      cost: multiplier * interval.cost
    };
  });
}

function dateIsPeak(date) {
  const day = date.getDay();
  const hour = date.getHours();
  const weekday = day > 0 && day < 6;
  const peakHours = hour >= 12 && hour <= 18;
  return weekday && peakHours;
}

function formattedComboIntervals(intervals, theoreticalIntervals, chartType) {
  return [
    {
      type: INTERVAL_TYPES.THEORETICAL,
      data: formattedIntervals(theoreticalIntervals, chartType)
    },
    {
      type: INTERVAL_TYPES.ACTUAL,
      data: formattedIntervals(intervals, chartType)
    }
  ];
}

function datasetsFromFormattedComboIntervals(formattedIntervals, chartType) {
  return formattedIntervals.filter((interval) => !!interval.data)
    .map(function(interval) {
      const title = `${INTERVAL_TYPE_TO_PROPERTY_MAP[interval.type].titlePrefix} ${CHART_TYPE_TO_PROPERTY_MAP[chartType].chartTitle}`;
      return {
        fill: 'origin',
        pointRadius: 0,
        borderWidth: 1,
        label: title,
        data: interval.data,
        backgroundColor: INTERVAL_TYPE_TO_PROPERTY_MAP[interval.type].backgroundColor,
        borderColor: INTERVAL_TYPE_TO_PROPERTY_MAP[interval.type].borderColor
      };
    });
}


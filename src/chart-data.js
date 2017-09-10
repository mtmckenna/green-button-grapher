import INTERVAL_TYPES from './interval-types';

import {
  CHART_TYPE_TO_PROPERTY_MAP,
  INTERVAL_TYPE_TO_PROPERTY_MAP
} from './chart-maps';

export default class DataFormatter {
  constructor(intervals, chartType, multiplier) {
    this.intervals = intervals;
    this.chartType = chartType;
    this.multiplier = multiplier;
    this.theoreticalIntervals = theoreticalIntervals(intervals, multiplier);
  }

  get datasets() {
    return datasetsFromIntervals(this.formattedIntervals, this.chartType);
  }

  get formattedIntervals() {
    return [
      {
        type: INTERVAL_TYPES.THEORETICAL,
        data: formattedIntervals(this.theoreticalIntervals, this.chartType)
      },
      {
        type: INTERVAL_TYPES.ACTUAL,
        data: formattedIntervals(this.intervals, this.chartType)
      }
    ];
  }

  get starts() {
    return this.intervals.map((interval) => formattedDateTime(interval.start));
  }

  get results() {
    return {
      total: this.total,
      totalPeak: this.totalPeak,
      totalTheoretical: this.totalTheoretical,
      totalPeakTheoretical: this.totalPeakTheoretical
    }
  }

  get total() {
    return sumOfIntervals(this.intervals, this.chartType);
  }

  get totalPeak() {
    return sumOfIntervals(peakIntervals(this.intervals), this.chartType);
  }

  get totalTheoretical() {
    if (!this.theoreticalIntervals) return 0;
    return sumOfIntervals(this.theoreticalIntervals, this.chartType);
  }

  get totalPeakTheoretical() {
    if (!this.theoreticalIntervals) return 0;
    return sumOfIntervals(peakIntervals(this.theoreticalIntervals), this.chartType);
  }
}

function peakIntervals(intervals) {
  return intervals.filter(function(interval) {
    return dateIsPeak(interval.start);
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

function datePad(number) {
  let string = number.toString();
  while (string.length < 2) string = 0 + string;
  return string;
}

function formattedDateTime(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${datePad(month)}/${datePad(day)} ${datePad(hour)}:${datePad(minutes)}`;
}

function datasetsFromIntervals(intervals, chartType) {
  return intervals.filter((interval) => !!interval.data)
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


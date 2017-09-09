import chartTypes from './chart-types';

const CHART_TYPE_TO_DATA_TYPE_MAP = {};
CHART_TYPE_TO_DATA_TYPE_MAP[chartTypes.COST] = 'cost';
CHART_TYPE_TO_DATA_TYPE_MAP[chartTypes.POWER_USAGE] = 'value';

export default class DataFormatter {
  constructor(intervals, chartType, multiplier) {
    this.intervals = intervals;
    this.chartType = chartType;
    this.multiplier = multiplier;
    this.theoreticalIntervals = theoreticalIntervals(intervals, multiplier);
  }

  get chartFormattedIntervals() {
    return {
      starts: this.intervals.map((interval) => formattedDateTime(interval.start)),
      actual: formattedIntervals(this.intervals, this.chartType),
      theoretical: formattedIntervals(this.theoreticalIntervals, this.chartType)
    };
  }

  get total() {
    return totalCostOfIntervals(this.intervals);
  }

  get totalPeak() {
    return totalCostOfIntervals(peakIntervals(this.intervals));
  }

  get totalTheoretical() {
    if (!this.theoreticalIntervals) return 0;
    return totalCostOfIntervals(this.theoreticalIntervals);
  }

  get totalPeakTheoretical() {
    if (!this.theoreticalIntervals) return 0;
    return totalCostOfIntervals(peakIntervals(this.theoreticalIntervals));
  }
}

function peakIntervals(intervals) {
  return intervals.filter(function(interval) {
    return dateIsPeak(interval.start);
  })
}

function totalCostOfIntervals(intervals) {
  return intervals.reduce(function(sum, interval) {
    return sum + interval.cost;
  }, 0);
}

function formattedIntervals(intervals, chartType) {
  if (!intervals) return null;
  const key = CHART_TYPE_TO_DATA_TYPE_MAP[chartType];
  return {
    data: intervals.map((interval) => interval[key])
  }
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
  const peakHours = hour >= 12 && hour <= 18
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

export default class DataFormatter {
  constructor(intervals, multiplier) {
    this.intervals = intervals;
    this.theoreticalIntervals = theoreticalIntervals(intervals, multiplier);
    this.multiplier = multiplier;
  }

  get chartFormattedIntervals() {
    return {
      starts: this.intervals.map((interval) => formattedDateTime(interval.start)),
      actual: formattedIntervals(this.intervals),
      theoretical: formattedIntervals(this.theoreticalIntervals)
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

function formattedIntervals(intervals) {
  if (!intervals) return null;
  return {
    values: intervals.map((interval) => interval.value),
    costs: intervals.map((interval) => interval.cost)
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

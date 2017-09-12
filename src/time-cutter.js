import TIME_CUTS from './time-cuts';

const TIME_CUTS_TO_CUTTER_MAP = {};
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_DAY] = avgDayCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.ALL_TIME] = allTimeCutter;

export default class TimeCutter {
  constructor(intervals, timeCut) {
    this.originalIntervals = intervals;
    this.timeCut = timeCut;
  }

  get intervals() {
    return TIME_CUTS_TO_CUTTER_MAP[this.timeCut](this.originalIntervals);
  }
};

function avgDayCutter(originalIntervals) {
  return intervalsByHour(originalIntervals).map(function(intervals) {
    return {
      start: formattedDay(intervals[0].start),
      value: average(intervals.map(interval => interval.value)),
      cost: average(intervals.map(interval => interval.cost))
    }
  });
}

function allTimeCutter(originalIntervals) {
  return originalIntervals.map(function(interval) {
    return {
      start: formattedFullDate(interval.start),
      value: interval.value,
      cost: interval.cost
    }
  });
}

function intervalsByHour(intervals) {
  return intervals.reduce(function(array, interval) {
    array[interval.start.getHours()].push(interval);
    return array;
  }, emptyDayArray());
}

function average(array) {
  return array.reduce(function(sum, value) {
    return sum + value;
  }, 0) / array.length;
}

function emptyDayArray() {
  return new Array(24).fill(null).map(element => []);
}

function datePad(number) {
  let string = number.toString();
  while (string.length < 2) string = 0 + string;
  return string;
}

function formattedDay(date) {
  const hour = date.getHours();
  return `${datePad(hour)}:00`;
}

function formattedFullDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${datePad(month)}/${datePad(day)} ${datePad(hour)}:${datePad(minutes)}`;
}


import TIME_CUTS from './time-cuts';

const TIME_CUTS_TO_CUTTER_MAP = {};
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_DAY] = avgDayCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.ALL_TIME] = allTimeCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.MOST_RECENT_24_HOURS] = mostRecent24HoursCutter;

// Make the average day a Monday so it will have peak hours
const avgDayDate = new Date('2017/9/18');

export default class TimeCutter {
  constructor(intervals, timeCut) {
    this.originalIntervals = intervals;
    this.timeCut = timeCut;
  }

  get intervals() {
    return TIME_CUTS_TO_CUTTER_MAP[this.timeCut](this.originalIntervals);
  }
};

function mostRecent24HoursCutter(originalIntervals) {
  let mostRecentDate = originalIntervals[originalIntervals.length - 1].start;
  return originalIntervals.filter(function(interval) {
    return sameDay(mostRecentDate, interval.start);
  });
}

function avgDayCutter(originalIntervals) {
  return intervalsByHour(originalIntervals).map(function(intervals) {
    let date = new Date(avgDayDate);
    date.setHours(intervals[0].start.getHours());
    return {
      start: date,
      value: average(intervals.map(interval => interval.value)),
      cost: average(intervals.map(interval => interval.cost))
    };
  });
}

function allTimeCutter(originalIntervals) {
  return originalIntervals;
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

function sameDay(date1, date2) {
  return date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear();
}

import TIME_CUTS from './time-cuts';
import { peakDate, weekend, sameDay } from './date-checkers';

const TIME_CUTS_TO_CUTTER_MAP = {};
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_DAY] = avgDayCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_WEEKEND_DAY] = avgWeekendDayCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_WEEK_DAY] = avgWeekDayCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.AVG_PEAK_TIME] = avgPeakTimeCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.ALL_TIME] = allTimeCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.MOST_RECENT_24_HOURS] = mostRecent24HoursCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.LAST_7_DAYS] = last7DaysCutter;
TIME_CUTS_TO_CUTTER_MAP[TIME_CUTS.LAST_30_DAYS] = last30DaysCutter;

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

function last7DaysCutter(originalIntervals) {
  return previousDaysCutter(originalIntervals, 7);
}

function last30DaysCutter(originalIntervals) {
  return previousDaysCutter(originalIntervals, 30);
}

function previousDaysCutter(originalIntervals, numberOfDays) {
  let date = originalIntervals[originalIntervals.length - 1].start;
  date.setDate(date.getDate() - numberOfDays);
  return originalIntervals.filter(function(interval) {
    return interval.start >= date;
  });
}

function avgWeekendDayCutter(originalIntervals) {
  return avgDayCutter((originalIntervals.filter(function(interval) {
    return weekend(interval.start);
  })));
}

function avgWeekDayCutter(originalIntervals) {
  return avgDayCutter((originalIntervals.filter(function(interval) {
    return !weekend(interval.start);
  })));
}

function avgPeakTimeCutter(originalIntervals) {
  return avgDayCutter(originalIntervals.filter(function(interval) {
    return peakDate(interval.start);
  }));
}

function avgDayCutter(originalIntervals) {
  return intervalsByHour(originalIntervals)
    .filter((intervals) => !!intervals.length)
    .map(function(intervals) {
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


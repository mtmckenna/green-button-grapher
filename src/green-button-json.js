const COST_DIVISOR = 100000;
export default class GreenButtonJson {
  constructor(xml = document.implementation.createDocument(null, 'feed')) {
    this.xml = xml;
  }

  get address() {
    if (this._address) return this._address;

    this._address = this.xml.querySelector('entry > title').innerHTML;

    return this._address;
  }

  get intervals() {
    if (this._intervals) return this._intervals;
    let xmlIntervals = Array.from(this.xml.querySelectorAll('IntervalReading'));

    this._intervals = xmlIntervals.map(function(interval) {
      let costElement = interval.getElementsByTagName('cost')[0];
      return {
        start: dateFromStart(interval.getElementsByTagName('start')[0].innerHTML),
        value: Number(interval.getElementsByTagName('value')[0].innerHTML),
        cost: costElement ? Number(costElement.innerHTML) / COST_DIVISOR : 0.0
      }
    });

    return this._intervals;
  }

  get chartFormattedIntervals() {
    if (this._chartFormattedIntervals) return this._chartFormattedIntervals;

    this._chartFormattedIntervals = {
      starts: this.intervals.map((interval) => formattedDateTime(interval.start)),
      values: this.intervals.map((interval) => interval.value),
      costs: this.intervals.map((interval) => interval.cost)
    }

    return this._chartFormattedIntervals;
  }

  get total() {
    return totalCostOfIntervals(this.intervals);
  }

  get totalPeak() {
    return totalCostOfIntervals(peakIntervals(this.intervals));
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

function dateIsPeak(date) {
  const day = date.getDay();
  const hour = date.getHours();
  const weekday = day > 0 && day < 6;
  const peakHours = hour >= 12 && hour <= 18
  return weekday && peakHours;
}

function dateFromStart(startString) {
  const startInMs = Number(startString) * 1000;
  return new Date(startInMs);
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

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
        start: Number(interval.getElementsByTagName('start')[0].innerHTML),
        value: Number(interval.getElementsByTagName('value')[0].innerHTML),
        cost: costElement ? Number(costElement.innerHTML) / COST_DIVISOR : 0.0
      }
    });

    return this._intervals;
  }

  get chartFormattedIntervals() {
    if (this._chartFormattedIntervals) return this._chartFormattedIntervals;

    this._chartFormattedIntervals = {
      starts: this.intervals.map((interval) => interval.start),
      values: this.intervals.map((interval) => interval.value),
      costs: this.intervals.map((interval) => interval.cost)
    }

    return this._chartFormattedIntervals;
  }

  get total() {
    return this.intervals.reduce(function(sum, interval) {
      return sum + interval.cost;
    }, 0);
  }
}

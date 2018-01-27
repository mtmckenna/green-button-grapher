const COST_DIVISOR = 100000;
const NAME_SPACE = '*';

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
      let costElement = interval.getElementsByTagNameNS(NAME_SPACE, 'cost')[0];
      return {
        start: dateFromStart(interval.getElementsByTagNameNS(NAME_SPACE, 'start')[0].innerHTML),
        value: Number(interval.getElementsByTagNameNS(NAME_SPACE, 'value')[0].innerHTML),
        cost: costElement ? Number(costElement.innerHTML) / COST_DIVISOR : 0.0
      }
    });

    return this._intervals;
  }
}

function dateFromStart(startString) {
  const startInMs = Number(startString) * 1000;
  return new Date(startInMs);
}


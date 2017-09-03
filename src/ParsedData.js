/* global Flotr */
import $ from 'jquery';

const app = {
  json: null,
  currentReadings: [],
  readings: [],
  theoReadings: [],
  avgDayReaings: [],
  avgWeekendDayReadings: [],
  avgWeekDayReadings: [],
  avgPeakTimeReadings: [],
  totalValue: 0,
  totalPeakValue: 0,
  totalTheoValue: 0,
  totalTheoPeakValue: 0,
  readingType: 'cost',
  readingTypeMap: {
    'cost': {
      'units': 'Dollars',
      'title': 'Cost of Power Over Time'
    },
    'value': {
      'units': 'kWh',
      'title': 'Power Usage Over Time'
    }
  },
  modeXAxis: 'time',
  xMin: null,
  xMax: null,
  yMin: null,
  yMax: null,
  shadedRanges: [],
  xml: null,
  DAY_IN_MS: 86400000,
  MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  hours: [],
  ticks: null
}

app.handleTimeRangeButtons = function(e) {
  var target = e.target;

  // Plot days if 'days' attribtue exists
  if (typeof $(target).data('days') !== 'undefined') {
    this.plotPreviousDays($(target).data('days'));
  }

  // Show/hide averages button group
  if (target.id  === 'averages') {
    $('#avg-btn-group').css('display', 'inline-block');
    //$('#avg-day').click();
    $('#avg-btn-group').click();
  } else {
    $('#avg-btn-group').css('display', 'none');
  }
};

app.handleAvgButtons = function(e) {
  var target = e.target;

  switch(target.id) {
    case 'avg-day':
      this.plotAvgDay();
      break;
    case 'avg-weekend-day':
      this.plotAvgWeekendDay();
      break;
    case 'avg-week-day':
      this.plotAvgWeekDay();
      break;
    case 'avg-peak-time':
      this.plotAvgPeakTime();
      break;
    default:
      //var activeButton = $('#avg-btn-group').find()
      $('#avg-day').click();
      console.log('warning: unknown avg button clicked');
      break;
  }
};

app.updateTheoValues = function(percent) {
  this.theoReadings = [];
  for (var i = 0; i < this.currentReadings.length; i++) {
    this.theoReadings[i] = {};
    this.theoReadings[i]['start'] = this.currentReadings[i]['start'];
    this.theoReadings[i][this.readingType] = this.currentReadings[i][this.readingType] * (0.5 + percent);
  }
  this.plot();
};

app.handleFileDidLoad = function(e) {
};

app.sliderWasSlid = function(event, ui) {
  this.updateTheoValues(event.currentTarget.value/100);
};

app.setCurrentReadings = function(readings) {
  this.currentReadings = readings;

  // The theoretical readings will be used to show savings
  this.theoReadings = [];
  $.extend(true, this.theoReadings, this.currentReadings);
};

app.getShadedRanges = function() {
  var ranges = [];
  //var start = null;

  // If xMax <= 23, then there must only be a day's worth of data
  if (Number(this.xMax) <= Number(23)) {
    this.shadedRanges = [[12, 19]];
    return;
  }

  var HOUR = 1000 * 60 * 60;
  var minDate = new Date(this.xMin);
  minDate.setHours(1, 0, 0, 0);
  var minTime = minDate.getTime();

  var maxDate = new Date(this.xMax);
  maxDate.setHours(23, 0, 0, 0);
  var maxTime = maxDate.getTime();

  for (var i = minTime; i < maxTime; i += this.DAY_IN_MS) {
    ranges.push([i + 12 * HOUR, i + 19 * HOUR]);
  }

  this.shadedRanges = ranges;
};

// Returns index of app.intervals of the first instance of the passed date
app.getDateIndex = function(dateToFind) {
  dateToFind.setHours(0, 0, 0, 0);
  var minIndex = 0;
  var maxIndex = this.readings.length - 1;
  //var prevMatchIndex = null;

  // Binary search
  while (minIndex <= maxIndex) {
    var midIndex = Math.floor((maxIndex + minIndex)/2);
    var date = new Date(this.readings[midIndex]['start']);
    date.setHours(0, 0, 0, 0);

    // If we have a match, return index
    // Just going to check to see if it's in the same day for now...
    if (date.getTime() === dateToFind.getTime()) {
      return midIndex;
    } else {
      // If date is too small, go left
      if (date < dateToFind) {
        minIndex = midIndex + 1;
      }
      // If date is too big, go right
      else if (date > dateToFind) {
        maxIndex = midIndex - 1;
      }
    }
  }

  // Coudln't find the exact date. Return closest index.
  return  midIndex;
};

app.getXMinXMax = function() {
  this.xMin = this.currentReadings[0]['start'];
  this.xMax = this.currentReadings[this.currentReadings.length - 1]['start'];
}
app.getYMinYMax = function() {
  this.yMin = 0;
  this.yMax = .1;

  // TODO: this method can be more efficient
  for (var i = 0; i < this.currentReadings.length; i++) {
    if (this.currentReadings[i]['start'] < this.xMin ||
      this.currentReadings[i]['start'] > this.xMax) {
      continue;
    }

    var reading = this.currentReadings[i][this.readingType];

    //console.log('reading: ' + reading);
    if (reading > this.yMax) {
      this.yMax = reading;
      continue;
    }

    if (reading < this.yMin) {
      this.yMin = reading;
    }
  }
};

app.getTotals = function() {
  this.totalValue = 0;
  this.totalPeakValue = 0;
  this.totalTheoValue = 0;
  this.totalTheoPeakValue = 0;
  var i, j;

  // TODO: this code is not efficient.
  for (i = 0; i < this.currentReadings.length; i++) {
    var start = this.currentReadings[i]['start'];
    var value = this.currentReadings[i][this.readingType];
    var theoValue = this.theoReadings[i][this.readingType];
    if (start < this.xMin) continue;
    if (start > this.xMax) continue;
    this.totalValue += value;
    this.totalTheoValue += theoValue;

    for (j = 0; j < this.shadedRanges.length; j++) {
      var begin = this.shadedRanges[j][0];
      var end = this.shadedRanges[j][1];
      if (start >= begin && start < end) {
        this.totalPeakValue += value;
        this.totalTheoPeakValue += theoValue;
      }
    }
  }
};

app.getReadingsByHour = function(readings) {
  var readingsByHour = {};
  for (var i = 0; i < readings.length; i++) {
    var hour = new Date(readings[i]['start']).getHours();

    // If this day is already in array, push value on top
    var updatedHour = readingsByHour[hour] || [];
    updatedHour.push({
      'value': readings[i]['value'],
      'cost': readings[i]['cost']
    });
    readingsByHour[hour] = updatedHour;
  }

  return readingsByHour;
}

app.getAvgArray = function(readings) {
  var readingsByHour = {};
  var i, j;
  for (i = 0; i < readings.length; i++) {
    var hour = new Date(readings[i]['start']).getHours();

    // If this day is already in array, push value on top
    var updatedHour = readingsByHour[hour] || [];
    updatedHour.push({
      'value': readings[i]['value'],
      'cost': readings[i]['cost']
    });
    readingsByHour[hour] = updatedHour;
  }

  var dateAverages = [];
  i = 0;
  for (var date in readingsByHour) {
    var valueSum = 0;
    var costSum = 0;
    var dateArray = readingsByHour[date];
    // Would like to use reduce here...
    //console.log('date: ' + dateArray);
    for (j = 0; j < dateArray.length; j++) {
      valueSum += dateArray[j]['value'];
      costSum += dateArray[j]['cost'];
    }

    dateAverages[i] = {
      'start': date,
      'cost': costSum/dateArray.length,
      'value': valueSum/dateArray.length
    };

    i++;
  }

  return dateAverages;
};

app.sortReadingsByStart = function(a, b) { return a['start'] - b['start']; };

app.plotPreviousDays = function(numDays) {
  // TODO: Check if data has been loaded
  this.xMax = this.readings[this.readings.length - 1]['start'];
  this.modeXAxis = 'time';
  this.ticks = null;

  // Date numDays from the most recent date
  if (numDays === 0) {
    this.xMin = this.readings[0]['start'];
  } else {
    var dateToFind = new Date(this.xMax - numDays * this.DAY_IN_MS);
    var index = this.getDateIndex(dateToFind);
    this.xMin = this.readings[index]['start'];
  }

  this.readings.sort(this.sortReadingsByStart);
  this.setCurrentReadings(this.readings);
  this.plot();
};

// TODO: plotAvgDay, WeekendDay, WeekDay have common functionality
// to be factored out.
app.plotAvgDay = function() {
  this.modeXAxis = 'normal';
  this.ticks = this.hours;
  this.avgDayReadings = this.getAvgArray(this.readings);
  this.avgDayReadings.sort(this.sortReadingsByStart);
  this.setCurrentReadings(this.avgDayReadings);

  this.xMin = this.currentReadings[0]['start'];
  this.xMax = this.currentReadings[this.currentReadings.length - 1]['start'];

  this.getXMinXMax();

  this.plot();
};

app.plotAvgWeekendDay = function() {

  var filteredReadings = this.readings.filter(function(reading) {
    var day = new Date(reading['start']).getDay();
    return day === 0 || day === 6;
  });

  this.avgWeekendDayReadings = this.getAvgArray(filteredReadings);
  this.avgWeekendDayReadings.sort(this.sortReadingsByStart);
  this.setCurrentReadings(this.avgWeekendDayReadings);

  this.getXMinXMax();

  this.plot();
};

app.plotAvgWeekDay = function() {
  var filteredReadings = this.readings.filter(function(reading) {
    var day = new Date(reading['start']).getDay();
    return day !== 0 || day !== 6;
  });

  this.avgWeekDayReadings = this.getAvgArray(filteredReadings);
  this.avgWeekDayReadings.sort(this.sortReadingsByStart);
  this.setCurrentReadings(this.avgWeekDayReadings);

  this.getXMinXMax();

  this.plot();
};

app.plotAvgPeakTime = function() {
  var filteredReadings = this.readings.filter(function(reading) {
    var day = new Date(reading['start']).getDay();
    var hour = new Date(reading['start']).getHours();

    return ((day !== 0 && day !== 6) && (hour >= 12 && hour <= 18));
  });

  this.avgPeakTimeReadings = this.getAvgArray(filteredReadings);
  this.avgPeakTimeReadings.sort(this.sortReadingsByStart);
  this.setCurrentReadings(this.avgPeakTimeReadings);

  this.getXMinXMax();

  this.plot();
};

app.plot = function() {
  this.getShadedRanges();
  this.getTotals();

  var readings = [];
  var theoReadings = [];
  for (var i = 0; i < this.currentReadings.length; i++) {
    readings.push([this.currentReadings[i]['start'],
      this.currentReadings[i][this.readingType]]);

    theoReadings.push([this.theoReadings[i]['start'],
      this.theoReadings[i][this.readingType]]);
  }

  var series = [{data: readings, lines: {fill: true}}];

  // If theoretical readings are different from actual, draw theo readings too
  if (!$(this.currentReadings).compare(this.theoReadings)) {
    series.push({data: theoReadings, lines: {fill: true}});
    $('#amount-saved').show();
  } else {
    $('#amount-saved').hide();
  }

  this.getYMinYMax();

  if (this.readingType === 'cost') {
    $('#total').html('<strong>Total cost:</strong> $' + Math.round(this.totalValue * 100)/100);
    $('#total-peak').html('<strong>Cost during peak time:</strong> $' + Math.round(this.totalPeakValue * 100)/100);
    $('#total-saved').html('<strong>Total cost saved:</strong> $' + Math.round((this.totalValue - this.totalTheoValue) * 100)/100);
    $('#total-peak-saved').html('<strong>Total cost saved during peak time:</strong> $' + Math.round((this.totalPeakValue - this.totalTheoPeakValue) * 100)/100);
  } else {
    $('#total').html('<strong>Total power usage:</strong> ' + Math.round(this.totalValue * 100)/100 + 'kWh');
    $('#total-peak').html('<strong>Total usage during peak time:</strong> ' + Math.round(this.totalPeakValue * 100)/100 + 'kWh');
    $('#total-saved').html('<strong>Total power saved:</strong> ' + Math.round((this.totalValue - this.totalTheoValue) * 100)/100 + 'kWh');
    $('#total-peak-saved').html('<strong>Total power saved during peak time:</strong> ' + Math.round((this.totalPeakValue - this.totalTheoPeakValue) * 100)/100 + 'kWh');

  }

  var that = this;
  // Draw Graph
  Flotr.draw($('#graph')[0], series, {
    xaxis: {
      ticks: this.ticks,
      min: this.xMin,
      max: this.xMax,
      mode: this.modeXAxis,
      labelsAngle: 45,
      title: 'Date',
      noTicks: 10,
      tickFormatter: function(o) { return that.timeTickFormatter(o); },
      shade: {'ranges': this.shadedRanges,
        'fillColor': '#e88ba1',
        'fillOpacity': '1'
      }
    },
    yaxis: {
      min: this.yMin - Math.abs(this.yMin)* 0.05,
      max: this.yMax + Math.abs(this.yMax)* 0.05,
      showLabels: true,
      titleAngle: 90,
      title: this.readingTypeMap[this.readingType]['units'],
      minorTicks: true,
      tickDecimals: 2,
      showMinorLabels: true
    },
    grid: {
      horizontalLines: false,
      verticalLines: false,
      outlineWidth: 1,
      backgroundColor: '#d7e0d2',
      fillOpacity: .4
    },
    lines: {
      fill: false,
      fillOpacity: 1
    },
    HtmlText: false,
    title: this.readingTypeMap[this.readingType]['title']
  });
};

// Modified version of:
// http://jsfiddle.net/cesutherland/RwVjv/9/
app.timeTickFormatter = function (o) {
  var tick = '';
  var hours;
  var minutes;

  if (o > 23) {
    var d = new Date(o);
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();

    minutes = d.getMinutes();
    hours = d.getHours();

    tick+= this.MONTHS[month] + ' ';

    if (day < 10) {
      tick += '0';
    }
    tick +=  day + ' ';

    tick += (year);
  } else {
    hours = o;
    minutes = 0;
  }

  // If <= 7 days, print time as well
  if((this.xMax - this.xMin)/this.DAY_IN_MS <= 8) {
    var amPm = (hours < 12) ? 'AM' : 'PM';
    hours = (hours > 12) ? hours - 12 : hours;
    // Handle midnight
    hours = (hours === 0) ? 12 : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    tick += ' ' + hours + ':' + minutes + ' ' + amPm;
  }

  return tick;
};

// Modified version of:
// http://stackoverflow.com/questions/1773069/using-jquery-to-compare-two-arrays
$.fn.compare = function(t) {
  if (this.length !== t.length) { return false; }
  for (var i = 0; t[i]; i++) {
    if (this[i]['value'] !== t[i]['value']) {
      return false;
    }
  }
  return true;
};

export default app;


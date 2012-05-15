var app = app || {};
app.json = null;
app.currentReadings = [];
app.readings = [];
app.theoReadings = [];
app.avgDayReaings = [];
app.avgWeekendDayReadings = [];
app.avgWeekDayReadings = [];
app.avgPeakTimeReadings = [];
app.totalValue = 0;
app.totalPeakValue = 0;
app.totalTheoValue = 0;
app.totalTheoPeakValue = 0;
app.readingType = 'cost';
app.readingTypeMap = {
    'cost': {
        'units': 'Dollars',
        'title': 'Cost of Power Over Time'
    },
    'value': {
        'units': 'kWh',
        'title': 'Power Usage Over Time'
    }
};
app.modeXAxis = 'time';
app.xMin = null;
app.xMax = null;
app.yMin = null;
app.yMax = null;
app.shadedRanges = [];
app.xml = null;
app.DAY_IN_MS = 86400000;
app.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
app.hours = [];
app.ticks = null;

app.handleTimeRangeButtons = function(e) {
    var target = e.target;

    // Plot days if 'days' attribtue exists
    if (typeof $(target).data('days') != 'undefined') {
        app.plotPreviousDays($(target).data('days'));
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
            app.plotAvgDay();
            break;
        case 'avg-weekend-day':
            app.plotAvgWeekendDay();
            break;
        case 'avg-week-day':
            app.plotAvgWeekDay();
            break;
        case 'avg-peak-time':
            app.plotAvgPeakTime();
            break;
        default:
            //var activeButton = $('#avg-btn-group').find()
            $('#avg-day').click();
            console.log('warning: unknown avg button clicked');
            break;
    }
};

app.updateTheoValues = function(percent) {
    app.theoReadings = [];
    for (var i = 0; i < app.currentReadings.length; i++) {
        app.theoReadings[i] = {};
        app.theoReadings[i]['start'] = app.currentReadings[i]['start'];
        app.theoReadings[i][app.readingType] = app.currentReadings[i][app.readingType] * (0.5 + percent);
    }
    app.plot();
};

app.handleDidSelectFile = function(e) {
    $('#loading-box').show();
    var files = e.target.files; // FileList object

    var reader = new FileReader();
    reader.onloadend = app.handleFileDidLoad;
    reader.readAsText(files[0]);
};

app.handleFileDidLoad = function(e) {
    console.log("here in handleFileDidLoad");
    var xmlString = e.target.result;
    var xml = $.parseXML(e.target.result);
    //$('#content').text(xmlString);
    app.parseGreenButtonXml(xmlString);
    $('#loading-box').hide();
};

app.sliderWasSlid = function(event, ui) {
    app.updateTheoValues(ui.value/100);
};

app.loadTestData = function() {
    $('#loading-box').show();
    console.log('Loading test XML...');
    $.ajax({
        url: 'data/pge_sample_data2.xml',
        success: function(result) {
            //console.log(result);
            app.parseGreenButtonXml(result);

            //$('#avg-btn-group').click();
            //$('#avg-day').click();
            $('#loading-box').hide();
        }
    });
};

app.setCurrentReadings = function(readings) {
    app.currentReadings = readings;

    // The theoretical readings will be used to show savings
    app.theoReadings = [];
    $.extend(true, app.theoReadings, app.currentReadings);
};

app.parseGreenButtonXml = function(xml) {
    // Save the XML for later...
    app.xml = xml;

    // Pull out the IntervalReading and conver them to JSON.
    var intervals = $(app.xml).find('IntervalReading');

    // Find address, convert to text
    var address = $($(app.xml).find('entry > title')[0]).text();
    $('#address').text(address);

    app.readings = [];
    app.theoReadings = [];
    var totalCost = 0;
    for (var i = 0; i < intervals.length; i++) {
        var start = $($(intervals[i]).find('start')).text() * 1000;
        var duration = $($(intervals[i]).find('duration')).text();
        var cost = Number($($(intervals[i]).find('cost')).text()) / 100000;
        var value = $($(intervals[i]).find('value')).text();
        totalCost += cost;

        //var date = new Date(start);
        app.readings.push({'start': start,
        'value': Number(value),
        'cost': Number(cost)});
    }

    // I think the readings will be sorted from the get-go, but
    // might as well make sure...
    app.readings.sort(app.sortReadingsByStart);

    app.xMin = app.readings[0]['start'];
    app.xMax = app.readings[app.readings.length - 1]['start'];

    app.setCurrentReadings(app.readings);

    if (totalCost === 0) {
        app.readingType = 'value';
    } else {
        app.readingType = 'cost';
    }

    // This will be the default chart
    $('#averages').click();
};

app.getShadedRanges = function() {
    var ranges = [];
    var start = null;

    // If xMax <= 23, then there must only be a day's worth of data
    if (Number(app.xMax) <= Number(23)) {
        app.shadedRanges = [[12, 19]];
        return;
    }

    var HOUR = 1000 * 60 * 60;
    var minDate = new Date(app.xMin);
    minDate.setHours(1, 0, 0, 0);
    var minTime = minDate.getTime();

    var maxDate = new Date(app.xMax);
    maxDate.setHours(23, 0, 0, 0);
    var maxTime = maxDate.getTime();

    for (var i = minTime; i < maxTime; i += app.DAY_IN_MS) {
        ranges.push([i + 12 * HOUR, i + 19 * HOUR]);
    }

    app.shadedRanges = ranges;
};

// Returns index of app.intervals of the first instance of the passed date
app.getDateIndex = function(dateToFind) {
    dateToFind.setHours(0, 0, 0, 0);
    var minIndex = 0;
    var maxIndex = app.readings.length - 1;
    var prevMatchIndex = null;

    // Binary search
    while (minIndex <= maxIndex) {
        var midIndex = Math.floor((maxIndex + minIndex)/2);
        var date = new Date(app.readings[midIndex]['start']);
        date.setHours(0, 0, 0, 0);

        // If we have a match, return index
        // Just going to check to see if it's in the same day for now...
        if (date.getTime() == dateToFind.getTime()) {
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
    app.xMin = app.currentReadings[0]['start'];
    app.xMax = app.currentReadings[app.currentReadings.length - 1]['start'];
}
app.getYMinYMax = function() {
    app.yMin = 0;
    app.yMax = .1;

    // TODO: this method can be more efficient
    for (var i = 0; i < app.currentReadings.length; i++) {
        if (app.currentReadings[i]['start'] < app.xMin ||
        app.currentReadings[i]['start'] > app.xMax) {
            continue;
        }

        var reading = app.currentReadings[i][app.readingType];

        //console.log('reading: ' + reading);
        if (reading > app.yMax) {
            app.yMax = reading;
            continue;
        }

        if (reading < app.yMin) {
            app.yMin = reading;
        }
    }
};

app.getTotals = function() {
    app.totalValue = 0;
    app.totalPeakValue = 0;
    app.totalTheoValue = 0;
    app.totalTheoPeakValue = 0;
    var i, j;

    // TODO: this code is not efficient.
    for (i = 0; i < app.currentReadings.length; i++) {
        var start = app.currentReadings[i]['start'];
        var value = app.currentReadings[i][app.readingType];
        var theoValue = app.theoReadings[i][app.readingType];
        if (start < app.xMin) continue;
        if (start > app.xMax) continue;
        app.totalValue += value;
        app.totalTheoValue += theoValue;

        for (j = 0; j < app.shadedRanges.length; j++) {
            var begin = app.shadedRanges[j][0];
            var end = app.shadedRanges[j][1];
            if (start >= begin && start < end) {
                app.totalPeakValue += value;
                app.totalTheoPeakValue += theoValue;
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
    app.xMax = app.readings[app.readings.length - 1]['start'];
    app.modeXAxis = 'time';
    app.ticks = null;

    // Date numDays from the most recent date
    if (numDays === 0) {
        app.xMin = app.readings[0]['start'];
    } else {
        var dateToFind = new Date(app.xMax - numDays * app.DAY_IN_MS);
        var index = app.getDateIndex(dateToFind);
        app.xMin = app.readings[index]['start'];
    }

    app.readings.sort(app.sortReadingsByStart);
    app.setCurrentReadings(app.readings);
    app.plot();
};

// TODO: plotAvgDay, WeekendDay, WeekDay have common functionality
// to be factored out.
app.plotAvgDay = function() {
    app.modeXAxis = 'normal';
    app.ticks = app.hours;
    app.avgDayReadings = app.getAvgArray(app.readings);
    app.avgDayReadings.sort(app.sortReadingsByStart);
    app.setCurrentReadings(app.avgDayReadings);

    app.xMin = app.currentReadings[0]['start'];
    app.xMax = app.currentReadings[app.currentReadings.length - 1]['start'];

    app.getXMinXMax();

    app.plot();
};

app.plotAvgWeekendDay = function() {

    var filteredReadings = app.readings.filter(function(reading) {
        var day = new Date(reading['start']).getDay();
        return day === 0 || day === 6;
    });

    app.avgWeekendDayReadings = app.getAvgArray(filteredReadings);
    app.avgWeekendDayReadings.sort(app.sortReadingsByStart);
    app.setCurrentReadings(app.avgWeekendDayReadings);

    app.getXMinXMax();

    app.plot();
};

app.plotAvgWeekDay = function() {
    var filteredReadings = app.readings.filter(function(reading) {
        var day = new Date(reading['start']).getDay();
        return day !== 0 || day !== 6;
    });

    app.avgWeekDayReadings = app.getAvgArray(filteredReadings);
    app.avgWeekDayReadings.sort(app.sortReadingsByStart);
    app.setCurrentReadings(app.avgWeekDayReadings);

    app.getXMinXMax();

    app.plot();
};

app.plotAvgPeakTime = function() {
    var filteredReadings = app.readings.filter(function(reading) {
        var day = new Date(reading['start']).getDay();
        var hour = new Date(reading['start']).getHours();

        return ((day !== 0 && day !== 6) && (hour >= 12 && hour <= 18));
    });

    app.avgPeakTimeReadings = app.getAvgArray(filteredReadings);
    app.avgPeakTimeReadings.sort(app.sortReadingsByStart);
    app.setCurrentReadings(app.avgPeakTimeReadings);

    app.getXMinXMax();

    app.plot();
};

app.plot = function() {
    app.getShadedRanges();
    app.getTotals();

    var readings = [];
    var theoReadings = [];
    for (var i = 0; i < app.currentReadings.length; i++) {
       readings.push([app.currentReadings[i]['start'],
       app.currentReadings[i][app.readingType]]);

       theoReadings.push([app.theoReadings[i]['start'],
       app.theoReadings[i][app.readingType]]);
    }

    var series = [{data: readings, lines: {fill: true}}];

    // If theoretical readings are different from actual, draw theo readings too
    if (!$(app.currentReadings).compare(app.theoReadings)) {
        series.push({data: theoReadings, lines: {fill: true}});
        $('#amount-saved').show();
    } else {
        $('#amount-saved').hide();
    }

    app.getYMinYMax();

    if (app.readingType === 'cost') {
        $('#total').html('<strong>Total cost:</strong> $' + Math.round(app.totalValue * 100)/100);
        $('#total-peak').html('<strong>Cost during peak time:</strong> $' + Math.round(app.totalPeakValue * 100)/100);
        $('#total-saved').html('<strong>Total cost saved:</strong> $' + Math.round((app.totalValue - app.totalTheoValue) * 100)/100);
        $('#total-peak-saved').html('<strong>Total cost saved during peak time:</strong> $' + Math.round((app.totalPeakValue - app.totalTheoPeakValue) * 100)/100);
    } else {
        $('#total').html('<strong>Total power usage:</strong> $' + Math.round(app.totalValue * 100)/100);
        $('#total-peak').html('<strong>Total usage during peak time:</strong> $' + Math.round(app.totalPeakValue * 100)/100);
    }

    // Draw Graph
    var graph = Flotr.draw($('#graph')[0], series, {
        xaxis: {
            ticks: app.ticks,
            min: app.xMin,
            max: app.xMax,
            mode: app.modeXAxis,
            labelsAngle: 45,
            title: 'Date',
            noTicks: 10,
            tickFormatter: function(o) { return app.timeTickFormatter(o); },
            shade: {'ranges': app.shadedRanges,
                'fillColor': '#e88ba1',
                'fillOpacity': '1'
            }
        },
        yaxis: {
            min: app.yMin * 0.95,
            max: app.yMax * 1.05,
            showLabels: true,
            titleAngle: 90,
            title: app.readingTypeMap[app.readingType]['units'],
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
        title: app.readingTypeMap[app.readingType]['title']
    });
};

// Modified version of:
// http://jsfiddle.net/cesutherland/RwVjv/9/
app.timeTickFormatter = function (o) {
    var tick = '';
    var hours;

    if (o > 23) {
        var
        d = new Date(o),
        year = d.getFullYear(),
        month = d.getMonth(),
        day = d.getDate();

        minutes = d.getMinutes();
        hours = d.getHours();

        tick+= app.MONTHS[month] + ' ';

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
    if((app.xMax - app.xMin)/app.DAY_IN_MS <= 8) {
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
jQuery.fn.compare = function(t) {
    if (this.length != t.length) { return false; }
    for (var i = 0; t[i]; i++) {
        if (this[i]['value'] !== t[i]['value']) {
            return false;
        }
    }
    return true;
};

// File API code mostly taken from examples on http://www.html5rocks.com/en/
$(document).ready(function() {
    console.log("Document ready...");

    for (var i = 0; i <= 23; i++) {
        app.hours.push(i);
    }

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        console.log('File APIs supported...');
        $('#file-api-alert').hide();
        $('#open-file').show();
    } else {
        console.log('File APIs NOT supported...');
        $('#file-api-alert').show();
        $('#open-file').hide();
    }

    // Open file listener
    document.getElementById('files').addEventListener('change', app.handleDidSelectFile, false);

    // Handle button clicks from the time-range bar
    $('#time-range-btn-group').click(function(e) { app.handleTimeRangeButtons(e); });

    // Handle button clicks from the time-range bar
    $('#avg-btn-group').click(function(e) { app.handleAvgButtons(e); });

    // Turn slider classes into jQuery UI sliders
    $('.slider').slider({ range: 'min' });
    $('#slider').slider('value', 50);

    $('#slider').slider({
        slide: function(event, ui) { app.sliderWasSlid(event, ui); }
    });

    // Load test data
    app.loadTestData();
});

// Replot on resize
$(window).resize(function() {
    if (app.currentReadings.length) {
        app.plot();
    }
});


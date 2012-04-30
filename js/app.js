// File API code mostly taken from examples on http://www.html5rocks.com/en/
$(document).ready(function() {
    console.log("Document ready...");

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
        console.log('File APIs supported...');
    } else {
        console.log('File APIs NOT supported...');
        alert("The File APIs are not fully supported in this browser.");
    }

    // Open file listener
    document.getElementById('files').addEventListener('change', app.handleDidSelectFile, false);

    // Handle button clicks from the time-range bar
    $('#time-range-btn-group').click(function(e) { app.handleTimeRangeButtons(e); });

    // Handle button clicks from the time-range bar
    $('#avg-btn-group').click(function(e) { app.handleAvgButtons(e); });


    // Turn slider classes into jQuery UI sliders
    $('.slider').slider();

    // Load test data
    app.testXml();
});

// Replot on resize
$(window).resize(function() {
    if (app.currentReadings.length) {
        app.plot();
    }
});

var app = app || {};
app.json = null;
app.currentReadings = [];
app.readings = [];
app.theoReadings = [];
app.avgDayReaings = [];
app.avgWeekendDayReadings = [];
app.avgWeekDayReadings = [];
app.avgPeakTimeReadings = [];
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

for (var i = 0; i <= 23; i++) {
   app.hours.push(i);
}

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

app.half = function() {
    for (var j = 0; j < app.theoReadings.length; j++) {
        app.theoReadings[j][1] = app.theoReadings[j][1]/2;
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

app.testXml = function() {
    $('#loading-box').show();
    console.log('Loading test XML...');
    $.ajax({
        url: 'data/pge_sample_data.xml',
        success: function(result) {
            //console.log(result);
            app.parseGreenButtonXml(result);
            //$('#most-recent-day').trigger('click');
            $('#avg-btn-group').click();
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
    console.log('address: ' + address);
    $('#address').html(address);

    app.readings = [];
    app.theoReadings = [];
    for (var i = 0; i < intervals.length; i++) {
        var start = $($(intervals[i]).find('start')).text() * 1000;
        var duration = $($(intervals[i]).find('duration')).text();
        var value = $($(intervals[i]).find('value')).text();

        //var date = new Date(start);
        app.readings.push([start, Number(value)]);
    }

    // I think the readings will be sorted from the get-go, but
    // might as well make sure...
    app.readings.sort(function(a, b) { return a[0] - b[0]; });

    app.xMin = app.readings[0][0];
    app.xMax = app.readings[app.readings.length - 1][0];

    app.setCurrentReadings(app.readings);
    app.plot();
};

app.getShadedRanges = function() {
    return [[2,5], [8, 16]];
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
        var date = new Date(app.readings[midIndex][0]);
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

app.getYMinYMax = function() {
    app.yMin = 0;
    app.yMax = 10;

    // TODO: this method can be more efficient
    for (var i = 0; i < app.currentReadings.length; i++) {
        if (app.currentReadings[i][0] < app.xMin ||
        app.currentReadings[i][0] > app.xMax) {
            continue;
        }

        var reading = app.currentReadings[i][1];

        if (reading > app.yMax) {
            app.yMax = reading;
            continue;
        }

        if (reading < app.yMin) {
            app.yMin = reading;
        }
    }
};

app.getAvgArray = function(dateDict) {
    var dateAverages = [];
    var i = 0;
    for (var date in dateDict) {
        var valueSum = 0;
        var dateArray = dateDict[date];
        // Would like to use reduce here...
        //console.log('date: ' + dateArray);
        for (var j = 0; j < dateArray.length; j++) {
           valueSum += dateArray[j];
        }
       dateAverages[i] = [date, valueSum/dateArray.length];
       i++;
    }

    return dateAverages;
};

app.plotPreviousDays = function(numDays) {
    // TODO: Check if data has been loaded
    app.xMax = app.readings[app.readings.length - 1][0];
    app.modeXAxis = 'time';
    app.ticks = null;

    // Date numDays from the most recent date
    if (numDays === 0) {
        app.xMin = app.readings[0][0];
    } else {
        var dateToFind = new Date(app.xMax - numDays * app.DAY_IN_MS);
        app.xMin = app.readings[app.getDateIndex(dateToFind)][0];
    }

app.setCurrentReadings(app.readings);
    app.plot();
};

// TODO: plotAvgDay, WeekendDay, WeekDay have common functionality
// to be factored out.
app.plotAvgDay = function() {
    app.modeXAxis = 'normal';
    app.ticks = app.hours;
    var readingsByHour = {};
    for (var i = 0; i < app.readings.length; i++) {
        var hour = new Date(app.readings[i][0]).getHours();

        // If this day is already in array, push value on top
        var updatedHour = readingsByHour[hour] || [];
        updatedHour.push(app.readings[i][1]);
        readingsByHour[hour] = updatedHour;
    }

    app.avgDayReadings = app.getAvgArray(readingsByHour);
    app.avgDayReadings.sort(function(a, b) { return a[0] - b[0]; });
    app.setCurrentReadings(app.avgDayReadings);

    app.xMin = app.currentReadings[0][0];
    app.xMax = app.currentReadings[app.currentReadings.length - 1][0];
    app.shadedRanges = app.getShadedRanges();

    app.plot();
};

app.plotAvgWeekendDay = function() {
    var readingsByHour = {};
    for (var i = 0; i < app.readings.length; i++) {
        var day = new Date(app.readings[i][0]).getDay();
        if (day !== 0 && day !== 6) { continue; }

        var hour = new Date(app.readings[i][0]).getHours();

        // If this day is already in array, push value on top
        var updatedHour = readingsByHour[hour] || [];
        updatedHour.push(app.readings[i][1]);
        readingsByHour[hour] = updatedHour;
    }

    app.avgWeekendDayReadings = app.getAvgArray(readingsByHour);
    app.avgWeekendDayReadings.sort(function(a, b) { return a[0] - b[0]; });
    app.setCurrentReadings(app.avgWeekendDayReadings);

    app.xMin = app.currentReadings[0][0];
    app.xMax = app.currentReadings[app.currentReadings.length - 1][0];

    app.plot();
};

app.plotAvgWeekDay = function() {
    var readingsByHour = {};
    for (var i = 0; i < app.readings.length; i++) {
        var day = new Date(app.readings[i][0]).getDay();
        if (day === 0 && day === 6) { continue; }

        var hour = new Date(app.readings[i][0]).getHours();

        // If this day is already in array, push value on top
        var updatedHour = readingsByHour[hour] || [];
        updatedHour.push(app.readings[i][1]);
        readingsByHour[hour] = updatedHour;
    }

    app.avgWeekDayReadings = app.getAvgArray(readingsByHour);
    app.avgWeekDayReadings.sort(function(a, b) { return a[0] - b[0]; });
    app.setCurrentReadings(app.avgWeekDayReadings);

    app.xMin = app.currentReadings[0][0];
    app.xMax = app.currentReadings[app.currentReadings.length - 1][0];

    app.plot();
};

app.plotAvgPeakTime = function() {
    var readingsByHour = {};
    for (var i = 0; i < app.readings.length; i++) {
        var day = new Date(app.readings[i][0]).getDay();
        var hour = new Date(app.readings[i][0]).getHours();
        if (day === 0 && day === 6) { continue; }
        if (hour < 12 || hour > 18) { continue; }

        var hour = new Date(app.readings[i][0]).getHours();

        // If this day is already in array, push value on top
        var updatedHour = readingsByHour[hour] || [];
        updatedHour.push(app.readings[i][1]);
        readingsByHour[hour] = updatedHour;
    }

    app.avgWeekendDayReadings = app.getAvgArray(readingsByHour);
    app.avgWeekendDayReadings.sort(function(a, b) { return a[0] - b[0]; });
    app.setCurrentReadings(app.avgWeekendDayReadings);

    app.xMin = app.currentReadings[0][0];
    app.xMax = app.currentReadings[app.currentReadings.length - 1][0];

    app.plot();
};

app.plot = function() {
    console.log('plot');
    var series = [{data: app.currentReadings, lines: {fill: true}}];

    // If theoretical readings are different from actual, draw theo readings too
    if (!$(app.currentReadings).compare(app.theoReadings)) {
        series.push({data: app.theoReadings, lines: {fill: true}});
    }

    app.getYMinYMax();

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
            shadeRange: app.shadedRanges
        },
        yaxis: {
            min: app.yMin * 0.95,
            max: app.yMax * 1.05,
            showLabels: true,
            titleAngle: 90,
            title: 'kWh',
            minorTicks: true,
            showMinorLabels: true
        },
        grid: {
            horizontalLines: false,
            verticalLines: false,
            outlineWidth: 0
        },
        lines: {
            fill: true,
            fillOpacity: 1
        },
        mouse: {
            track: true,
            sensibility: 3,
            trackY: false
        },
        HtmlText: false,
        title: 'Power Usage Over Time'
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
        if (this[i][1] !== t[i][1]) {
            return false;
        }
    }
    return true;
};

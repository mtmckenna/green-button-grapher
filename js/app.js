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

    $('#last-7-days').click(function() { app.plotPreviousDays(7); });
    $('#last-30-days').click(function() { app.plotPreviousDays(30); });
    $('#all-time').click(function() { app.plotPreviousDays(0); });

    // Use test data
    app.testXml();
});

var app = app || {};
app.json = null;
app.readings = [];
app.xml = null;
app.DAY_IN_MS = 86400000;

app.handleDidSelectFile = function(e) {
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
};

app.testXml = function() {
    console.log('Loading test XML...');
    $.ajax({
        url: 'data/1hrLP_32Days.xml',
        success: function(result) {
            console.log(result);
            app.parseGreenButtonXml(result);
        }
    });
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
    for (var i = 0; i < intervals.length; i++) {
        //var interval = intervals[i]['IntervalReading'];

        var start = $($(intervals[i]).find('start')).text() * 1000;
        var duration = $($(intervals[i]).find('duration')).text();
        var value = $($(intervals[i]).find('value')).text();

        var date = new Date(start);
        app.readings.push([start, value]);
    }

    //console.log('series: ' + JSON.stringify(series));

    var min = app.readings[0][0];
    var max = app.readings[app.readings.length - 1][0];
    app.plot(min, max);
};

app.plotPreviousDays = function(numDays) {
    // TODO: Check if data has been loaded
    var max = app.readings[app.readings.length - 1][0];

    // Date numDays from the most recent date
    var min;
    if (numDays === 0) {
        min = app.readings[0][0];
    } else {
        var dateToFind = new Date(max - numDays * app.DAY_IN_MS);
        min = app.readings[app.findDateIndex(dateToFind)][0];
    }
    app.plot(min, max);
};

// Returns index of app.intervals of the first instance of the passed date
app.findDateIndex = function(dateToFind) {
    dateToFind.setHours(0, 0, 0, 0);
    var minIndex = 0;
    var maxIndex = app.readings.length - 1;
    var prevMatchIndex = null;

    console.log('date to find: ' + dateToFind.toDateString());
    while (minIndex <= maxIndex) {
        var midIndex = Math.floor((maxIndex + minIndex)/2);
        var date = new Date(app.readings[midIndex][0]);
        date.setHours(0, 0, 0, 0);

        // If we have a match, return index
        // Just going to check to see if it's in the same day for now...
        if (date.getTime() == dateToFind.getTime()) {
            return midIndex;
        }
        else {
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



// min, max are dates in seconds
app.plot = function(min, max) {
    $.plot($('#graph'),
    [ app.readings ],
    {
        grid: {hoverable: true},
        points: {show: false},
        lines: {show: true, fill: true},
        xaxis: {
            mode: 'time',
            timeformat: '%y/%m/%d %H %P',
            min: min,
            max: max
        }

    });
};

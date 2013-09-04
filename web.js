var express = require('express')
var fs = require('fs');
var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
    var getBodyFatChoreo = new Fitbit.GetBodyFat(session); 
    var getBodyFatInputs = getBodyFatChoreo.newInputSet();

    getBodyFatInputs.setCredential('Fitbit');
    
    var today = new Date();
    var todayFormatted = today.toISOString().slice(0, 10);
    getBodyFatInputs.set_Date(todayFormatted + "/1w");

    getBodyFatChoreo.execute(
	getBodyFatInputs,
	function(results) { getBodyFatData(results, response) },
	function(error) { console.log(error.message); }
    );
});


function getBodyFatData(results, response) {
    var fatData = JSON.parse(results.get_Response())["fat"];
    var fatEntries = fatData.length;
    var latestFat = fatData[fatEntries - 1]["fat"];
    var latestDate = fatData[fatEntries - 1]["date"];
	   
    var xSum = 0;
    var xSquaredSum = 0;
    var ySum = 0;
    var xySum = 0;
    var fatPercents = [];
    for(var i = 0; i < fatEntries; i++) {
	var currFat = fatData[i]["fat"];
	fatPercents.push(currFat);
	xSum += i;
	xSquaredSum += i * i;
	ySum += currFat;
	xySum += currFat * i; 
    }

    var xMean = xSum / fatEntries;
    var xSquaredMean = xSquaredSum / fatEntries;
    var yMean = ySum / fatEntries;
    var xyMean = xySum / fatEntries;

    var slope = (xMean * yMean) - xyMean;
    slope = slope / ((xMean * xMean) - xSquaredMean);

    var yIntercept = yMean - (slope * xMean);

    var predictedData = (slope * fatEntries) + yIntercept;
    predictedData = JSON.stringify([predictedData]);
	    
    fatPercents = JSON.stringify(fatPercents);
	    
    getBodyFatGoal(response, fatPercents, latestFat, latestDate, predictedData);
}

function getBodyFatGoal(response, fatPercents, latestFat, latestDate, predictedData) {
    var getBodyFatGoalChoreo = new Fitbit.GetBodyFatGoal(session); 
    var getBodyFatGoalInputs = getBodyFatGoalChoreo.newInputSet();

    getBodyFatGoalInputs.setCredential('Fitbit');
    
    getBodyFatGoalChoreo.execute(
	getBodyFatGoalInputs,
	function(results) {
	    var fatGoal = JSON.stringify([JSON.parse(results.get_Response())["goal"]["fat"]]);
	    renderStatusPage(response, fatPercents, latestFat, latestDate, predictedData, fatGoal); },
	function(error) { console.log(error.message); }
    );
}

function renderStatusPage(response, fatPercents, latestFat, latestDate, predictedData, fatGoal) {
	    response.render("status", { fatPercents: fatPercents, fat: latestFat, date: latestDate, predictedData: predictedData, fatGoal: fatGoal });

}

var port = process.env.PORT || 8080;
app.listen(port, function() { 
    console.log("Listening on " + port);
}); 

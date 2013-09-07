var uu = require('underscore');

var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");

var statusfn = function(request, response) {
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
};

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
  
    var x1 = 0;
    var y1 = yIntercept;
    var x2 = fatEntries - 1;
    var y2 = (slope * x2) + y1;
  
    fatPercents = JSON.stringify(fatPercents);

    var data = {fatPercents: fatPercents, latestFat: latestFat, predictedData: predictedData, x1: x1, y1: y1, x2: x2, y2: y2};
	    
    getBodyFatGoal(response, data);
}

function getBodyFatGoal(response, data) {
    var getBodyFatGoalChoreo = new Fitbit.GetBodyFatGoal(session); 
    var getBodyFatGoalInputs = getBodyFatGoalChoreo.newInputSet();

    getBodyFatGoalInputs.setCredential('Fitbit');
    
    getBodyFatGoalChoreo.execute(
	getBodyFatGoalInputs,
	function(results) {
	    var fatGoal = JSON.stringify([JSON.parse(results.get_Response())["goal"]["fat"]]);
	    data.fatGoal = fatGoal;
	    renderStatusPage(response, data); },
	function(error) { console.log(error.message); }
    );
}

function renderStatusPage(response, data) {
    response.render("status", data);
}

var define_routes = function(dict) {
    var toroute = function(item) {
	return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
    };
    return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_routes({
    '/': statusfn
});

module.exports = ROUTES;

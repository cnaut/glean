var uu		= require('underscore'),
    runkeeper	= require('./runkeeper'),
    async	= require('async');

var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");
var Foursquare = require("temboo/Library/Foursquare/Users");

var statusfn = function(request, response) {
    async.parallel({
	weightData: getBodyWeight,
	weightGoal: getBodyWeightGoal,
	fatData: getBodyFat,
	fatGoal: getBodyFatGoal
    }, 
    function(err, results) {
	response.render("status", results);
    });
};

var foursquarefn = function(request, response) {
    var checkinsByUserChoreo = new Foursquare.CheckinsByUser(session);
    var checkinsByUserInputs = checkinsByUserChoreo.newInputSet();
    checkinsByUserInputs.setCredential('Foursquare');

    checkinsByUserChoreo.execute(
	checkinsByUserInputs,
	function(results) { 
	    var checkinsData = JSON.parse(results.get_Response());
	    var items = checkinsData.response.checkins.items;	 
	    var healthy = [];
	    var healthyPoints = 0;
	    var unhealthy = [];
	    var unhealthyPoints = 0;
	    var netPoints = 0;
	    for(var i = 0; i < items.length; i++) {
		var currVenue = items[i].venue;
		if(currVenue.categories[0].name.indexOf("Restaurant") != -1) {
		    unhealthy.push(currVenue.name);
		    unhealthyPoints++;
		}
		if(currVenue.categories[0].name.indexOf("Gym") != -1) {
		    healthy.push(currVenue.name);
		    healthyPoints++;
		}
	    }
	    netPoints = healthyPoints + unhealthyPoints;
	    var pointsClass = (netPoints) >= 0 ? "positive-points" : "negative-points"

	    var data = {};
	    data.checkinsData = checkinsData;
	    data.healthy = healthy;
	    data.healthyPoints = healthyPoints;
	    data.unhealthy = unhealthy;
	    data.unhealthyPoints = unhealthyPoints;
	    data.netPoints = netPoints;
	    data.pointsClass= pointsClass;
	    response.render("foursquare", data);
	},
	function(error) { console.log(error.type); }
    );
};

var runkeeperfn = function(request, response) {
    runkeeper.getRunkeeperData(response, session);
}

function getBodyFat(callback) {
    var getBodyFatChoreo = new Fitbit.GetBodyFat(session); 
    var getBodyFatInputs = getBodyFatChoreo.newInputSet();

    getBodyFatInputs.setCredential('Fitbit');
    
    var today = new Date();
    var todayFormatted = today.toISOString().slice(0, 10);
    getBodyFatInputs.set_Date(todayFormatted + "/1w");

    getBodyFatChoreo.execute(
	getBodyFatInputs,
	function(results) { 
	    var fatData = handleBodyData(results, "fat"); 
	    callback(null, fatData);
	},
	function(error) { console.log(error.message); }
    );

}

function getBodyFatGoal(callback) {
    var getBodyFatGoalChoreo = new Fitbit.GetBodyFatGoal(session); 
    var getBodyFatGoalInputs = getBodyFatGoalChoreo.newInputSet();

    getBodyFatGoalInputs.setCredential('Fitbit');
    
    getBodyFatGoalChoreo.execute(
	getBodyFatGoalInputs,
	function(results) {
	    var fatGoal = JSON.stringify([JSON.parse(results.get_Response())["goal"]["fat"]]);
	    callback(null, fatGoal); 
	},
	function(error) { console.log(error.message); }
    );
}

function getBodyWeight(callback) {
    var getBodyWeightChoreo = new Fitbit.GetBodyWeight(session); 
    var getBodyWeightInputs = getBodyWeightChoreo.newInputSet();

    getBodyWeightInputs.setCredential('Fitbit');
    
    var today = new Date();
    var todayFormatted = today.toISOString().slice(0, 10);
    getBodyWeightInputs.set_Date(todayFormatted + "/1w");

    getBodyWeightChoreo.execute(
	getBodyWeightInputs,
	function(results) { 
	    var weightData = handleBodyData(results, "weight");
	    callback(null, weightData);
	},
	function(error) { console.log(error.message); }
    );
};

function getBodyWeightGoal(callback) {
    var getBodyWeightGoalChoreo = new Fitbit.GetBodyWeightGoal(session); 
    var getBodyWeightGoalInputs = getBodyWeightGoalChoreo.newInputSet();

    getBodyWeightGoalInputs.setCredential('Fitbit');
    
    getBodyWeightGoalChoreo.execute(
	getBodyWeightGoalInputs,
	function(results) {
	    var weightGoal = JSON.stringify([JSON.parse(results.get_Response())["goal"]["weight"]]);
	    callback(null, weightGoal); 
	},
	function(error) { console.log(error.message); }
    );
}

function handleBodyData(results, metric) {
    var data = JSON.parse(results.get_Response())[metric];
    var entries = data.length;
    var latest = data[entries - 1][metric];
    var latestDate = data[entries - 1]["date"];

    var weekHigh = 0;
    var weekLow;
    var xSum = 0;
    var xSquaredSum = 0;
    var ySum = 0;
    var xySum = 0;
    var percents = [];
    for(var i = 0; i < entries; i++) {
	var curr = data[i][metric];
	percents.push(curr);
	xSum += i;
	xSquaredSum += i * i;
	ySum += curr;
	xySum += curr * i; 

	if(i == 0 || curr < weekLow)
	    weekLow = curr;

	if(curr > weekHigh)
	    weekHigh = curr;
    }

    var xMean = xSum / entries;
    var xSquaredMean = xSquaredSum / entries;
    var yMean = ySum / entries;
    var xyMean = xySum / entries;

    var slope = (xMean * yMean) - xyMean;
    slope = slope / ((xMean * xMean) - xSquaredMean);

    var yIntercept = yMean - (slope * xMean);
    var predictedData = (slope * entries) + yIntercept;
    predictedData = JSON.stringify([predictedData]);
  
    var x1 = 0;
    var y1 = yIntercept;
    var x2 = entries - 1;
    var y2 = (slope * x2) + y1;
  
    percents = JSON.stringify(percents);

    var data = {percents: percents, latest: latest, weekLow: JSON.stringify([weekLow]), weekHigh: JSON.stringify([weekHigh]), predictedData: predictedData, x1: x1, y1: y1, x2: x2, y2: y2};

    return data;
}


var define_routes = function(dict) {
    var toroute = function(item) {
	return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
    };
    return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_routes({
    '/': statusfn,
    '/foursquare': foursquarefn,
    '/runkeeper': runkeeperfn
});

module.exports = ROUTES;

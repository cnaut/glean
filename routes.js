var uu		= require('underscore'),
    fitbit      = require('./fitbit'),
    foursquare	= require('./foursquare'),
    runkeeper	= require('./runkeeper'),
    mailer      = require('./mailer'),
    async	= require('async');

var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);

fitbit.setSession(session);
runkeeper.setSession(session);
foursquare.setSession(session);

var homefn = function(request, response) {
    async.parallel({
	weightData: fitbit.getBodyWeight,
	weightGoal: fitbit.getBodyWeightGoal,
        runData: runkeeper.getRunkeeperData,
        checkinData: foursquare.getFoursquareData
    },
    function(err, results) {
        console.log(results.runData);
        console.log(results.runData.activities);
        response.render("home", results);
    });
}

var fitbitfn = function(request, response) {
    async.parallel({
	weightData: fitbit.getBodyWeight,
	weightGoal: fitbit.getBodyWeightGoal,
	fatData: fitbit.getBodyFat,
	fatGoal: fitbit.getBodyFatGoal
    }, 
    function(err, results) {
	response.render("status", results);
    });
};

var caloriesfn = function(request, response) {
    fitbit.getFoodData(response);
}

var foursquarefn = function(request, response) {
    foursquare.getFoursquareData(response, "foursquare");
};

var runkeeperfn = function(request, response) {
    runkeeper.getRunkeeperData(response, "runkeeper");
}

var sendmailfn = function(request, response) {
    mailer.sendMail();
}

var define_routes = function(dict) {
    var toroute = function(item) {
	return uu.object(uu.zip(['path', 'fn'], [item[0], item[1]]));
    };
    return uu.map(uu.pairs(dict), toroute);
};

var ROUTES = define_routes({
    '/': homefn,
    '/fitbit': fitbitfn,
    '/calories': caloriesfn,
    '/foursquare': foursquarefn,
    '/runkeeper': runkeeperfn,
    '/sendmail': sendmailfn
});

module.exports = ROUTES;

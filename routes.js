var uu		= require('underscore'),
    fitbit      = require('./fitbit'),
    foursquare	= require('./foursquare'),
    runkeeper	= require('./runkeeper'),
    async	= require('async');

var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");

var statusfn = function(request, response) {
    fitbit.setSession(session);
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

var foursquarefn = function(request, response) {
    foursquare.getFoursquareData(response, session);
};

var runkeeperfn = function(request, response) {
    runkeeper.getRunkeeperData(response, session);
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

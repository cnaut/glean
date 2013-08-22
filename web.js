var express = require('express')
var fs = require('fs');
var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession(process.env.TEMBOO_ACCOUNT_NAME, process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    var getBodyFatChoreo = new Fitbit.GetBodyFat(session); 
    var getBodyFatInputs = getBodyFatChoreo.newInputSet();

    getBodyFatInputs.setCredential('Fitbit');
    
    var today = new Date();
    var todayFormatted = today.toISOString().slice(0, 10);
    //console.log(todayFormatted);
    console.log(getBodyFatInputs.set_Date(todayFormatted + "/1w"));

    getBodyFatChoreo.execute(
	getBodyFatInputs, 
	function(results) { 
	    var fatData = JSON.parse(results.get_Response())["fat"];
	    var fatEntries = fatData.length;
	    var latestFat = fatData[fatEntries - 1]["fat"];
	    var latestDate = fatData[fatEntries - 1]["date"];
	    response.render("status", { fat: latestFat, date: latestDate });
	},
	function(error) { console.log(error.message); }
    );
});

var port = process.env.PORT || 8080;
app.listen(port, function() { 
    console.log("Listening on " + port);
}); 

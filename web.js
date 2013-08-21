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
    getBodyFatInputs.set_Date("2013-08-20");

    getBodyFatChoreo.execute(
	getBodyFatInputs, 
	function(results) { 
	    var fat = JSON.parse(results.get_Response())["fat"][0]["fat"];
	    response.render("status", { fat: fat });
	},
	function(error) { console.log(error.message); }
    );
});

var port = process.env.PORT || 8080;
app.listen(port, function() { 
    console.log("Listening on " + port);
}); 

var express = require('express')
var fs = require('fs');
var tsession = require("temboo/core/temboosession");
var session = new tsession.TembooSession("glean", process.env.TEMBOO_APP_NAME, process.env.TEMBOO_APP_KEY);
var Fitbit = require("temboo/Library/Fitbit/Body");

var app = express();
app.get('/', function(request, response) {
//    var getBodyFatChoreo = new Fitbit.GetBodyFat(session); 
//    var getBodyFatInputs = getBodyFatChoreo.newInputSet();

//    getBodyFatInputs.setCredential('Fitbit');
//   getBodyFatInputs.set_Date("2013-07-01/2013-07-14");

/*
    getBodyFatChoreo.execute(
	getBodyFatInputs, 
	//function(results) { response.send(results.get_Response()); },
	function(results) { response.send("HERE"); },
	function(error) { console.log(error.message); }
*/
response.send("Test statement");
   // );
});

var port = process.env.PORT || 8080;
app.listen(port, function() { 
    console.log("Listening on " + port);
}); 

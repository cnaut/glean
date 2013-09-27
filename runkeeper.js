// Generated by CoffeeScript 1.6.3
(function() {
  var RunKeeper, getRunkeeperData;

  RunKeeper = require("temboo/Library/RunKeeper/FitnessActivities");

  getRunkeeperData = function(response, session) {
    var retrieveActivitesChoreo, retrieveActivitesInputs;
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites(session);
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet();
    retrieveActivitesInputs.setCredential("Runkeeper");
    return retrieveActivitesChoreo.execute(retrieveActivitesInputs, (function(results) {
      return response.render("runkeeper", JSON.parse(results.get_Response()));
    }), function(error) {
      console.log(error.type);
      return console.log(error.message);
    });
  };

  module.exports = {
    getRunkeeperData: getRunkeeperData
  };

}).call(this);
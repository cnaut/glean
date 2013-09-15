RunKeeper = require "temboo/Library/RunKeeper/FitnessActivities" 
getRunkeeperData = (response, session) -> 
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites session
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet()
    retrieveActivitesInputs.setCredential "Runkeeper"
    
    retrieveActivitesChoreo.execute retrieveActivitesInputs,
    ((results) -> response.render "runkeeper", JSON.parse results.get_Response()),
    (error) -> console.log error.type; console.log error.message

module.exports =
    getRunkeeperData: getRunkeeperData

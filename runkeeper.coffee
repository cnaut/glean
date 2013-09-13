RunKeeper = require "temboo/Library/RunKeeper/FitnessActivities" 
getRunkeeperData = (response, session) -> 
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites session
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet()
    retrieveActivitesInputs.setCredential "Runkeeper"
    
    retrieveActivitesChoreo.execute retrieveActivitesInputs,
    ((results) -> console.log JSON.parse results.get_Response(); response.render "runkeeper"),
    (error) -> console.log error.type; console.log error.message

module.exports =
    getRunkeeperData: getRunkeeperData

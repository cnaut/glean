RunKeeper = require "temboo/Library/RunKeeper/FitnessActivities" 
session = null

setSession = (s) -> session = s

getRunkeeperData = (callback, renderPage) -> 
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites session
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet()
    retrieveActivitesInputs.setCredential "Runkeeper"
    
    retrieveActivitesChoreo.execute retrieveActivitesInputs,
    ((results) -> if renderPage then callback.render renderPage, JSON.parse(results.get_Response()) else callback null, JSON.parse(results.get_Response())),
    (error) -> console.log error.type; console.log error.message

module.exports =
    setSession: setSession
    getRunkeeperData: getRunkeeperData

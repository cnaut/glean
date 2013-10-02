RunKeeper = require "temboo/Library/RunKeeper/FitnessActivities" 
session = null

setSession = (s) -> session = s

getRunkeeperData = (callback, renderPage) -> 
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites session
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet()
    retrieveActivitesInputs.setCredential "Runkeeper"
    
    retrieveActivitesChoreo.execute retrieveActivitesInputs,
    ((results) ->
        activities = JSON.parse(results.get_Response()).items
        for activity in activities
            activity.total_distance = activity.total_distance * .000621
            activity.duration = activity.duration / 60
        if renderPage then callback.render renderPage, {activities: activities} else callback null, {activities: activities}),
    (error) -> console.log error.type; console.log error.message

module.exports =
    setSession: setSession
    getRunkeeperData: getRunkeeperData

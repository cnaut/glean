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
            activity.total_distance = (activity.total_distance * .000621).toFixed 2
            activity.duration = (activity.duration / 60).toFixed 2

            date_regex = /(.*)\d\d:\d\d:\d\d/
            activity.date = date_regex.exec(activity.start_time)[1]
        if renderPage then callback.render renderPage, {activities: activities} else callback null, {activities: activities}),
    (error) -> console.log error.type; console.log error.message

module.exports =
    setSession: setSession
    getRunkeeperData: getRunkeeperData

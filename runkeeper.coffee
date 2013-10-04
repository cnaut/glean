RunKeeper = require "temboo/Library/RunKeeper/FitnessActivities" 
session = null

setSession = (s) -> session = s

getRunkeeperData = (callback, renderPage) -> 
    retrieveActivitesChoreo = new RunKeeper.RetrieveActivites session
    retrieveActivitesInputs = retrieveActivitesChoreo.newInputSet()
    retrieveActivitesInputs.setCredential "Runkeeper"
    
    retrieveActivitesChoreo.execute retrieveActivitesInputs,
    ((results) ->
        today = new Date()
        thisWeek =
            runs: 0
            miles: 0
            minutes: 0

        activities = JSON.parse(results.get_Response()).items
        for activity in activities
            activity.total_distance = activity.total_distance * .000621
            activity.duration = activity.duration / 60

            activityTime = new Date activity.start_time
            #Activity date is within 7 days of today in miliseconds
            if today.getTime() - activityTime.getTime() < 7 * 86400000
                thisWeek.runs++
                thisWeek.miles += activity.total_distance
                thisWeek.minutes += activity.duration

            activity.total_distance = activity.total_distance.toFixed 2
            activity.duration = activity.duration.toFixed 2
            activity.minutes_per_mile = (activity.duration / activity.total_distance).toFixed 2

            date_regex = /(.*)\d\d:\d\d:\d\d/
            activity.date = date_regex.exec(activity.start_time)[1]
        
        thisWeek.miles = thisWeek.miles.toFixed 2
        thisWeek.minutes = thisWeek.minutes.toFixed 2

        if renderPage then callback.render renderPage, {activities: activities, thisWeek: thisWeek} else callback null, {activities: activities}),
    (error) -> console.log error.type; console.log error.message

module.exports =
    setSession: setSession
    getRunkeeperData: getRunkeeperData

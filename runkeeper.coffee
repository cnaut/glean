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
        
        lastWeek =
            runs: 0
            miles: 0
            minutes: 0

        weekDiff = {}

        activities = JSON.parse(results.get_Response()).items
        for activity in activities
            activity.total_distance = activity.total_distance * .000621
            activity.duration = activity.duration / 60

            activityTime = new Date activity.start_time
            timeSinceActivity = today.getTime() - activityTime.getTime()
            #Activity date is within 7 days of today in miliseconds
            if timeSinceActivity < 7 * 86400000
                thisWeek.runs++
                thisWeek.miles += activity.total_distance
                thisWeek.minutes += activity.duration

            if timeSinceActivity >= 7 * 86400000 and timeSinceActivity <= 14 * 86400000
                lastWeek.runs++
                lastWeek.miles += activity.total_distance
                lastWeek.minutes += activity.duration
            
            activity.total_distance = activity.total_distance.toFixed 2
            activity.duration = activity.duration.toFixed 2
            activity.minutes_per_mile = (activity.duration / activity.total_distance).toFixed 2

            dateRegex = /(.*)\d\d:\d\d:\d\d/
            activity.date = dateRegex.exec(activity.start_time)[1]
       
        weekDiff.runs = thisWeek.runs - lastWeek.runs
        weekDiff.miles = (thisWeek.miles - lastWeek.miles).toFixed 2
        weekDiff.minutes = (thisWeek.minutes - lastWeek.minutes).toFixed 2
        
        thisWeek.minutesPerMile = thisWeek.minutes / thisWeek.miles
        thisWeek.miles = thisWeek.miles.toFixed 2
        thisWeek.minutes = thisWeek.minutes.toFixed 2

        lastWeek.minutesPerMile = lastWeek.minutes / lastWeek.miles
        lastWeek.miles = lastWeek.miles.toFixed 2
        lastWeek.minutes = lastWeek.minutes.toFixed 2
            
        weekDiff.minutesPerMile = (thisWeek.minutesPerMile - lastWeek.minutesPerMile).toFixed 2
        thisWeek.minutesPerMile = thisWeek.minutesPerMile.toFixed 2
        lastWeek.minutesPerMile = lastWeek.minutesPerMile.toFixed 2
        
        weekDiff.runsClass = (if weekDiff.runs >= 0 then "positive-points" else "negative-points")
        weekDiff.milesClass = (if weekDiff.miles >= 0 then "positive-points" else "negative-points")
        weekDiff.minutesClass = (if weekDiff.minutes >= 0 then "positive-points" else "negative-points")
        weekDiff.minutesPerMileClass = (if weekDiff.minutesPerMile >= 0 then "negative-points" else "positive-points")

        console.log "These are the activities: " + activities
        if renderPage then callback.render renderPage, {activities: activities, thisWeek: thisWeek, lastWeek: lastWeek, weekDiff: weekDiff} else callback null, {activities: activities, thisWeek: thisWeek, lastWeek: lastWeek, weekDiff: weekDiff}),
    (error) -> console.log error.type; console.log error.message

module.exports =
    setSession: setSession
    getRunkeeperData: getRunkeeperData

Foursquare = require "temboo/Library/Foursquare/Users"
session = null

setSession = (s) -> session = s

getFoursquareData = (callback, renderPage) -> 
    healthy = []
    healthyPoints = 0
    unhealthy = []
    unhealthyPoints = 0
    neutral = []
    netPoints = 0

    checkinsByUserChoreo = new Foursquare.CheckinsByUser session
    checkinsByUserInputs = checkinsByUserChoreo.newInputSet()
    checkinsByUserInputs.setCredential 'Foursquare'

    checkinsByUserChoreo.execute checkinsByUserInputs,
    ((results) ->
        categorizeVenue	= (venue) ->
            if venue.categories[0]
                unhealthy.push venue.name unless venue.categories[0].name.indexOf("Restaurant") is -1
                healthy.push venue.name unless (venue.categories[0].name.indexOf("Gym") is -1 and venue.categories[0].name.indexOf("Field") is -1)
                neutral.push venue.name unless (venue.categories[0].name.indexOf("Restaurant") != -1 or venue.categories[0].name.indexOf("Gym") != -1 or venue.categories[0].name.indexOf("Field") != -1)
        
        checkinsData = JSON.parse results.get_Response()
        items = checkinsData.response.checkins.items

        categorizeVenue item.venue for item in items
        healthyPoints = healthy.length
        unhealthyPoints = unhealthy.length

        netPoints = healthyPoints - unhealthyPoints
        pointsClass = (if netPoints >= 0 then "positive-points" else "negative-points")

        data =
            checkinsData: checkinsData
            healthy: healthy
            healthyPoints: healthyPoints
            unhealthy: unhealthy
            unhealthyPoints: unhealthyPoints
            neutral: neutral
            netPoints: netPoints
            pointsClass: pointsClass
        if renderPage then callback.render renderPage, data else callback null, data),
    (error) -> console.log error.type


module.exports =
    setSession: setSession
    getFoursquareData: getFoursquareData

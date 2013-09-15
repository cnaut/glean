Foursquare = require "temboo/Library/Foursquare/Users"

healthy = []
healthyPoints = 0
unhealthy = []
unhealthyPoints = 0
netPoints = 0

getFoursquareData = (response, session) -> 
    checkinsByUserChoreo = new Foursquare.CheckinsByUser session
    checkinsByUserInputs = checkinsByUserChoreo.newInputSet()
    checkinsByUserInputs.setCredential 'Foursquare'

    checkinsByUserChoreo.execute checkinsByUserInputs,
    ((results) ->
        checkinsData = JSON.parse results.get_Response()
        items = checkinsData.response.checkins.items

        categorizeVenue item.venue for item in items
        healthyPoints = healthy.length
        unhealthyPoints = unhealthy.length

        netPoints = healthyPoints + unhealthyPoints
        pointsClass = (if netPoints >= 0 then "positive-points" else "negative-points")

        data =
            checkinsData: checkinsData
            healthy: healthy
            healthyPoints: healthyPoints
            unhealthy: unhealthy
            unhealthyPoints: unhealthyPoints
            netPoints: netPoints
            pointsClass: pointsClass
        response.render "foursquare", data),
    (error) -> console.log error.type

categorizeVenue	= (venue) ->
    unhealthy.push venue.name unless venue.categories[0].name.indexOf("Restaurant") is -1
    healthy.push venue.name unless venue.categories[0].name.indexOf("Gym") is -1

module.exports =
    getFoursquareData: getFoursquareData

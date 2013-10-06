Foursquare = require "temboo/Library/Foursquare/Users"
session = null

setSession = (s) -> session = s

healthyCategories = ["Gym", "Field"]
unhealthyCategories = ["Restaurants", "Sports Bar"]

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
        checkIfHealthy = (category) ->
            for healthyCategory in healthyCategories
                if category.name.indexOf(healthyCategory) != -1
                    return true
            return false

        checkIfUnhealthy = (category) ->
            for unhealthyCategory in unhealthyCategories
                if category.name.indexOf(unhealthyCategory) != -1
                    return true
            return false


        categorizeVenue	= (venue) ->
            if venue.categories[0]
                isHealthy = checkIfHealthy venue.categories[0]
                isUnhealthy = checkIfUnhealthy venue.categories[0]

                healthy.push venue.name unless not isHealthy
                unhealthy.push venue.name unless not isUnhealthy
                neutral.push venue.name unless (isHealthy or isUnhealthy)
        
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

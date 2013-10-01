Fitbit = require("temboo/Library/Fitbit/Body")
session = null

setSession = (s) -> session = s

getBodyWeight = (callback) ->
    getBodyWeightChoreo = new Fitbit.GetBodyWeight session
    getBodyWeightInputs = getBodyWeightChoreo.newInputSet()

    getBodyWeightInputs.setCredential 'Fitbit'
    
    today = new Date()
    todayFormatted = today.toISOString().slice 0, 10
    getBodyWeightInputs.set_Date todayFormatted + "/1w"

    getBodyWeightChoreo.execute(
        getBodyWeightInputs,
        ((results) ->
            
            weightData = handleBodyData results, "weight", kilosToPounds
            callback null, weightData),
        (error) -> console.log error.message
    )

getBodyWeightGoal= (callback) ->
    getBodyWeightGoalChoreo = new Fitbit.GetBodyWeightGoal session
    getBodyWeightGoalInputs = getBodyWeightGoalChoreo.newInputSet()

    getBodyWeightGoalInputs.setCredential 'Fitbit'
    
    getBodyWeightGoalChoreo.execute(
        getBodyWeightGoalInputs,
        ((results) ->
            weightGoal = JSON.stringify [kilosToPounds JSON.parse(results.get_Response())["goal"]["weight"]]
            callback null, weightGoal
        ),
        (error) -> console.log error.message
    )

getBodyFat = (callback) ->
    getBodyFatChoreo = new Fitbit.GetBodyFat session
    getBodyFatInputs = getBodyFatChoreo.newInputSet()

    getBodyFatInputs.setCredential 'Fitbit'
    
    today = new Date()
    todayFormatted = today.toISOString().slice 0, 10
    getBodyFatInputs.set_Date todayFormatted + "/1w"

    getBodyFatChoreo.execute getBodyFatInputs,
    ((results) -> 
        fatData = handleBodyData results, "fat"
        callback null, fatData),
    (error) -> console.log error.message

getBodyFatGoal = (callback) ->
    getBodyFatGoalChoreo = new Fitbit.GetBodyFatGoal session
    getBodyFatGoalInputs = getBodyFatGoalChoreo.newInputSet()

    getBodyFatGoalInputs.setCredential 'Fitbit'
    
    getBodyFatGoalChoreo.execute(
        getBodyFatGoalInputs,
        ((results) ->
            fatGoal = JSON.stringify [JSON.parse(results.get_Response())["goal"]["fat"]]
            callback null, fatGoal
        ),
        (error) -> console.log error.message
    )
    
handleBodyData = (results, metric, transform) ->
    data = JSON.parse(results.get_Response())[metric]
    entries = data.length
    latest = data[entries - 1][metric]
    latestDate = data[entries - 1]["date"]

    weekHigh = 0
    weekLow = null
    xSum = 0
    xSquaredSum = 0
    ySum = 0
    xySum = 0
    percents = []

    i = 0
    while i < entries
        curr = if transform then transform data[i][metric] else data[i][metric]
        percents.push curr
        xSum += i
        xSquaredSum += i * i
        ySum += curr
        xySum += curr * i
        
        if i == 0 || curr < weekLow then weekLow = curr

        if curr > weekHigh then weekHigh = curr

        i++

    xMean = xSum / entries
    xSquaredMean = xSquaredSum / entries
    yMean = ySum / entries
    xyMean = xySum / entries

    slope = (xMean * yMean) - xyMean
    slope = slope / ((xMean * xMean) - xSquaredMean)

    yIntercept = yMean - (slope * xMean)
    predictedData = (slope * entries) + yIntercept
    predictedData = JSON.stringify [roundToNearestTwo predictedData]
  
    x1 = 0
    y1 = yIntercept
    x2 = entries - 1
    y2 = (slope * x2) + y1
  
    percents = JSON.stringify percents

    data =
        percents: percents
        latest: latest
        weekLow: JSON.stringify [weekLow]
        weekHigh: JSON.stringify [weekHigh]
        predictedData: predictedData
        x1: x1
        y1: y1
        x2: x2
        y2: y2

kilosToPounds = (kilos) ->
    roundToNearestTwo kilos * 2.2

roundToNearestTwo = (num) ->
    Math.round(num *100) / 100

module.exports =
    setSession: setSession
    getBodyWeight: getBodyWeight
    getBodyWeightGoal: getBodyWeightGoal
    getBodyFat: getBodyFat
    getBodyFatGoal: getBodyFatGoal

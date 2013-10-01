// Generated by CoffeeScript 1.6.3
(function() {
  var Fitbit, getBodyFat, getBodyFatGoal, getBodyWeight, getBodyWeightGoal, handleBodyData, kilosToPounds, roundToNearestTwo, session, setSession;

  Fitbit = require("temboo/Library/Fitbit/Body");

  session = null;

  setSession = function(s) {
    return session = s;
  };

  getBodyWeight = function(callback) {
    var getBodyWeightChoreo, getBodyWeightInputs, today, todayFormatted;
    getBodyWeightChoreo = new Fitbit.GetBodyWeight(session);
    getBodyWeightInputs = getBodyWeightChoreo.newInputSet();
    getBodyWeightInputs.setCredential('Fitbit');
    today = new Date();
    todayFormatted = today.toISOString().slice(0, 10);
    getBodyWeightInputs.set_Date(todayFormatted + "/1w");
    return getBodyWeightChoreo.execute(getBodyWeightInputs, (function(results) {
      var weightData;
      weightData = handleBodyData(results, "weight", kilosToPounds);
      return callback(null, weightData);
    }), function(error) {
      return console.log(error.message);
    });
  };

  getBodyWeightGoal = function(callback) {
    var getBodyWeightGoalChoreo, getBodyWeightGoalInputs;
    getBodyWeightGoalChoreo = new Fitbit.GetBodyWeightGoal(session);
    getBodyWeightGoalInputs = getBodyWeightGoalChoreo.newInputSet();
    getBodyWeightGoalInputs.setCredential('Fitbit');
    return getBodyWeightGoalChoreo.execute(getBodyWeightGoalInputs, (function(results) {
      var weightGoal;
      weightGoal = JSON.stringify([kilosToPounds(JSON.parse(results.get_Response())["goal"]["weight"])]);
      return callback(null, weightGoal);
    }), function(error) {
      return console.log(error.message);
    });
  };

  getBodyFat = function(callback) {
    var getBodyFatChoreo, getBodyFatInputs, today, todayFormatted;
    getBodyFatChoreo = new Fitbit.GetBodyFat(session);
    getBodyFatInputs = getBodyFatChoreo.newInputSet();
    getBodyFatInputs.setCredential('Fitbit');
    today = new Date();
    todayFormatted = today.toISOString().slice(0, 10);
    getBodyFatInputs.set_Date(todayFormatted + "/1w");
    return getBodyFatChoreo.execute(getBodyFatInputs, (function(results) {
      var fatData;
      fatData = handleBodyData(results, "fat");
      return callback(null, fatData);
    }), function(error) {
      return console.log(error.message);
    });
  };

  getBodyFatGoal = function(callback) {
    var getBodyFatGoalChoreo, getBodyFatGoalInputs;
    getBodyFatGoalChoreo = new Fitbit.GetBodyFatGoal(session);
    getBodyFatGoalInputs = getBodyFatGoalChoreo.newInputSet();
    getBodyFatGoalInputs.setCredential('Fitbit');
    return getBodyFatGoalChoreo.execute(getBodyFatGoalInputs, (function(results) {
      var fatGoal;
      fatGoal = JSON.stringify([JSON.parse(results.get_Response())["goal"]["fat"]]);
      return callback(null, fatGoal);
    }), function(error) {
      return console.log(error.message);
    });
  };

  handleBodyData = function(results, metric, transform) {
    var curr, data, entries, i, latest, latestDate, percents, predictedData, slope, weekHigh, weekLow, x1, x2, xMean, xSquaredMean, xSquaredSum, xSum, xyMean, xySum, y1, y2, yIntercept, yMean, ySum;
    data = JSON.parse(results.get_Response())[metric];
    entries = data.length;
    latest = data[entries - 1][metric];
    latestDate = data[entries - 1]["date"];
    weekHigh = 0;
    weekLow = null;
    xSum = 0;
    xSquaredSum = 0;
    ySum = 0;
    xySum = 0;
    percents = [];
    i = 0;
    while (i < entries) {
      curr = transform ? transform(data[i][metric]) : data[i][metric];
      percents.push(curr);
      xSum += i;
      xSquaredSum += i * i;
      ySum += curr;
      xySum += curr * i;
      if (i === 0 || curr < weekLow) {
        weekLow = curr;
      }
      if (curr > weekHigh) {
        weekHigh = curr;
      }
      i++;
    }
    xMean = xSum / entries;
    xSquaredMean = xSquaredSum / entries;
    yMean = ySum / entries;
    xyMean = xySum / entries;
    slope = (xMean * yMean) - xyMean;
    slope = slope / ((xMean * xMean) - xSquaredMean);
    yIntercept = yMean - (slope * xMean);
    predictedData = (slope * entries) + yIntercept;
    predictedData = JSON.stringify([roundToNearestTwo(predictedData)]);
    x1 = 0;
    y1 = yIntercept;
    x2 = entries - 1;
    y2 = (slope * x2) + y1;
    percents = JSON.stringify(percents);
    return data = {
      percents: percents,
      latest: latest,
      weekLow: JSON.stringify([weekLow]),
      weekHigh: JSON.stringify([weekHigh]),
      predictedData: predictedData,
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    };
  };

  kilosToPounds = function(kilos) {
    return roundToNearestTwo(kilos * 2.2);
  };

  roundToNearestTwo = function(num) {
    return Math.round(num * 100) / 100;
  };

  module.exports = {
    setSession: setSession,
    getBodyWeight: getBodyWeight,
    getBodyWeightGoal: getBodyWeightGoal,
    getBodyFat: getBodyFat,
    getBodyFatGoal: getBodyFatGoal
  };

}).call(this);
